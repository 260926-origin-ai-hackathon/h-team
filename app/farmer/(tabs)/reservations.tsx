import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReservationCard } from "../../../components/ReservationCard";
import { ScreenTitle, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import { colors } from "../../../lib/theme";
import { useMyFarmer } from "../../../lib/useMyFarmer";

type Tab = "requested" | "confirmed" | "done" | "all";
const TABS: { k: Tab; label: string }[] = [
  { k: "requested", label: "対応待ち" },
  { k: "confirmed", label: "確定" },
  { k: "done", label: "完了" },
  { k: "all", label: "すべて" },
];

export default function FarmerReservationsScreen() {
  const insets = useSafeAreaInsets();
  const farmer = useMyFarmer();
  const all = useQuery(api.reservations.listForFarmer, farmer ? { farmerId: farmer._id } : "skip") ?? [];
  const [tab, setTab] = useState<Tab>("requested");
  const rows = all.filter((r) => tab === "all" || (tab === "done" ? ["completed", "declined", "cancelled"].includes(r.status) : r.status === tab));
  const count = (k: Tab) => all.filter((r) => k === "all" || (k === "done" ? ["completed", "declined", "cancelled"].includes(r.status) : r.status === k)).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 40, gap: 14 }}>
        <ScreenTitle label="RESERVATIONS" title="予約管理" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {TABS.map((t) => {
            const on = tab === t.k;
            return (
              <Pressable key={t.k} onPress={() => setTab(t.k)} accessibilityLabel={t.label} accessibilityState={{ selected: on }} style={{ flexDirection: "row", gap: 6, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999, backgroundColor: on ? colors.ink : colors.white, borderWidth: 1, borderColor: on ? colors.ink : colors.line }}>
                <Txt w={500} size={12} color={on ? colors.white : colors.inkSoft}>{t.label}</Txt>
                <Txt mono w={500} size={10} color={on ? colors.white : colors.muted}>{String(count(t.k))}</Txt>
              </Pressable>
            );
          })}
        </ScrollView>
        {farmer === null && <Txt size={12} color={colors.muted}>プロフィールを作成すると予約を受け付けられます。</Txt>}
        {farmer && rows.length === 0 && <Txt size={12} color={colors.muted}>該当する予約はありません。</Txt>}
        {rows.map((r) => (
          <ReservationCard key={r._id} reservation={r} perspective="farmer" onPress={() => router.push(`/farmer/reservation/${r._id}`)} />
        ))}
      </ScrollView>
    </View>
  );
}
