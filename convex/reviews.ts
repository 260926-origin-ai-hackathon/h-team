import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const byFarmer = query({
  args: { farmerId: v.id("farmers") },
  handler: async (ctx, { farmerId }) => {
    const rows = await ctx.db
      .query("reviews")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmerId))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** 消費者 → 生産者。受取完了した予約に対して 1 回だけ。 */
export const create = mutation({
  args: { reservationId: v.id("reservations"), userId: v.string(), rating: v.number(), comment: v.string() },
  handler: async (ctx, { reservationId, userId, rating, comment }) => {
    const r = await ctx.db.get(reservationId);
    if (!r || r.userId !== userId) throw new Error("予約が見つかりません");
    if (r.status !== "completed") throw new Error("受取完了後にレビューできます");
    if (r.consumerReviewed) throw new Error("この予約はレビュー済みです");
    if (rating < 1 || rating > 5) throw new Error("評価は1〜5で選んでください");
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    await ctx.db.insert("reviews", {
      farmerId: r.farmerId,
      reservationId,
      userId,
      authorName: user?.name ?? "ゲスト",
      rating,
      comment: comment.trim(),
      createdAt: Date.now(),
    });
    await ctx.db.patch(reservationId, { consumerReviewed: true });
  },
});

/** 生産者 → 消費者（他の生産者が参照できる信頼スコア）。 */
export const rateConsumer = mutation({
  args: { reservationId: v.id("reservations"), rating: v.number(), comment: v.optional(v.string()) },
  handler: async (ctx, { reservationId, rating, comment }) => {
    const r = await ctx.db.get(reservationId);
    if (!r) throw new Error("予約が見つかりません");
    if (r.status !== "completed") throw new Error("受取完了後に評価できます");
    if (r.farmerReviewed) throw new Error("評価済みです");
    await ctx.db.insert("consumerRatings", {
      userId: r.userId,
      farmerId: r.farmerId,
      reservationId,
      rating,
      comment,
      createdAt: Date.now(),
    });
    await ctx.db.patch(reservationId, { farmerReviewed: true });
  },
});
