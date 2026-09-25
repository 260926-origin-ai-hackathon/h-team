import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activeFilterCount, useStore } from "../lib/store";
import { colors, shadow } from "../lib/theme";
import { Txt } from "./ui";

/** Top overlay on the map: header pill (検索 → 絞り込みシート, 予約) + quick filter chips. */
export function MapFilters({ upcoming, resultCount, onOpenSearch }: { upcoming: number; resultCount: number; onOpenSearch: () => void }) {
  const insets = useSafeAreaInsets();
  const { filters, setFilters, resetFilters } = useStore();
  const n = activeFilterCount(filters);

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", top: insets.top + 6, left: 12, right: 12, gap: 8 }}>
      <View style={[{ height: 48, borderRadius: 24, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 18, paddingRight: 8 }, shadow.float]}>
        <Txt w={700} size={15} style={{ letterSpacing: 0.3 }}>はたけマップ</Txt>
        <Txt mono w={500} size={10} color="#9A9A94">OSAKA</Txt>
        <View style={{ flex: 1 }} />
        <Pressable onPress={onOpenSearch} hitSlop={8} accessibilityLabel="検索" style={{ flexDirection: "row", alignItems: "center", gap: 4, height: 34, paddingHorizontal: 10, borderRadius: 17, backgroundColor: n > 0 ? colors.ink : "#F5F5F2" }}>
          <Ionicons name="search" size={15} color={n > 0 ? colors.white : colors.inkSoft} />
          {n > 0 && <Txt mono w={500} size={11} color={colors.white}>{String(n)}</Txt>}
        </Pressable>
        <Pressable onPress={() => router.navigate("/consumer/reservations")} accessibilityLabel="予約一覧" style={{ flexDirection: "row", alignItems: "center", gap: 6, height: 34, paddingHorizontal: 12, borderRadius: 17, backgroundColor: "#F5F5F2" }}>
          <Ionicons name="calendar-outline" size={13} color={colors.inkSoft} />
          <Txt w={500} size={11} color={colors.inkSoft}>予約</Txt>
          <Txt mono w={500} size={12}>{String(upcoming)}</Txt>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 2, paddingVertical: 2, paddingBottom: 6 }}>
        {filters.query.trim().length > 0 && <Chip label={`「${filters.query.trim()}」`} on onPress={() => setFilters({ query: "" })} close />}
        {filters.crop && <Chip label={filters.crop} on onPress={() => setFilters({ crop: null })} close />}
        <Chip label="本日収穫" dot={colors.green} on={filters.today} onPress={() => setFilters({ today: !filters.today })} />
        <Chip label="発送対応" dot={colors.inkSoft} on={filters.delivery} onPress={() => setFilters({ delivery: !filters.delivery })} />
        <Chip label="評価4.5+" dot={colors.star} on={filters.top} onPress={() => setFilters({ top: !filters.top })} />
        {n > 0 && (
          <Pressable onPress={resetFilters} accessibilityLabel="すべて表示" style={[{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.white }, shadow.card]}>
            <Txt w={500} size={12} color={colors.muted}>{resultCount}件 · クリア</Txt>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

function Chip({ label, on, onPress, dot, close = false }: { label: string; on: boolean; onPress: () => void; dot?: string; close?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on }}
      style={[{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999, backgroundColor: on ? colors.ink : colors.white }, shadow.card]}
    >
      {dot && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot }} />}
      <Txt w={500} size={12} color={on ? colors.white : colors.inkSoft}>{label}</Txt>
      {close && <Ionicons name="close" size={12} color={colors.white} />}
    </Pressable>
  );
}
