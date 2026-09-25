import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }),

  farmers: defineTable({
    name: v.string(),
    // Convex File Storage id (preferred) or a remote URL fallback for seed data
    avatarStorageId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),
    farmStorageIds: v.optional(v.array(v.id("_storage"))),
    farmUrls: v.optional(v.array(v.string())),
    bio: v.string(),
    philosophy: v.string(),
    prefecture: v.string(),
    city: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    crops: v.array(v.string()),
  }),

  products: defineTable({
    farmerId: v.id("farmers"),
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    description: v.string(),
    price: v.number(),
    unit: v.string(),
    harvest: v.string(),
    stock: v.number(),
    available: v.boolean(),
  }).index("by_farmer", ["farmerId"]),

  orders: defineTable({
    userId: v.string(),
    createdAt: v.number(),
    total: v.number(),
  }).index("by_user", ["userId"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    farmerId: v.id("farmers"),
    quantity: v.number(),
    price: v.number(),
  }).index("by_order", ["orderId"]),

  farmerCollections: defineTable({
    userId: v.string(),
    farmerId: v.id("farmers"),
    firstPurchasedAt: v.number(),
    purchaseCount: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_farmer", ["userId", "farmerId"]),
});
