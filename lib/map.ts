import Mapbox from "@rnmapbox/maps";
import type { Farmer } from "./types";
import type { FilterKind } from "./store";

export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";
export const hasMapboxToken = MAPBOX_TOKEN.startsWith("pk.");

if (hasMapboxToken) {
  Mapbox.setAccessToken(MAPBOX_TOKEN);
  Mapbox.setTelemetryEnabled(false);
}

/** Osaka — the demo's default viewport (matches the design: [34.66, 135.47] z10). */
export const DEFAULT_CENTER: [number, number] = [135.47, 34.66];
export const DEFAULT_ZOOM = 9;
export const FOCUS_ZOOM = 10.5;

export const toPosition = (f: Pick<Farmer, "latitude" | "longitude">): [number, number] => [
  f.longitude,
  f.latitude,
];

export function matchesFilter(f: Farmer, filter: FilterKind, query: string, owned: boolean) {
  if (filter === "owned" && !owned) return false;
  if (filter === "locked" && owned) return false;
  if (filter === "today" && !f.hasTodayHarvest) return false;
  const q = query.trim();
  if (q) {
    const hay = `${f.name} ${f.kana} ${f.farmName} ${f.prefecture} ${f.city} ${f.crops.join(" ")}`;
    if (!hay.includes(q)) return false;
  }
  return true;
}
