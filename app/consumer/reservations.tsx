import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReservationCard } from "../../components/ReservationCard";
import { TabBar } from "../../components/TabBar";
import { ScreenTitle, SectionLabel, Txt } from "../../components/ui";
import { api } from "../../convex/_generated/api";
import { useStore } from "../../lib/store";
import { colors } from "../../lib/theme";

export default function ReservationsScreen() {
  const insets = useSafeAreaInsets();
  const userId = useStore((s) => s.userId);
  const all = useQuery(api.reservations.listMine, userId ? { userId } : "skip") ?? [];
  const active = all.filter((r) => r.status === "requested" || r.status === "confirmed");
  const past = all.filter((r) => !(r.status === "requested" || r.status === "confirmed"));
  const toReview = past.filter((r) => r.status === "completed" && !r.consumerReviewed).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 120, gap: 16 }}>
        <ScreenTitle
          label="RESERVATIONS"
          title="予約"
          right={
            <Pressable onPress={() => router.replace("/")} accessibilityLabel="ロールを切り替え" style={{ paddingVertical: 6 }}>
              <Txt w={500} size={11} color={colors.muted}>切り替え</Txt>
            </Pressable>
          }
        />
        {toReview > 0 && (
          <View style={{ padding: 12, borderRadius: 12, backgroundColor: colors.greenTint, borderWidth: 1, borderColor: colors.greenLine }}>
            <Txt w={500} size={12} color={colors.greenText}>受取完了した予約が {toReview} 件あります。レビューを書いて生産者に伝えましょう。</Txt>
          </View>
        )}
        <SectionLabel>進行中</SectionLabel>
        {active.length === 0 && <Txt size={12} color={colors.muted}>進行中の予約はありません。</Txt>}
        {active.map((r) => (
          <ReservationCard key={r._id} reservation={r} perspective="consumer" onPress={() => router.push(`/consumer/reservation/${r._id}`)} />
        ))}
        <SectionLabel>履歴</SectionLabel>
        {past.map((r) => (
          <ReservationCard key={r._id} reservation={r} perspective="consumer" onPress={() => router.push(`/consumer/reservation/${r._id}`)} />
        ))}
      </ScrollView>
      <TabBar active="reservations" />
    </View>
  );
}
