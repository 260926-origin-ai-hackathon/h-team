import { ConvexReactClient } from "convex/react";

export const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL ?? "";

// Hackathon: single fixed demo user. Swap for Clerk etc. later.
export const DEMO_USER_ID = "demo-user";

export const convex = new ConvexReactClient(
  CONVEX_URL || "https://placeholder.convex.cloud",
  { unsavedChangesWarning: false },
);
