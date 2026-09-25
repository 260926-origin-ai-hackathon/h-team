import Mapbox from "@rnmapbox/maps";
import type { Farmer } from "./types";
import type { FilterKind } from "./store";

export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";
export const hasMapboxToken = MAPBOX_TOKEN.startsWith("pk.");

// Mapbox needs *some* token to initialise; without a real one we still render
// the map view with an offline blank style so farmer markers keep working.
Mapbox.setAccessToken(hasMapboxToken ? MAPBOX_TOKEN : "pk.offline-placeholder");
Mapbox.setTelemetryEnabled(false);
Mapbox.Logger.setLogLevel("warning");

/** Tile-less style used when no valid token is configured (or tiles fail to load). */
export const OFFLINE_STYLE_JSON = JSON.stringify({
  version: 8,
  name: "offline",
  sources: {},
  layers: [{ id: "bg", type: "background", paint: { "background-color": "#EFEFEC" } }],
});

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
