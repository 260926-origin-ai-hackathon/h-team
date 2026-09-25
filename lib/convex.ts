import { ConvexReactClient } from "convex/react";

export const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL ?? "";

// Hackathon: fixed demo identities, picked on the role screen at launch.
export const DEMO_USERS = {
  consumer: { userId: "demo-consumer", label: "田中 花" },
  farmer: { userId: "demo-farmer", label: "廣瀬 裕（ひろせファーム）" },
  newFarmer: { userId: "demo-farmer-new", label: "新規の生産者" },
  admin: { userId: "demo-admin", label: "運営" },
} as const;

export const convex = new ConvexReactClient(CONVEX_URL || "https://placeholder.convex.cloud", {
  unsavedChangesWarning: false,
});
