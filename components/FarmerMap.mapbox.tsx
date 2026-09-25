// Mapbox implementation of the farmer map (kept so the app can switch back; see lib/mapbox.ts).
import Mapbox from "@rnmapbox/maps";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEFAULT_CENTER, DEFAULT_ZOOM, FOCUS_ZOOM, toPosition, type FarmerMapHandle } from "../lib/map";
import { OFFLINE_STYLE_JSON, hasMapboxToken } from "../lib/mapbox";
import { colors } from "../lib/theme";
import type { Farmer, FarmerId } from "../lib/types";
import { FarmerMarker } from "./FarmerMarker.mapbox";
import { Txt } from "./ui";

type Props = { farmers: Farmer[]; selectedId: FarmerId | null; onSelect: (f: Farmer) => void; onPressMap: () => void; showUser: boolean };

export const FarmerMap = forwardRef<FarmerMapHandle, Props>(function FarmerMap({ farmers, selectedId, onSelect, onPressMap, showUser }, ref) {
  const insets = useSafeAreaInsets();
  const camera = useRef<Mapbox.Camera>(null);
  const [offline, setOffline] = useState(!hasMapboxToken);
  useImperativeHandle(ref, () => ({
    focus: (f) =>
      camera.current?.setCamera({ centerCoordinate: toPosition(f), padding: { paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 300 }, animationDuration: 450, animationMode: "easeTo" }),
    moveTo: (latitude, longitude) => camera.current?.setCamera({ centerCoordinate: [longitude, latitude], zoomLevel: FOCUS_ZOOM, animationDuration: 800 }),
  }));
  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={offline ? undefined : Mapbox.StyleURL.Light}
        styleJSON={offline ? OFFLINE_STYLE_JSON : undefined}
        onMapLoadingError={() => setOffline(true)}
        scaleBarEnabled={false}
        logoPosition={{ bottom: 8, left: 8 }}
        attributionPosition={{ bottom: 8, right: 8 }}
        onPress={onPressMap}
      >
        <Mapbox.Camera ref={camera} defaultSettings={{ centerCoordinate: [DEFAULT_CENTER.longitude, DEFAULT_CENTER.latitude], zoomLevel: DEFAULT_ZOOM }} />
        {showUser && <Mapbox.UserLocation visible />}
        {farmers.map((f) => (
          <FarmerMarker key={f._id} farmer={f} selected={f._id === selectedId} onPress={() => onSelect(f)} />
        ))}
      </Mapbox.MapView>
      {offline && (
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: insets.top + 112, alignItems: "center" }}>
          <View style={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Txt size={11} color={colors.muted}>地図タイル未取得 · EXPO_PUBLIC_MAPBOX_TOKEN を設定すると表示されます</Txt>
          </View>
        </View>
      )}
    </View>
  );
});
