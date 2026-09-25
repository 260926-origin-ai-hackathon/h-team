import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerAvatar } from "../../../components/FarmerAvatar";
import { Rating } from "../../../components/Stars";
import { Btn, Card, IconButton, StatusPill, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { fmtDateTime, methodLabel, statusPill } from "../../../lib/farmerView";
import { useStore } from "../../../lib/store";
import { colors, yen } from "../../../lib/theme";

const STEPS = ["リクエスト", "確定", "受取完了"] as const;

export default function ReservationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const r = useQuery(api.reservations.get, { id: id as Id<"reservations"> });
  const setStatus = useMutation(api.reservations.setStatus);
  const showToast = useStore((s) => s.showToast);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (r === undefined) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}><ActivityIndicator color={colors.ink} /></View>;
  if (!r || !r.farmer) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}><Txt color={colors.muted}>予約が見つかりません</Txt></View>;

  const st = statusPill(r.status, r.method);
  const stepIdx = r.status === "requested" ? 0 : r.status === "confirmed" ? 1 : r.status === "completed" ? 2 : -1;
  const cancellable = r.status === "requested" || r.status === "confirmed";

  const cancel = async () => {
    try {
      await setStatus({ id: r._id, status: "cancelled" });
      showToast("予約をキャンセルしました");
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "失敗しました");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 18, paddingBottom: insets.bottom + 40, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <IconButton name="chevron-back" onPress={() => router.back()} />
          <Txt w={700} size={20} style={{ flex: 1 }}>予約の詳細</Txt>
          <StatusPill {...st} />
        </View>

        {stepIdx >= 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
            {STEPS.map((s, i) => (
              <View key={s} style={{ flexDirection: "row", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <View style={{ alignItems: "center", gap: 4 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: i <= stepIdx ? colors.greenDeep : colors.line, alignItems: "center", justifyContent: "center" }}>
                    {i < stepIdx ? <Ionicons name="checkmark" size={13} color={colors.white} /> : <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white }} />}
                  </View>
                  <Txt w={i === stepIdx ? 700 : 400} size={10} color={i <= stepIdx ? colors.ink : colors.muted}>{s}</Txt>
                </View>
                {i < STEPS.length - 1 && <View style={{ flex: 1, height: 2, marginBottom: 16, marginHorizontal: 4, backgroundColor: i < stepIdx ? colors.greenDeep : colors.line }} />}
              </View>
            ))}
          </View>
        )}

        <Pressable onPress={() => router.push(`/consumer/farmer/${r.farmer!._id}`)} accessibilityLabel={`生産者 ${r.farmer.name}`}>
          <Card style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <FarmerAvatar uri={r.farmer.avatar} size={44} tint={r.farmer.tint} borderWidth={2} />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt w={700} size={14}>{r.farmer.name}</Txt>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <Rating avg={r.farmer.ratingAvg} count={r.farmer.reviewCount} size={11} />
                <Txt size={11} color={colors.muted}>{r.farmer.farmName}</Txt>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
          </Card>
        </Pressable>

        <Card style={{ padding: 14, gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name={r.method === "pickup" ? "walk-outline" : "cube-outline"} size={14} color={colors.green} />
            <Txt w={700} size={13}>{methodLabel(r.method)}</Txt>
          </View>
          {r.method === "pickup" ? (
            <>
              {r.pickupAt && <Txt mono w={500} size={15}>{fmtDateTime(r.pickupAt)}</Txt>}
              <Txt size={12} color={colors.inkSoft} style={{ lineHeight: 19 }}>{r.farmer.pickupAddress}</Txt>
              <Txt size={11} color={colors.muted}>受取可能: {r.farmer.pickupHours}{r.farmer.pickupNote ? ` · ${r.farmer.pickupNote}` : ""}</Txt>
            </>
          ) : (
            <Txt size={12} color={colors.inkSoft}>発送先: {r.address}</Txt>
          )}
          {r.note && <Txt size={11.5} color={colors.muted}>メモ: {r.note}</Txt>}
        </Card>

        <Card style={{ paddingHorizontal: 14, paddingVertical: 6 }}>
          {r.items.map((it, i) => (
            <View key={it.productId} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: i < r.items.length - 1 ? 1 : 0, borderBottomColor: colors.lineLight }}>
              <Txt size={13}>{it.name} <Txt size={11} color={colors.muted}>{it.unit} ×{it.quantity}</Txt></Txt>
              <Txt mono w={500} size={13}>{yen(it.price * it.quantity)}</Txt>
            </View>
          ))}
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
            <Txt w={700} size={13}>合計{r.shipping ? `（送料 ${yen(r.shipping)} 含む）` : ""}</Txt>
            <Txt mono w={500} size={15}>{yen(r.total)}</Txt>
          </View>
        </Card>

        {r.status === "completed" && (
          r.consumerReviewed ? (
            <View style={{ padding: 12, borderRadius: 12, backgroundColor: colors.chip, alignItems: "center" }}>
              <Txt w={500} size={12} color={colors.inkSoft}>レビュー投稿済み。ありがとうございました。</Txt>
            </View>
          ) : (
            <Btn label="レビューを書く" variant="green" height={48} onPress={() => router.push(`/consumer/review/${r._id}`)} />
          )
        )}

        {cancellable && !confirmCancel && <Btn label="予約をキャンセル" variant="outline" height={44} onPress={() => setConfirmCancel(true)} />}
        {cancellable && confirmCancel && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn label="やめる" variant="outline" height={44} style={{ flex: 1 }} onPress={() => setConfirmCancel(false)} />
            <Btn label="キャンセルを確定" height={44} style={{ flex: 1 }} onPress={cancel} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
