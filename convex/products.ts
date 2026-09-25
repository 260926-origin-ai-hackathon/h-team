import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { resolveImage } from "./images";
import { toPublicFarmer } from "./farmers";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

async function toPublicProduct(ctx: QueryCtx, p: Doc<"products">) {
  const { imageStorageId, imageUrl, ...rest } = p;
  const watchers = await ctx.db
    .query("watches")
    .withIndex("by_product", (q) => q.eq("productId", p._id))
    .collect();
  return { ...rest, image: await resolveImage(ctx, imageStorageId, imageUrl), watcherCount: watchers.length };
}

/** Consumer-facing: available products of a farmer. */
export const byFarmer = query({
  args: { farmerId: v.id("farmers") },
  handler: async (ctx, { farmerId }) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmerId))
      .collect();
    return Promise.all(products.filter((p) => p.available).map((p) => toPublicProduct(ctx, p)));
  },
});

/** Consumer-facing: 出荷予定（未公開・予定日あり）。`userId` があればウォッチ済みかも返す。 */
export const upcomingByFarmer = query({
  args: { farmerId: v.id("farmers"), userId: v.optional(v.string()) },
  handler: async (ctx, { farmerId, userId }) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmerId))
      .collect();
    const upcoming = products.filter((p) => !p.available && p.expectedAt);
    const out = [];
    for (const p of upcoming) {
      const watched = userId
        ? !!(await ctx.db
            .query("watches")
            .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", p._id))
            .unique())
        : false;
      out.push({ ...(await toPublicProduct(ctx, p)), watched });
    }
    return out.sort((a, b) => (a.expectedAt ?? 0) - (b.expectedAt ?? 0));
  },
});

/** Farmer-facing: every product incl. hidden ones. */
export const mine = query({
  args: { farmerId: v.id("farmers") },
  handler: async (ctx, { farmerId }) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmerId))
      .collect();
    return Promise.all(products.map((p) => toPublicProduct(ctx, p)));
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const p = await ctx.db.get(id);
    if (!p) return null;
    const farmer = await ctx.db.get(p.farmerId);
    return { ...(await toPublicProduct(ctx, p)), farmer: farmer ? await toPublicFarmer(ctx, farmer) : null };
  },
});

export const byIds = query({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, { ids }) => {
    const out = [];
    for (const id of ids) {
      const p = await ctx.db.get(id);
      if (!p) continue;
      const farmer = await ctx.db.get(p.farmerId);
      out.push({ ...(await toPublicProduct(ctx, p)), farmerName: farmer?.name ?? "" });
    }
    return out;
  },
});

const productFields = {
  name: v.string(),
  imageUrl: v.optional(v.string()),
  description: v.string(),
  price: v.number(),
  unit: v.string(),
  harvest: v.string(),
  harvestedToday: v.boolean(),
  deliveryAvailable: v.boolean(),
  stock: v.number(),
  available: v.boolean(),
  expectedAt: v.optional(v.number()),
};

export const upsert = mutation({
  args: { id: v.optional(v.id("products")), farmerId: v.id("farmers"), ...productFields },
  handler: async (ctx, { id, ...fields }) => {
    if (id) {
      await ctx.db.patch(id, fields);
      return id;
    }
    return ctx.db.insert("products", fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
