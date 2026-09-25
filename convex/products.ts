import { query } from "./_generated/server";
import { v } from "convex/values";
import { resolveImage } from "./images";
import { toPublicFarmer } from "./farmers";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

async function toPublicProduct(ctx: QueryCtx, p: Doc<"products">) {
  const { imageStorageId, imageUrl, ...rest } = p;
  return { ...rest, image: await resolveImage(ctx, imageStorageId, imageUrl) };
}

export const byFarmer = query({
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
    return {
      ...(await toPublicProduct(ctx, p)),
      farmer: farmer ? await toPublicFarmer(ctx, farmer) : null,
    };
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
      out.push({
        ...(await toPublicProduct(ctx, p)),
        farmerName: farmer?.name ?? "",
      });
    }
    return out;
  },
});
