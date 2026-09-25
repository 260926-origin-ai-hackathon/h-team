import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const reservationStatus = v.union(
  v.literal("requested"), // 消費者がリクエスト
  v.literal("confirmed"), // 生産者が確定
  v.literal("completed"), // 受取完了 / 発送済み
  v.literal("declined"), // 生産者が辞退
  v.literal("cancelled"), // 消費者がキャンセル
);
export const fulfillment = v.union(v.literal("pickup"), v.literal("delivery"));
export const farmerStatus = v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"));

export default defineSchema({
  users: defineTable({
    userId: v.string(), // demo: fixed ids
    name: v.string(),
    role: v.union(v.literal("consumer"), v.literal("farmer"), v.literal("admin")),
  }).index("by_userId", ["userId"]),

  farmers: defineTable({
    ownerUserId: v.optional(v.string()),
    status: farmerStatus,
    pr: v.boolean(), // 優先表示（PR）
    name: v.string(),
    kana: v.string(),
    farmName: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),
    farmStorageIds: v.optional(v.array(v.id("_storage"))),
    farmUrls: v.optional(v.array(v.string())),
    catchphrase: v.string(),
    bio: v.string(),
    kodawari: v.array(v.object({ title: v.string(), body: v.string() })),
    years: v.number(),
    season: v.string(),
    seasonState: v.union(v.literal("now"), v.literal("soon"), v.literal("off")),
    tint: v.string(),
    prefecture: v.string(),
    city: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    crops: v.array(v.string()),
    pickupAddress: v.string(),
    pickupHours: v.string(),
    pickupNote: v.optional(v.string()),
  })
    .index("by_owner", ["ownerUserId"])
    .index("by_status", ["status"]),

  products: defineTable({
    farmerId: v.id("farmers"),
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    description: v.string(),
    price: v.number(),
    unit: v.string(),
    harvest: v.string(),
    harvestedToday: v.boolean(),
    deliveryAvailable: v.boolean(), // 発送代行に対応
    stock: v.number(),
    available: v.boolean(),
  }).index("by_farmer", ["farmerId"]),

  reservations: defineTable({
    userId: v.string(),
    farmerId: v.id("farmers"),
    status: reservationStatus,
    method: fulfillment,
    pickupAt: v.optional(v.number()), // 受取希望日時（pickup のとき）
    address: v.optional(v.string()), // 発送先（delivery のとき）
    note: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        unit: v.string(),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    consumerReviewed: v.boolean(),
    farmerReviewed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_farmer", ["farmerId"]),

  // 消費者 → 生産者（公開）
  reviews: defineTable({
    farmerId: v.id("farmers"),
    reservationId: v.optional(v.id("reservations")),
    userId: v.string(),
    authorName: v.string(),
    rating: v.number(), // 1-5
    comment: v.string(),
    createdAt: v.number(),
  }).index("by_farmer", ["farmerId"]),

  // 生産者 → 消費者（生産者間で参照）
  consumerRatings: defineTable({
    userId: v.string(),
    farmerId: v.id("farmers"),
    reservationId: v.id("reservations"),
    rating: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_reservation", ["reservationId"]),
});
