import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Step 1 of an upload: get a short-lived URL to POST the file to. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

/** Step 2: remember the stored file under a key (e.g. "hirose-avatar"). Re-uploading replaces it. */
export const register = mutation({
  args: { key: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, { key, storageId }) => {
    const existing = await ctx.db
      .query("assets")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (existing) {
      if (existing.storageId !== storageId) await ctx.storage.delete(existing.storageId).catch(() => {});
      await ctx.db.patch(existing._id, { storageId });
    } else {
      await ctx.db.insert("assets", { key, storageId });
    }
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("assets").collect();
    const out = [];
    for (const r of rows) out.push({ key: r.key, url: await ctx.storage.getUrl(r.storageId) });
    return out;
  },
});
