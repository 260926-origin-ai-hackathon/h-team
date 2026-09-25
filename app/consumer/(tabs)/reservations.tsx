import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReservationCard } from "../../../components/ReservationCard";
import { Card, ScreenTitle, SectionLabel, Txt } from "../../../components/ui";
import { Image } from "expo-image";
import { fmtExpected } from "../../../lib/farmerView";
import { yen , colors } from "../../../lib/theme";
import { api } from "../../../convex/_generated/api";
import { useStore } from "../../../lib/store";

export default function ReservationsScreen() {
  const insets = useSafeAreaInsets();
  const userId = useStore((s) => s.userId);
  const all = useQuery(api.reservations.listMine, userId ? { userId } : "skip") ?? [];
  const watches = useQuery(api.watches.mine, userId ? { userId } : "skip") ?? [];
  const active = all.filter((r) => r.status === "requested" || r.status === "confirmed");
  const past = all.filter((r) => !(r.status === "requested" || r.status === "confirmed"));
  const toReview = past.filter((r) => r.status === "completed" && !r.consumerReviewed).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 40, gap: 16 }}>
        <ScreenTitle label="RESERVATIONS" title="予約" />
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

        <SectionLabel>ウォッチ中の出荷予定</SectionLabel>
        {watches.length === 0 && <Txt size={12} color={colors.muted}>生産者ページの「出荷予定」からウォッチすると、販売開始をここでお知らせします。</Txt>}
        {watches.map((w) => (
          <Pressable key={w._id} onPress={() => router.push(w.onSale ? `/consumer/product/${w.productId}` : `/consumer/farmer/${w.farmerId}`)} accessibilityLabel={`ウォッチ ${w.name}`}>
            <Card style={{ padding: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Image source={{ uri: w.image }} style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: colors.bgAlt }} contentFit="cover" />
              <View style={{ flex: 1, gap: 3 }}>
                <Txt w={700} size={13}>{w.name}</Txt>
                <Txt size={11} color={colors.muted}>{w.farmerName} · {yen(w.price)} / {w.unit}</Txt>
              </View>
              {w.onSale ? (
                <View style={{ backgroundColor: colors.green, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 }}>
                  <Txt w={700} size={10} color={colors.white}>販売開始</Txt>
                </View>
              ) : (
                <Txt mono size={10.5} color={colors.amberText}>{w.expectedAt ? fmtExpected(w.expectedAt) : "時期未定"}</Txt>
              )}
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
