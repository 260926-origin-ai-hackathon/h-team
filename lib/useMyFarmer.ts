import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useStore } from "./store";

/** The farmer profile owned by the current farmer-side user. undefined = loading, null = none yet. */
export function useMyFarmer() {
  const userId = useStore((s) => s.userId);
  return useQuery(api.farmers.byOwner, userId ? { userId } : "skip");
}
