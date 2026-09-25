import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useMemo } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { matchesFilter } from "../lib/map";
import { activeFilterCount, useStore } from "../lib/store";
import { colors, fonts } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { Btn, SectionLabel, Txt } from "./ui";

/** 検索ボタンで開く絞り込みシート: キーワード・条件・作物。 */
export const SearchPanel = forwardRef<BottomSheetModal, { farmers: Farmer[] }>(function SearchPanel({ farmers }, ref) {
  const insets = useSafeAreaInsets();
  const { filters, setFilters, resetFilters } = useStore();
  const crops = useMemo(() => [...new Set(farmers.flatMap((f) => f.crops))], [farmers]);
  const count = farmers.filter((f) => matchesFilter(f, filters)).length;
  const close = () => (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      accessible={false}
      accessibilityLabel={null}
      backdropComponent={(p) => <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.35} />}
      backgroundStyle={{ borderRadius: 24, backgroundColor: colors.white }}
      handleIndicatorStyle={{ backgroundColor: colors.line }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={{ paddingHorizontal: 18, paddingTop: 6, paddingBottom: insets.bottom + 16, gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Txt w={700} size={18}>生産者を探す</Txt>
          {activeFilterCount(filters) > 0 && (
            <Pressable onPress={resetFilters} accessibilityLabel="条件をクリア" hitSlop={8}>
              <Txt w={500} size={12} color={colors.muted}>条件をクリア</Txt>
            </Pressable>
          )}
        </View>

        <View style={{ height: 44, borderRadius: 12, backgroundColor: colors.bgAlt, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 }}>
          <Ionicons name="search" size={15} color={colors.muted} />
          <BottomSheetTextInput
            value={filters.query}
            onChangeText={(query) => setFilters({ query })}
            placeholder="生産者名・地域・作物"
            placeholderTextColor={colors.mutedLight}
            returnKeyType="search"
            accessibilityLabel="キーワード"
            testID="field-キーワード"
            style={{ flex: 1, fontFamily: fonts.sans500, fontSize: 14, color: colors.ink, paddingVertical: 0 }}
          />
          {filters.query.length > 0 && (
            <Pressable onPress={() => setFilters({ query: "" })} hitSlop={8} accessibilityLabel="キーワードを消す">
              <Ionicons name="close-circle" size={16} color={colors.mutedLight} />
            </Pressable>
          )}
        </View>

        <View style={{ gap: 8 }}>
          <SectionLabel>条件</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            <Chip label="本日収穫" on={filters.today} onPress={() => setFilters({ today: !filters.today })} dot={colors.green} />
            <Chip label="発送対応" on={filters.delivery} onPress={() => setFilters({ delivery: !filters.delivery })} dot={colors.inkSoft} />
            <Chip label="評価4.5以上" on={filters.top} onPress={() => setFilters({ top: !filters.top })} dot={colors.star} />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <SectionLabel>作物</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {crops.map((c) => (
              <Chip key={c} label={c} on={filters.crop === c} onPress={() => setFilters({ crop: filters.crop === c ? null : c })} />
            ))}
          </View>
        </View>

        <Btn label={`${count} 件の生産者を表示`} variant="green" height={48} onPress={close} />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

function Chip({ label, on, onPress, dot }: { label: string; on: boolean; onPress: () => void; dot?: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on }}
      style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: on ? colors.ink : colors.white, borderWidth: 1, borderColor: on ? colors.ink : colors.line }}
    >
      {dot && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot }} />}
      <Txt w={500} size={12} color={on ? colors.white : colors.inkSoft}>{label}</Txt>
    </Pressable>
  );
}
