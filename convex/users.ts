import { query } from "./_generated/server";
import { v } from "convex/values";

/** User profile + rating given by farmers (Airbnb-style guest rating). */
export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    const ratings = await ctx.db
      .query("consumerRatings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const count = ratings.length;
    const avg = count ? ratings.reduce((a, r) => a + r.rating, 0) / count : 0;
    return { userId, name: user?.name ?? "ゲスト", role: user?.role ?? "consumer", ratingAvg: avg, ratingCount: count };
  },
});
