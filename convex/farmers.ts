import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { resolveImage, resolveImages } from "./images";
import { farmerStatus } from "./schema";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

export async function toPublicFarmer(ctx: QueryCtx, f: Doc<"farmers">) {
  const { avatarStorageId, avatarUrl, farmStorageIds, farmUrls, ...rest } = f;
  const products = await ctx.db
    .query("products")
    .withIndex("by_farmer", (q) => q.eq("farmerId", f._id))
    .collect();
  const reviews = await ctx.db
    .query("reviews")
    .withIndex("by_farmer", (q) => q.eq("farmerId", f._id))
    .collect();
  const available = products.filter((p) => p.available);
  return {
    ...rest,
    avatar: await resolveImage(ctx, avatarStorageId, avatarUrl),
    farmPhotos: await resolveImages(ctx, farmStorageIds, farmUrls),
    productCount: available.length,
    hasTodayHarvest: available.some((p) => p.harvestedToday),
    deliveryAvailable: available.some((p) => p.deliveryAvailable),
    reviewCount: reviews.length,
    ratingAvg: reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0,
  };
}

const profileFields = {
  name: v.string(),
  kana: v.string(),
  farmName: v.string(),
  avatarUrl: v.optional(v.string()),
  farmUrls: v.optional(v.array(v.string())),
  catchphrase: v.string(),
  bio: v.string(),
  kodawari: v.array(v.object({ title: v.string(), body: v.string() })),
  years: v.number(),
  season: v.string(),
  seasonState: v.union(v.literal("now"), v.literal("soon"), v.literal("off")),
  tint: v.string(),
  prefecture: v.string(),
  city: v.string(),
  latitude: v.number(),
  longitude: v.number(),
  crops: v.array(v.string()),
  pickupAddress: v.string(),
  pickupHours: v.string(),
  pickupNote: v.optional(v.string()),
};

/** Approved farmers for the consumer map. PR farmers first, then by rating. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const farmers = await ctx.db
      .query("farmers")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();
    const out = await Promise.all(farmers.map((f) => toPublicFarmer(ctx, f)));
    return out.sort((a, b) => Number(b.pr) - Number(a.pr) || b.ratingAvg - a.ratingAvg);
  },
});

export const get = query({
  args: { id: v.id("farmers") },
  handler: async (ctx, { id }) => {
    const f = await ctx.db.get(id);
    return f ? toPublicFarmer(ctx, f) : null;
  },
});

/** The farmer profile owned by the signed-in farmer user (null → onboarding). */
export const byOwner = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const f = await ctx.db
      .query("farmers")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", userId))
      .unique();
    return f ? toPublicFarmer(ctx, f) : null;
  },
});

/** Create (→ pending approval) or update the owner's profile. */
export const upsertMine = mutation({
  args: { userId: v.string(), ...profileFields },
  handler: async (ctx, { userId, ...fields }) => {
    const existing = await ctx.db
      .query("farmers")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing._id;
    }
    return ctx.db.insert("farmers", { ownerUserId: userId, status: "pending", pr: false, ...fields });
  },
});

export const setPr = mutation({
  args: { id: v.id("farmers"), pr: v.boolean() },
  handler: async (ctx, { id, pr }) => {
    await ctx.db.patch(id, { pr });
  },
});

// ---- 運営（承認） ----
export const adminList = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("farmers").collect();
    const out = await Promise.all(all.map((f) => toPublicFarmer(ctx, f)));
    const order = { pending: 0, approved: 1, rejected: 2 } as const;
    return out.sort((a, b) => order[a.status] - order[b.status]);
  },
});

export const adminSetStatus = mutation({
  args: { id: v.id("farmers"), status: farmerStatus },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});
