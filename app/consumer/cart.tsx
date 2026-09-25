import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar } from "../../components/TabBar";
import { Btn, Card, Field, ScreenTitle, Segmented, Stepper, Txt } from "../../components/ui";
import { api } from "../../convex/_generated/api";
import { PICKUP_HOURS, pickupDays } from "../../lib/farmerView";
import { useStore } from "../../lib/store";
import type { Fulfillment } from "../../lib/types";
import { colors, yen } from "../../lib/theme";

const SHIPPING_FEE = 880;

/** 予約カゴ: 1 生産者分の商品 + 受取方法・日時 → 予約リクエスト。 */
export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { userId, cart, setQuantity, clearCart, showToast } = useStore();
  const products = useQuery(api.products.byIds, { ids: cart?.items.map((c) => c.productId) ?? [] }) ?? [];
  const farmer = useQuery(api.farmers.get, cart ? { id: cart.farmerId } : "skip");
  const create = useMutation(api.reservations.create);

  const [method, setMethod] = useState<Fulfillment>("pickup");
  const [dayIdx, setDayIdx] = useState(0);
  const [hour, setHour] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const days = useMemo(() => pickupDays(7), []);

  const lines = (cart?.items ?? []).map((c) => ({ ...c, product: products.find((p) => p._id === c.productId) })).filter((l) => l.product);
  const subtotal = lines.reduce((a, l) => a + (l.product?.price ?? 0) * l.quantity, 0);
  const allDeliverable = lines.length > 0 && lines.every((l) => l.product?.deliveryAvailable);
  const shipping = method === "delivery" ? SHIPPING_FEE : 0;
  const pickupAt = hour === null ? undefined : new Date(days[dayIdx].date.getTime() + hour * 3600 * 1000).getTime();
  const ready = lines.length > 0 && (method === "pickup" ? hour !== null : address.trim().length > 0);

  const submit = async () => {
    if (!cart || busy || !ready) return;
    setBusy(true);
    try {
      const id = await create({
        userId,
        farmerId: cart.farmerId,
        method,
        pickupAt: method === "pickup" ? pickupAt : undefined,
        address: method === "delivery" ? address.trim() : undefined,
        note: note.trim() || undefined,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      });
      clearCart();
      showToast("予約をリクエストしました。生産者の確定をお待ちください");
      // Land on the reservation list with the new reservation on top, so "back" returns to the list.
      router.dismissAll();
      router.navigate("/consumer/reservations");
      router.push(`/consumer/reservation/${id}`);
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "予約に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 130, gap: 16 }} keyboardShouldPersistTaps="handled">
        <ScreenTitle label="RESERVATION" title="予約カゴ" />

        {!cart || lines.length === 0 ? (
          <View style={{ paddingVertical: 60, paddingHorizontal: 20, alignItems: "center", gap: 14 }}>
            <Txt w={500} size={14} color={colors.inkSoft}>カゴは空です</Txt>
            <Txt size={12} color={colors.muted}>地図から生産者を探して、商品を入れましょう</Txt>
            <Btn label="地図に戻る" variant="outline" style={{ paddingHorizontal: 20 }} onPress={() => router.navigate("/consumer/map")} />
          </View>
        ) : (
          <>
            <Card style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.lineLight }}>
                <Ionicons name="leaf-outline" size={14} color={colors.green} />
                <Txt w={700} size={13}>{cart.farmerName}</Txt>
                {farmer && <Txt size={11} color={colors.muted}>· {farmer.farmName}</Txt>}
              </View>
              {lines.map((l, i) => (
                <View key={l.productId} style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 12, borderBottomWidth: i < lines.length - 1 ? 1 : 0, borderBottomColor: colors.lineLight }}>
                  <Image source={{ uri: l.product!.image }} style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.bgAlt }} contentFit="cover" />
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <Txt w={700} size={13}>{l.product!.name}</Txt>
                    <Txt size={11} color={colors.muted}>{l.product!.unit}{l.product!.deliveryAvailable ? " · 発送可" : " · 受取のみ"}</Txt>
                    <Txt mono w={500} size={13}>{yen(l.product!.price * l.quantity)}</Txt>
                  </View>
                  <Stepper value={l.quantity} onChange={(n) => setQuantity(l.productId, n)} />
                </View>
              ))}
            </Card>

            <Card style={{ padding: 14, gap: 12 }}>
              <Txt w={700} size={13}>受取方法</Txt>
              <Segmented
                value={method}
                onChange={setMethod}
                options={[
                  { value: "pickup", label: "取りに行く" },
                  { value: "delivery", label: "発送代行", disabled: !allDeliverable },
                ]}
              />
              {!allDeliverable && <Txt size={11} color={colors.muted}>受取のみの商品が含まれるため発送は選べません。</Txt>}

              {method === "pickup" ? (
                <View style={{ gap: 10 }}>
                  {farmer && (
                    <View style={{ gap: 3, padding: 12, borderRadius: 12, backgroundColor: colors.bg }}>
                      <Txt size={12} color={colors.inkSoft}>{farmer.pickupAddress}</Txt>
                      <Txt size={11} color={colors.muted}>受取可能: {farmer.pickupHours}</Txt>
                    </View>
                  )}
                  <Txt w={500} size={11} color={colors.muted}>受取日</Txt>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    {days.map((d, i) => (
                      <Chip key={d.label} label={d.label} on={i === dayIdx} onPress={() => setDayIdx(i)} />
                    ))}
                  </ScrollView>
                  <Txt w={500} size={11} color={colors.muted}>時間</Txt>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                    {PICKUP_HOURS.map((h) => (
                      <Chip key={h} label={`${h}:00`} on={h === hour} onPress={() => setHour(h)} mono />
                    ))}
                  </View>
                </View>
              ) : (
                <Field label="発送先住所" value={address} onChangeText={setAddress} placeholder="大阪市北区…" />
              )}
              <Field label="生産者へのメモ（任意）" value={note} onChangeText={setNote} placeholder="10時ごろ伺います、など" />
            </Card>

            <View style={{ gap: 8, paddingHorizontal: 4 }}>
              <Row label="小計" value={yen(subtotal)} />
              <Row label={method === "delivery" ? "送料（発送代行）" : "送料"} value={method === "delivery" ? yen(shipping) : "¥0（受取）"} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
                <Txt w={700} size={13}>合計（受取時に支払い）</Txt>
                <Txt mono w={500} size={17}>{yen(subtotal + shipping)}</Txt>
              </View>
            </View>

            <Btn label={busy ? "送信中…" : "予約をリクエスト"} variant="green" height={52} disabled={busy || !ready} onPress={submit} />
            <Txt size={11} color={colors.muted} style={{ textAlign: "center", lineHeight: 17 }}>生産者が確定すると予約が成立します。確定後のキャンセルは予約ページから。</Txt>
          </>
        )}
      </ScrollView>
      <TabBar active="cart" />
    </View>
  );
}

function Chip({ label, on, onPress, mono = false }: { label: string; on: boolean; onPress: () => void; mono?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: on ? colors.ink : colors.bg, borderWidth: 1, borderColor: on ? colors.ink : colors.line }}>
      <Txt mono={mono} w={500} size={12} color={on ? colors.white : colors.inkSoft}>{label}</Txt>
    </Pressable>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Txt size={13} color={colors.inkSoft}>{label}</Txt>
      <Txt mono w={500} size={13} color={colors.inkSoft}>{value}</Txt>
    </View>
  );
}
