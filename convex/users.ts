import { mutation, query } from "./_generated/server";
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
    return {
      userId,
      name: user?.name ?? "ゲスト",
      role: user?.role ?? "consumer",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      bio: user?.bio ?? "",
      ratingAvg: avg,
      ratingCount: count,
    };
  },
});

export const updateProfile = mutation({
  args: { userId: v.string(), name: v.string(), phone: v.optional(v.string()), address: v.optional(v.string()), bio: v.optional(v.string()) },
  handler: async (ctx, { userId, ...fields }) => {
    if (!fields.name.trim()) throw new Error("名前を入力してください");
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (user) await ctx.db.patch(user._id, fields);
    else await ctx.db.insert("users", { userId, role: "consumer", ...fields });
  },
});
