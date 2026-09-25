import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { resolveImage } from "./images";

/** 出荷予定をウォッチ／解除（トグル）。 */
export const toggle = mutation({
  args: { userId: v.string(), productId: v.id("products") },
  handler: async (ctx, { userId, productId }) => {
    const existing = await ctx.db
      .query("watches")
      .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", productId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }
    const p = await ctx.db.get(productId);
    if (!p) throw new Error("商品が見つかりません");
    await ctx.db.insert("watches", { userId, productId, farmerId: p.farmerId, createdAt: Date.now() });
    return true;
  },
});

/** 自分のウォッチ一覧。販売開始したものは `onSale` で分かる。 */
export const mine = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("watches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const out = [];
    for (const w of rows) {
      const p = await ctx.db.get(w.productId);
      const f = p ? await ctx.db.get(p.farmerId) : null;
      if (!p || !f) continue;
      out.push({
        _id: w._id,
        productId: p._id,
        farmerId: f._id,
        name: p.name,
        image: await resolveImage(ctx, p.imageStorageId, p.imageUrl),
        farmerName: f.name,
        expectedAt: p.expectedAt,
        onSale: p.available,
        price: p.price,
        unit: p.unit,
      });
    }
    return out.sort((a, b) => Number(b.onSale) - Number(a.onSale) || (a.expectedAt ?? 0) - (b.expectedAt ?? 0));
  },
});
