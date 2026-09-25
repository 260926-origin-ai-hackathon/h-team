import type { Farmer } from "./types";
import type { Filters } from "./store";

/** Osaka — the demo's default viewport. */
export const DEFAULT_CENTER = { latitude: 34.66, longitude: 135.47 };
export const DEFAULT_REGION = { ...DEFAULT_CENTER, latitudeDelta: 0.95, longitudeDelta: 0.7 };
export const FOCUS_DELTA = { latitudeDelta: 0.32, longitudeDelta: 0.24 };
/** Mapbox-style zoom levels (used by the Mapbox implementation). */
export const DEFAULT_ZOOM = 9;
export const FOCUS_ZOOM = 10.5;

export const toPosition = (f: Pick<Farmer, "latitude" | "longitude">): [number, number] => [f.longitude, f.latitude];

/** Handle exposed by both map implementations (FarmerMap / FarmerMap.mapbox). */
export type FarmerMapHandle = {
  /** Center on a farmer, leaving room for the bottom sheet. */
  focus: (f: Farmer) => void;
  /** Move to a coordinate (e.g. the user's location). */
  moveTo: (latitude: number, longitude: number) => void;
};

export function matchesFilter(f: Farmer, filters: Filters) {
  if (filters.today && !f.hasTodayHarvest) return false;
  if (filters.delivery && !f.deliveryAvailable) return false;
  if (filters.top && !(f.reviewCount > 0 && f.ratingAvg >= 4.5)) return false;
  if (filters.crop && !f.crops.includes(filters.crop)) return false;
  const q = filters.query.trim();
  if (q) {
    const hay = `${f.name} ${f.kana} ${f.farmName} ${f.prefecture} ${f.city} ${f.crops.join(" ")}`;
    if (!hay.includes(q)) return false;
  }
  return true;
}
