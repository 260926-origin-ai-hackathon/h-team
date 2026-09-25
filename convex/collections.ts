import { query } from "./_generated/server";
import { v } from "convex/values";
import { toPublicFarmer } from "./farmers";

/** All farmers the user has unlocked, joined with farmer data. Newest first. */
export const mine = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("farmerCollections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const out = [];
    for (const row of rows) {
      const farmer = await ctx.db.get(row.farmerId);
      if (!farmer) continue;
      out.push({
        ...row,
        farmer: await toPublicFarmer(ctx, farmer),
      });
    }
    return out.sort((a, b) => b.firstPurchasedAt - a.firstPurchasedAt);
  },
});

/** Lightweight lookup used by the map: farmerId -> collection row. */
export const unlockedIds = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("farmerCollections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows.map((r) => r.farmerId);
  },
});
