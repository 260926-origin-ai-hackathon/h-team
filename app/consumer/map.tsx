import Mapbox from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as Location from "expo-location";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerBottomSheet } from "../../components/FarmerBottomSheet";
import { FarmerMarker } from "../../components/FarmerMarker";
import { MapFilters } from "../../components/MapFilters";
import { TAB_BAR_HEIGHT, TabBar } from "../../components/TabBar";
import { Txt } from "../../components/ui";
import { api } from "../../convex/_generated/api";
import { DEFAULT_CENTER, DEFAULT_ZOOM, FOCUS_ZOOM, OFFLINE_STYLE_JSON, hasMapboxToken, matchesFilter, toPosition } from "../../lib/map";
import { useStore, type FilterKind } from "../../lib/store";
import { colors, shadow } from "../../lib/theme";
import type { Farmer } from "../../lib/types";

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const farmers = useQuery(api.farmers.list);
  const { userId, selectedFarmerId, selectFarmer, filter, query } = useStore();
  const reservations = useQuery(api.reservations.listMine, userId ? { userId } : "skip") ?? [];
  const upcoming = reservations.filter((r) => r.status === "requested" || r.status === "confirmed").length;
  const camera = useRef<Mapbox.Camera>(null);
  const [locating, setLocating] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [offline, setOffline] = useState(!hasMapboxToken);

  const all = farmers ?? [];
  const visible = all.filter((f) => matchesFilter(f, filter, query));
  const counts: Record<FilterKind, number> = {
    all: all.length,
    today: all.filter((f) => f.hasTodayHarvest).length,
    delivery: all.filter((f) => f.deliveryAvailable).length,
    top: all.filter((f) => f.reviewCount > 0 && f.ratingAvg >= 4.5).length,
  };
  const selected = all.find((f) => f._id === selectedFarmerId) ?? null;

  const focus = useCallback(
    (f: Farmer) => {
      selectFarmer(f._id);
      camera.current?.setCamera({
        centerCoordinate: toPosition(f),
        padding: { paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 380 },
        animationDuration: 450,
        animationMode: "easeTo",
      });
    },
    [selectFarmer],
  );

  const locate = async () => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setShowUser(true);
      camera.current?.setCamera({ centerCoordinate: [pos.coords.longitude, pos.coords.latitude], zoomLevel: FOCUS_ZOOM, animationDuration: 800 });
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.mapBg }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={offline ? undefined : Mapbox.StyleURL.Light}
        styleJSON={offline ? OFFLINE_STYLE_JSON : undefined}
        onMapLoadingError={() => setOffline(true)}
        scaleBarEnabled={false}
        logoPosition={{ bottom: TAB_BAR_HEIGHT + 8, left: 8 }}
        attributionPosition={{ bottom: TAB_BAR_HEIGHT + 8, right: 8 }}
        onPress={() => selectFarmer(null)}
      >
        <Mapbox.Camera ref={camera} defaultSettings={{ centerCoordinate: DEFAULT_CENTER, zoomLevel: DEFAULT_ZOOM }} />
        {showUser && <Mapbox.UserLocation visible />}
        {visible.map((f) => (
          <FarmerMarker key={f._id} farmer={f} selected={f._id === selectedFarmerId} onPress={() => focus(f)} />
        ))}
      </Mapbox.MapView>

      {offline && (
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: insets.top + 112, alignItems: "center" }}>
          <View style={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Txt size={11} color={colors.muted}>地図タイル未取得 · EXPO_PUBLIC_MAPBOX_TOKEN を設定すると表示されます</Txt>
          </View>
        </View>
      )}
      {farmers === undefined && (
        <View pointerEvents="none" style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.ink} />
        </View>
      )}

      <MapFilters upcoming={upcoming} counts={counts} />

      {!selected && (
        <Pressable
          onPress={locate}
          accessibilityLabel="現在地"
          style={[{ position: "absolute", right: 14, bottom: TAB_BAR_HEIGHT + Math.max(insets.bottom - 20, 0) + 14, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }, shadow.float]}
        >
          {locating ? <ActivityIndicator size="small" color={colors.ink} /> : <Ionicons name="locate" size={20} color={colors.ink} />}
        </Pressable>
      )}

      <FarmerBottomSheet farmer={selected} />
      <TabBar active="map" />
    </View>
  );
}
