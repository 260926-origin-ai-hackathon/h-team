import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

/**
 * Pseudo-checkout. Creates the order + items, decrements stock, and unlocks
 * each farmer in the user's collection. Returns newly unlocked farmer ids so
 * the client can play the card reveal.
 */
export const create = mutation({
  args: {
    userId: v.string(),
    items: v.array(
      v.object({ productId: v.id("products"), quantity: v.number() }),
    ),
  },
  handler: async (ctx, { userId, items }) => {
    if (items.length === 0) throw new Error("カートが空です");

    const now = Date.now();
    const lines: {
      productId: Id<"products">;
      farmerId: Id<"farmers">;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items) {
      const product = await ctx.db.get(item.productId);
      if (!product || !product.available) throw new Error("商品が見つかりません");
      if (product.stock < item.quantity) throw new Error(`${product.name} の在庫が足りません`);
      lines.push({
        productId: product._id,
        farmerId: product.farmerId,
        quantity: item.quantity,
        price: product.price,
      });
      await ctx.db.patch(product._id, { stock: product.stock - item.quantity });
    }

    const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const orderId = await ctx.db.insert("orders", { userId, createdAt: now, total });
    for (const l of lines) {
      await ctx.db.insert("orderItems", { orderId, ...l });
    }

    // Unlock farmers (one increment per farmer per order)
    const farmerIds = [...new Set(lines.map((l) => l.farmerId))];
    const newlyUnlocked: Id<"farmers">[] = [];
    for (const farmerId of farmerIds) {
      const existing = await ctx.db
        .query("farmerCollections")
        .withIndex("by_user_farmer", (q) => q.eq("userId", userId).eq("farmerId", farmerId))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { purchaseCount: existing.purchaseCount + 1 });
      } else {
        await ctx.db.insert("farmerCollections", {
          userId,
          farmerId,
          firstPurchasedAt: now,
          purchaseCount: 1,
        });
        newlyUnlocked.push(farmerId);
      }
    }

    return { orderId, total, newlyUnlocked };
  },
});

export const listMine = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
