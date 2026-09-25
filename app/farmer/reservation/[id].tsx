import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Rating, StarRow } from "../../../components/Stars";
import { Btn, Card, Field, IconButton, StatusPill, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { fmtDateTime, methodLabel, paymentPill, statusPill } from "../../../lib/farmerView";
import { useStore } from "../../../lib/store";
import { colors, yen } from "../../../lib/theme";

export default function FarmerReservationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const r = useQuery(api.reservations.get, { id: id as Id<"reservations"> });
  const consumer = useQuery(api.users.get, r ? { userId: r.userId } : "skip");
  const setStatus = useMutation(api.reservations.setStatus);
  const rateConsumer = useMutation(api.reviews.rateConsumer);
  const showToast = useStore((s) => s.showToast);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [tracking, setTracking] = useState("");

  if (r === undefined) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}><ActivityIndicator color={colors.ink} /></View>;
  if (!r) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}><Txt color={colors.muted}>予約が見つかりません</Txt></View>;

  const st = statusPill(r.status, r.method);
  const pay = paymentPill(r);
  const act = async (status: "confirmed" | "declined" | "completed", msg: string, extra: { cashPaid?: boolean; trackingNumber?: string } = {}) => {
    if (busy) return;
    setBusy(true);
    try {
      await setStatus({ id: r._id, status, ...extra });
      showToast(msg);
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "失敗しました");
    } finally {
      setBusy(false);
    }
  };
  const submitRating = async () => {
    if (busy || rating === 0) return;
    setBusy(true);
    try {
      await rateConsumer({ reservationId: r._id, rating, comment: comment.trim() || undefined });
      showToast("お客さまを評価しました");
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 18, paddingBottom: insets.bottom + 40, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <IconButton name="chevron-back" onPress={() => router.back()} />
          <Txt w={700} size={20} style={{ flex: 1 }}>予約の詳細</Txt>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <StatusPill {...st} />
            {pay && <StatusPill {...pay} />}
          </View>
        </View>

        <Card style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.beigeAvatar, alignItems: "center", justifyContent: "center" }}>
            <Txt w={700} size={16}>{r.consumerName.slice(0, 1)}</Txt>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Txt w={700} size={14}>{r.consumerName}</Txt>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Txt size={11} color={colors.muted}>お客さまの評価</Txt>
              <Rating avg={consumer?.ratingAvg ?? 0} count={consumer?.ratingCount ?? 0} size={11} />
            </View>
          </View>
        </Card>

        <Card style={{ padding: 14, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name={r.method === "pickup" ? "walk-outline" : "cube-outline"} size={14} color={colors.green} />
            <Txt w={700} size={13}>{methodLabel(r.method)}</Txt>
          </View>
          {r.method === "pickup" && r.pickupAt && <Txt mono w={500} size={15}>{fmtDateTime(r.pickupAt)}</Txt>}
          {r.method === "delivery" && <Txt size={12} color={colors.inkSoft}>発送先: {r.address}</Txt>}
          {r.trackingNumber && <Txt mono size={12} color={colors.inkSoft}>{r.carrier} 追跡番号 {r.trackingNumber}</Txt>}
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

        {r.status === "requested" && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn label="辞退する" variant="outline" height={48} style={{ flex: 0.8 }} disabled={busy} onPress={() => act("declined", "辞退しました")} />
            <Btn label="予約を確定する" variant="green" height={48} style={{ flex: 1.2 }} disabled={busy} onPress={() => act("confirmed", "予約を確定しました")} />
          </View>
        )}
        {r.status === "confirmed" && r.method === "pickup" && (
          r.paymentStatus === "paid" ? (
            <Btn label="受け渡し完了にする" variant="green" height={48} disabled={busy} onPress={() => act("completed", "受取完了にしました")} />
          ) : (
            <Card style={{ padding: 14, gap: 10 }}>
              <Txt size={12} color={colors.inkSoft} style={{ lineHeight: 18 }}>お客さまはまだお支払いをしていません。現地で受け取った場合は現地払いとして完了できます。</Txt>
              <Btn label="現地払いで受け渡し完了" variant="green" height={48} disabled={busy} onPress={() => act("completed", "現地払いで受取完了にしました", { cashPaid: true })} />
            </Card>
          )
        )}
        {r.status === "confirmed" && r.method === "delivery" && (
          r.paymentStatus === "paid" ? (
            <Card style={{ padding: 14, gap: 10 }}>
              <Txt w={700} size={13}>発送する（ヤマト運輸）</Txt>
              <Field label="追跡番号（任意）" value={tracking} onChangeText={setTracking} placeholder="4123-4567-8901" keyboardType="numeric" />
              <Btn label="発送済みにする" variant="green" height={48} disabled={busy} onPress={() => act("completed", "発送済みにしました", { trackingNumber: tracking })} />
            </Card>
          ) : (
            <View style={{ padding: 12, borderRadius: 12, backgroundColor: colors.amberBg }}>
              <Txt w={500} size={12} color={colors.amberText}>お客さまのお支払い待ちです。支払い後に発送できます。</Txt>
            </View>
          )
        )}
        {r.status === "completed" && !r.farmerReviewed && (
          <Card style={{ padding: 14, gap: 10 }}>
            <Txt w={700} size={13}>お客さまを評価する</Txt>
            <Txt size={11} color={colors.muted}>他の生産者が予約を受けるときの参考になります（お客さまには公開されません）。</Txt>
            <StarRow value={rating} onChange={setRating} size={28} />
            <Field label="ひとこと（任意）" value={comment} onChangeText={setComment} placeholder="時間どおりに来てくれました、など" />
            <Btn label="評価を送る" height={44} disabled={busy || rating === 0} onPress={submitRating} />
          </Card>
        )}
        {r.status === "completed" && r.farmerReviewed && (
          <View style={{ padding: 12, borderRadius: 12, backgroundColor: colors.chip, alignItems: "center" }}>
            <Txt w={500} size={12} color={colors.inkSoft}>お客さまを評価済みです。</Txt>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
