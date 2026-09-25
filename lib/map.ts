import Mapbox from "@rnmapbox/maps";
import type { Farmer } from "./types";

export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";
export const hasMapboxToken = MAPBOX_TOKEN.startsWith("pk.");

if (hasMapboxToken) {
  Mapbox.setAccessToken(MAPBOX_TOKEN);
  Mapbox.setTelemetryEnabled(false);
}

/** Osaka city centre — the demo's default viewport. */
export const DEFAULT_CENTER: [number, number] = [135.5023, 34.6937];
export const DEFAULT_ZOOM = 8.2;
export const FOCUS_ZOOM = 10.5;

export const toPosition = (f: Pick<Farmer, "latitude" | "longitude">): [number, number] => [
  f.longitude,
  f.latitude,
];

/** Bounding box of a farmer set as [ne, sw], or null when empty. */
export function boundsOf(farmers: Farmer[]): { ne: [number, number]; sw: [number, number] } | null {
  if (farmers.length === 0) return null;
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const f of farmers) {
    minLng = Math.min(minLng, f.longitude);
    maxLng = Math.max(maxLng, f.longitude);
    minLat = Math.min(minLat, f.latitude);
    maxLat = Math.max(maxLat, f.latitude);
  }
  return { ne: [maxLng, maxLat], sw: [minLng, minLat] };
}

export function matchesFilters(
  f: Farmer,
  filters: { query: string; crop: string | null; unlockedOnly: boolean },
  unlocked: boolean,
) {
  if (filters.unlockedOnly && !unlocked) return false;
  if (filters.crop && !f.crops.includes(filters.crop)) return false;
  const q = filters.query.trim();
  if (q) {
    const hay = `${f.name} ${f.prefecture} ${f.city} ${f.crops.join(" ")}`;
    if (!hay.includes(q)) return false;
  }
  return true;
}
