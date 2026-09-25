import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as Location from "expo-location";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { FarmerBottomSheet } from "../../../components/FarmerBottomSheet";
import { FarmerMap } from "../../../components/FarmerMap"; // ← Mapbox に戻すときは "../../../components/FarmerMap.mapbox"
import { FloatingCartBar } from "../../../components/FloatingCartBar";
import { MapFilters } from "../../../components/MapFilters";
import { SearchPanel } from "../../../components/SearchPanel";
import { api } from "../../../convex/_generated/api";
import { matchesFilter, type FarmerMapHandle } from "../../../lib/map";
import { useStore } from "../../../lib/store";
import { colors, shadow } from "../../../lib/theme";
import type { Farmer } from "../../../lib/types";

export default function MapScreen() {
  const farmers = useQuery(api.farmers.list);
  const { userId, selectedFarmerId, selectFarmer, filters, cart } = useStore();
  const search = useRef<BottomSheetModal>(null);
  const reservations = useQuery(api.reservations.listMine, userId ? { userId } : "skip") ?? [];
  const upcoming = reservations.filter((r) => r.status === "requested" || r.status === "confirmed").length;
  const map = useRef<FarmerMapHandle>(null);
  const [locating, setLocating] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const all = farmers ?? [];
  const visible = all.filter((f) => matchesFilter(f, filters));
  const selected = all.find((f) => f._id === selectedFarmerId) ?? null;

  const focus = useCallback(
    (f: Farmer) => {
      selectFarmer(f._id);
      map.current?.focus(f);
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
      map.current?.moveTo(pos.coords.latitude, pos.coords.longitude);
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.mapBg }}>
      <FarmerMap ref={map} farmers={visible} selectedId={selectedFarmerId} onSelect={focus} onPressMap={() => selectFarmer(null)} showUser={showUser} />

      {farmers === undefined && (
        <View pointerEvents="none" style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.ink} />
        </View>
      )}

      <MapFilters upcoming={upcoming} resultCount={visible.length} onOpenSearch={() => search.current?.present()} />

      {!selected && (
        <Pressable
          onPress={locate}
          accessibilityLabel="現在地"
          style={[{ position: "absolute", right: 14, bottom: cart ? 84 : 14, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }, shadow.float]}
        >
          {locating ? <ActivityIndicator size="small" color={colors.ink} /> : <Ionicons name="locate" size={20} color={colors.ink} />}
        </Pressable>
      )}

      {!selected && <FloatingCartBar bottom={14} />}
      <FarmerBottomSheet farmer={selected} />
      <SearchPanel ref={search} farmers={all} />
    </View>
  );
}
