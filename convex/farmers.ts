import { query } from "./_generated/server";
import { v } from "convex/values";
import { resolveImage, resolveImages } from "./images";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

export async function toPublicFarmer(ctx: QueryCtx, f: Doc<"farmers">) {
  const { avatarStorageId, avatarUrl, farmStorageIds, farmUrls, ...rest } = f;
  return {
    ...rest,
    avatar: await resolveImage(ctx, avatarStorageId, avatarUrl),
    farmPhotos: await resolveImages(ctx, farmStorageIds, farmUrls),
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const farmers = await ctx.db.query("farmers").collect();
    return Promise.all(farmers.map((f) => toPublicFarmer(ctx, f)));
  },
});

export const get = query({
  args: { id: v.id("farmers") },
  handler: async (ctx, { id }) => {
    const f = await ctx.db.get(id);
    if (!f) return null;
    return toPublicFarmer(ctx, f);
  },
});
