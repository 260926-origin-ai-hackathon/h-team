// react-native-maps implementation (Apple Maps on iOS; works in Expo Go).
// To switch back to Mapbox, import FarmerMap from "./FarmerMap.mapbox" in the map screen.
import { forwardRef, useImperativeHandle, useRef } from "react";
import MapView from "react-native-maps";
import { DEFAULT_REGION, FOCUS_DELTA, type FarmerMapHandle } from "../lib/map";
import type { Farmer, FarmerId } from "../lib/types";
import { FarmerMarker } from "./FarmerMarker";

type Props = { farmers: Farmer[]; selectedId: FarmerId | null; onSelect: (f: Farmer) => void; onPressMap: () => void; showUser: boolean };

export const FarmerMap = forwardRef<FarmerMapHandle, Props>(function FarmerMap({ farmers, selectedId, onSelect, onPressMap, showUser }, ref) {
  const map = useRef<MapView>(null);
  useImperativeHandle(ref, () => ({
    // Shift the center south so the pin sits above the bottom sheet.
    focus: (f) => map.current?.animateToRegion({ latitude: f.latitude - FOCUS_DELTA.latitudeDelta * 0.28, longitude: f.longitude, ...FOCUS_DELTA }, 450),
    moveTo: (latitude, longitude) => map.current?.animateToRegion({ latitude, longitude, ...FOCUS_DELTA }, 800),
  }));
  return (
    <MapView
      ref={map}
      style={{ flex: 1 }}
      initialRegion={DEFAULT_REGION}
      mapType="mutedStandard"
      showsPointsOfInterests={false}
      showsBuildings={false}
      showsTraffic={false}
      showsCompass={false}
      showsUserLocation={showUser}
      rotateEnabled={false}
      pitchEnabled={false}
      onPress={(e) => {
        if (e.nativeEvent.action === "marker-press") return;
        onPressMap();
      }}
    >
      {farmers.map((f) => (
        <FarmerMarker key={f._id} farmer={f} selected={f._id === selectedId} onPress={() => onSelect(f)} />
      ))}
    </MapView>
  );
});
