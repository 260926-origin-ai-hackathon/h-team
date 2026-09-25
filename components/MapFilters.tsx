import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore, type FilterKind } from "../lib/store";
import { colors, fonts, shadow } from "../lib/theme";
import { Txt } from "./ui";

const CHIPS: { k: FilterKind; label: string; dot: string }[] = [
  { k: "all", label: "すべて", dot: colors.muted },
  { k: "today", label: "本日収穫", dot: colors.green },
  { k: "owned", label: "購入済み", dot: colors.green },
  { k: "locked", label: "未解放", dot: colors.lockedBorder },
];

/** Top overlay on the map: 図鑑 header pill + filter chips (or the search field). */
export function MapFilters({
  ownedCount,
  total,
  counts,
}: {
  ownedCount: number;
  total: number;
  counts: Record<FilterKind, number>;
}) {
  const insets = useSafeAreaInsets();
  const { filter, setFilter, query, setQuery } = useStore();
  const [searching, setSearching] = useState(false);
  const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", top: insets.top + 6, left: 12, right: 12, gap: 8 }}
    >
      <Pressable
        onPress={() => router.navigate("/collection")}
        style={[
          {
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.white,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingLeft: 18,
            paddingRight: 8,
          },
          shadow.float,
        ]}
      >
        <Txt w={700} size={15} style={{ letterSpacing: 0.3 }}>
          はたけカード
        </Txt>
        <Txt mono w={500} size={10} color="#9A9A94">
          OSAKA
        </Txt>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => {
            setSearching((s) => !s);
            if (searching) setQuery("");
          }}
          hitSlop={8}
          style={{ width: 34, height: 34, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name={searching ? "close" : "search"} size={17} color={colors.inkSoft} />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            height: 34,
            paddingHorizontal: 12,
            borderRadius: 17,
            backgroundColor: "#F5F5F2",
          }}
        >
          <Txt w={500} size={11} color={colors.inkSoft}>
            図鑑
          </Txt>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: "hidden" }}>
            <View style={{ height: "100%", width: `${pct}%`, backgroundColor: colors.green }} />
          </View>
          <Txt mono w={500} size={12}>
            {ownedCount}
            <Txt mono w={500} size={12} color="#9A9A94">
              /{total}
            </Txt>
          </Txt>
        </View>
      </Pressable>

      {searching ? (
        <View
          style={[
            {
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.white,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              gap: 8,
            },
            shadow.card,
          ]}
        >
          <Ionicons name="search" size={14} color={colors.muted} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="生産者名・地域・作物で探す"
            placeholderTextColor={colors.mutedLight}
            returnKeyType="search"
            style={{ flex: 1, fontFamily: fonts.sans500, fontSize: 13, color: colors.ink, paddingVertical: 0 }}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingHorizontal: 2, paddingVertical: 2, paddingBottom: 6 }}
        >
          {CHIPS.map((c) => {
            const active = filter === c.k;
            return (
              <Pressable
                key={c.k}
                onPress={() => setFilter(c.k)}
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                    borderRadius: 999,
                    backgroundColor: active ? colors.ink : colors.white,
                  },
                  shadow.card,
                ]}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.dot }} />
                <Txt w={500} size={12} color={active ? colors.white : colors.inkSoft}>
                  {c.label}
                </Txt>
                <Txt mono w={500} size={10} color={active ? colors.white : colors.inkSoft} style={{ opacity: 0.6 }}>
                  {String(counts[c.k])}
                </Txt>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
