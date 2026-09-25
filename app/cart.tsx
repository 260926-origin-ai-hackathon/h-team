import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerAvatar } from "../components/FarmerAvatar";
import { TabBar } from "../components/TabBar";
import { Btn, Card, SectionLabel, Stepper, Txt } from "../components/ui";
import { api } from "../convex/_generated/api";
import { DEMO_USER_ID } from "../lib/convex";
import { useStore } from "../lib/store";
import { colors, yen } from "../lib/theme";

const SHIPPING_PER_FARM = 880;

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, setQuantity, clearCart, enqueueReveal, showToast } = useStore();
  const products = useQuery(api.products.byIds, { ids: cart.map((c) => c.productId) }) ?? [];
  const farmers = useQuery(api.farmers.list) ?? [];
  const collections = useQuery(api.collections.mine, { userId: DEMO_USER_ID }) ?? [];
  const createOrder = useMutation(api.orders.create);
  const [busy, setBusy] = useState(false);

  const lines = cart
    .map((c) => ({ ...c, product: products.find((p) => p._id === c.productId) }))
    .filter((l) => l.product);
  const farmIds = [...new Set(lines.map((l) => l.farmerId))];
  const subtotal = lines.reduce((a, l) => a + (l.product?.price ?? 0) * l.quantity, 0);
  const shipping = farmIds.length * SHIPPING_PER_FARM;
  const countOf = (id: string) => collections.find((c) => c.farmerId === id)?.purchaseCount ?? 0;

  const checkout = async () => {
    if (busy || lines.length === 0) return;
    setBusy(true);
    try {
      const res = await createOrder({
        userId: DEMO_USER_ID,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      });
      clearCart();
      enqueueReveal(res.cards);
      router.navigate("/");
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "購入に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 120, gap: 16 }}>
        <View style={{ gap: 4 }}>
          <SectionLabel>CART</SectionLabel>
          <Txt w={700} size={24}>カート</Txt>
        </View>

        {lines.length === 0 ? (
          <View style={{ paddingVertical: 60, paddingHorizontal: 20, alignItems: "center", gap: 14 }}>
            <Txt w={500} size={14} color={colors.inkSoft}>カートは空です</Txt>
            <Txt size={12} color={colors.muted}>地図から生産者を探してみましょう</Txt>
            <Btn label="地図に戻る" variant="outline" style={{ paddingHorizontal: 20 }} onPress={() => router.navigate("/")} />
          </View>
        ) : (
          <>
            <Card style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
              {lines.map((l, i) => (
                <View
                  key={l.productId}
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: i < lines.length - 1 ? 1 : 0,
                    borderBottomColor: colors.lineLight,
                  }}
                >
                  <Image source={{ uri: l.product!.image }} style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.bgAlt }} contentFit="cover" />
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <Txt w={700} size={13}>{l.product!.name}</Txt>
                    <Txt size={11} color={colors.muted}>
                      {l.product!.farmerName} · {l.product!.unit}
                    </Txt>
                    <Txt mono w={500} size={13}>{yen(l.product!.price * l.quantity)}</Txt>
                  </View>
                  <Stepper value={l.quantity} onChange={(n) => setQuantity(l.productId, n)} />
                </View>
              ))}
            </Card>

            <Card style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
              <Txt w={700} size={12} color={colors.inkSoft}>この注文で届くカード</Txt>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {farmIds.map((id) => {
                  const f = farmers.find((x) => x._id === id);
                  if (!f) return null;
                  const c = countOf(id);
                  return (
                    <View key={id} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4, paddingLeft: 4, paddingRight: 10, borderRadius: 999, backgroundColor: colors.bgSoft }}>
                      <FarmerAvatar uri={f.avatar} size={26} owned tint={f.tint} borderWidth={1.5} />
                      <Txt w={500} size={11}>{f.name}</Txt>
                      <Txt w={500} size={10} color={colors.greenText}>
                        {c === 0 ? "はじめてのカード" : `${c + 1}枚目`}
                      </Txt>
                    </View>
                  );
                })}
              </View>
            </Card>

            <View style={{ gap: 8, paddingHorizontal: 4 }}>
              <Row label="小計" value={yen(subtotal)} />
              <Row label={`送料（${farmIds.length}農家から直送）`} value={yen(shipping)} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
                <Txt w={700} size={13}>合計</Txt>
                <Txt mono w={500} size={17}>{yen(subtotal + shipping)}</Txt>
              </View>
            </View>

            <Btn label={busy ? "処理中…" : "購入してカードを受け取る"} variant="green" height={52} disabled={busy} onPress={checkout} />
          </>
        )}
      </ScrollView>
      <TabBar active="cart" />
    </View>
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
