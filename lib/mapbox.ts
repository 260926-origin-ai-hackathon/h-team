// Mapbox-specific setup. Only imported by the *.mapbox.tsx map implementation.
// To switch the app back to Mapbox: in app/consumer/(tabs)/map.tsx import FarmerMap from
// "../../../components/FarmerMap.mapbox" instead of "../../../components/FarmerMap".
import Mapbox from "@rnmapbox/maps";

export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";
export const hasMapboxToken = MAPBOX_TOKEN.startsWith("pk.");

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
