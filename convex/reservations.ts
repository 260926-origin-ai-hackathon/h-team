import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { fulfillment, reservationStatus } from "./schema";
import { toPublicFarmer } from "./farmers";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

/** Flat fee when the farmer ships by parcel (ヤマト運輸 宅急便). */
export const SHIPPING_FEE = 880;
export const CARRIER = "ヤマト運輸";

const JST_OFFSET = 9 * 60 * 60 * 1000;

/** Slot check in Japan time regardless of the server's timezone (Convex runs in UTC). */
function inPickupSlot(slots: { days: number[]; start: number; end: number }[], at: number) {
  const d = new Date(at + JST_OFFSET);
  const day = d.getUTCDay();
  const hour = d.getUTCHours();
  return slots.some((s) => s.days.includes(day) && hour >= s.start && hour < s.end);
}

async function withFarmer(ctx: QueryCtx, r: Doc<"reservations">) {
  const farmer = await ctx.db.get(r.farmerId);
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", r.userId))
    .unique();
  return { ...r, farmer: farmer ? await toPublicFarmer(ctx, farmer) : null, consumerName: user?.name ?? "ゲスト" };
}

/** 消費者: 予約リクエストを作成（在庫を仮押さえ）。 */
export const create = mutation({
  args: {
    userId: v.string(),
    farmerId: v.id("farmers"),
    method: fulfillment,
    pickupAt: v.optional(v.number()),
    address: v.optional(v.string()),
    note: v.optional(v.string()),
    items: v.array(v.object({ productId: v.id("products"), quantity: v.number() })),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) throw new Error("商品を選んでください");
    if (args.method === "pickup" && !args.pickupAt) throw new Error("受取日時を選んでください");
    if (args.method === "delivery" && !args.address?.trim()) throw new Error("発送先住所を入力してください");
    const farmer = await ctx.db.get(args.farmerId);
    if (!farmer || farmer.status !== "approved") throw new Error("この生産者は現在予約できません");
    if (args.method === "pickup" && args.pickupAt && !inPickupSlot(farmer.pickupSlots, args.pickupAt)) {
      throw new Error("受取可能な時間帯から選んでください");
    }
    if (args.pickupAt && args.pickupAt < Date.now()) throw new Error("過去の日時は選べません");

    const items = [];
    for (const it of args.items) {
      const p = await ctx.db.get(it.productId);
      if (!p || !p.available) throw new Error("商品が見つかりません");
      if (p.farmerId !== args.farmerId) throw new Error("別の生産者の商品が含まれています");
      if (args.method === "delivery" && !p.deliveryAvailable) throw new Error(`${p.name} は発送に対応していません`);
      if (p.stock < it.quantity) throw new Error(`${p.name} の在庫が足りません`);
      await ctx.db.patch(p._id, { stock: p.stock - it.quantity });
      items.push({ productId: p._id, name: p.name, unit: p.unit, price: p.price, quantity: it.quantity });
    }
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = args.method === "delivery" ? SHIPPING_FEE : 0;
    const now = Date.now();
    return ctx.db.insert("reservations", {
      userId: args.userId,
      farmerId: args.farmerId,
      status: "requested",
      method: args.method,
      pickupAt: args.pickupAt,
      address: args.address,
      note: args.note,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentStatus: "unpaid",
      createdAt: now,
      updatedAt: now,
      consumerReviewed: false,
      farmerReviewed: false,
    });
  },
});

/** 消費者: モック決済。カード情報は検証せず、支払い済みにする。 */
export const pay = mutation({
  args: { id: v.id("reservations"), userId: v.string() },
  handler: async (ctx, { id, userId }) => {
    const r = await ctx.db.get(id);
    if (!r || r.userId !== userId) throw new Error("予約が見つかりません");
    if (r.paymentStatus === "paid") throw new Error("すでに支払い済みです");
    if (r.status === "declined" || r.status === "cancelled") throw new Error("この予約は支払いできません");
    await ctx.db.patch(id, { paymentStatus: "paid", paymentMethod: "card", paidAt: Date.now(), updatedAt: Date.now() });
  },
});

export const listMine = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("reservations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return Promise.all(rows.map((r) => withFarmer(ctx, r)));
  },
});

export const listForFarmer = query({
  args: { farmerId: v.id("farmers") },
  handler: async (ctx, { farmerId }) => {
    const rows = await ctx.db
      .query("reservations")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmerId))
      .order("desc")
      .collect();
    return Promise.all(rows.map((r) => withFarmer(ctx, r)));
  },
});

export const get = query({
  args: { id: v.id("reservations") },
  handler: async (ctx, { id }) => {
    const r = await ctx.db.get(id);
    return r ? withFarmer(ctx, r) : null;
  },
});

const transitions: Record<string, string[]> = {
  requested: ["confirmed", "declined", "cancelled"],
  confirmed: ["completed", "cancelled", "declined"],
};

/**
 * 生産者: 確定 / 辞退 / 受取完了(発送済み)。消費者: キャンセル。
 * 完了時、未払いなら `cashPaid` で現地払いにできる。発送は支払い済みが必須。
 */
export const setStatus = mutation({
  args: {
    id: v.id("reservations"),
    status: reservationStatus,
    cashPaid: v.optional(v.boolean()),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, cashPaid, trackingNumber }) => {
    const r = await ctx.db.get(id);
    if (!r) throw new Error("予約が見つかりません");
    if (!transitions[r.status]?.includes(status)) throw new Error("この予約は変更できません");
    const patch: Record<string, unknown> = { status, updatedAt: Date.now() };
    if (status === "declined" || status === "cancelled") {
      for (const it of r.items) {
        const p = await ctx.db.get(it.productId);
        if (p) await ctx.db.patch(p._id, { stock: p.stock + it.quantity });
      }
    }
    if (status === "completed") {
      if (r.paymentStatus === "unpaid") {
        if (r.method === "delivery") throw new Error("お客さまのお支払いが完了してから発送してください");
        if (!cashPaid) throw new Error("未払いです。現地払いとして完了する場合は指定してください");
        Object.assign(patch, { paymentStatus: "paid", paymentMethod: "cash", paidAt: Date.now() });
      }
      if (r.method === "delivery") Object.assign(patch, { carrier: CARRIER, trackingNumber: trackingNumber?.trim() || undefined });
    }
    await ctx.db.patch(id, patch);
  },
});
