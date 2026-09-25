import Mapbox from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as Location from "expo-location";
import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerBottomSheet } from "../components/FarmerBottomSheet";
import { FarmerMarker } from "../components/FarmerMarker";
import { MapFilters } from "../components/MapFilters";
import { TAB_BAR_HEIGHT, TabBar } from "../components/TabBar";
import { Txt } from "../components/ui";
import { api } from "../convex/_generated/api";
import { DEMO_USER_ID } from "../lib/convex";
import { DEFAULT_CENTER, DEFAULT_ZOOM, FOCUS_ZOOM, hasMapboxToken, matchesFilter, toPosition } from "../lib/map";
import { useStore, type FilterKind } from "../lib/store";
import { colors, shadow } from "../lib/theme";
import type { Farmer, FarmerId } from "../lib/types";

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const farmers = useQuery(api.farmers.list);
  const collections = useQuery(api.collections.mine, { userId: DEMO_USER_ID });
  const { selectedFarmerId, selectFarmer, filter, query } = useStore();
  const camera = useRef<Mapbox.Camera>(null);
  const [locating, setLocating] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const countOf = useMemo(() => {
    const m = new Map<FarmerId, number>();
    for (const c of collections ?? []) m.set(c.farmerId, c.purchaseCount);
    return (id: FarmerId) => m.get(id) ?? 0;
  }, [collections]);

  const all = farmers ?? [];
  const visible = all.filter((f) => matchesFilter(f, filter, query, countOf(f._id) > 0));
  const counts: Record<FilterKind, number> = {
    all: all.length,
    today: all.filter((f) => f.hasTodayHarvest).length,
    owned: all.filter((f) => countOf(f._id) > 0).length,
    locked: all.filter((f) => countOf(f._id) === 0).length,
  };
  const selected = all.find((f) => f._id === selectedFarmerId) ?? null;

  const focus = useCallback((f: Farmer) => {
    selectFarmer(f._id);
    camera.current?.setCamera({
      centerCoordinate: toPosition(f),
      padding: { paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 360 },
      animationDuration: 450,
      animationMode: "easeTo",
    });
  }, [selectFarmer]);

  const locate = async () => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setShowUser(true);
      camera.current?.setCamera({
        centerCoordinate: [pos.coords.longitude, pos.coords.latitude],
        zoomLevel: FOCUS_ZOOM,
        animationDuration: 800,
      });
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.mapBg }}>
      {hasMapboxToken ? (
        <Mapbox.MapView
          style={{ flex: 1 }}
          styleURL={Mapbox.StyleURL.Light}
          scaleBarEnabled={false}
          logoPosition={{ bottom: TAB_BAR_HEIGHT + 8, left: 8 }}
          attributionPosition={{ bottom: TAB_BAR_HEIGHT + 8, right: 8 }}
          onPress={() => selectFarmer(null)}
        >
          <Mapbox.Camera
            ref={camera}
            defaultSettings={{ centerCoordinate: DEFAULT_CENTER, zoomLevel: DEFAULT_ZOOM }}
          />
          {showUser && <Mapbox.UserLocation visible />}
          {visible.map((f) => (
            <FarmerMarker
              key={f._id}
              farmer={f}
              count={countOf(f._id)}
              selected={f._id === selectedFarmerId}
              onPress={() => focus(f)}
            />
          ))}
        </Mapbox.MapView>
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 10 }}>
          <Txt w={700} size={16}>Mapbox トークンが未設定です</Txt>
          <Txt size={12} color={colors.inkSoft} style={{ textAlign: "center", lineHeight: 20 }}>
            .env.local に EXPO_PUBLIC_MAPBOX_TOKEN (pk.…) を設定してください。図鑑・カートは動作します。
          </Txt>
        </View>
      )}

      {farmers === undefined && (
        <View pointerEvents="none" style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.ink} />
        </View>
      )}

      <MapFilters ownedCount={counts.owned} total={counts.all} counts={counts} />

      {!selected && (
        <Pressable
          onPress={locate}
          style={[
            {
              position: "absolute",
              right: 14,
              bottom: TAB_BAR_HEIGHT + Math.max(insets.bottom - 20, 0) + 14,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.white,
              alignItems: "center",
              justifyContent: "center",
            },
            shadow.float,
          ]}
        >
          {locating ? <ActivityIndicator size="small" color={colors.ink} /> : <Ionicons name="locate" size={20} color={colors.ink} />}
        </Pressable>
      )}

      <FarmerBottomSheet farmer={selected} count={selected ? countOf(selected._id) : 0} />
      <TabBar active="map" />
    </View>
  );
}
