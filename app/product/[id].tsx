import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerAvatar } from "../../components/FarmerAvatar";
import { Badge } from "../../components/ProductCard";
import { Btn, IconButton, Stepper, Txt } from "../../components/ui";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DEMO_USER_ID } from "../../lib/convex";
import { productBadges } from "../../lib/farmerView";
import { useStore } from "../../lib/store";
import { colors, pad3, yen } from "../../lib/theme";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const product = useQuery(api.products.get, { id: id as Id<"products"> });
  const collections = useQuery(api.collections.mine, { userId: DEMO_USER_ID }) ?? [];
  const createOrder = useMutation(api.orders.create);
  const { addToCart, showToast, enqueueReveal, selectFarmer } = useStore();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  if (product === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }
  if (product === null || !product.farmer) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
        <Txt color={colors.muted}>商品が見つかりません</Txt>
      </View>
    );
  }

  const farmer = product.farmer;
  const count = collections.find((c) => c.farmerId === farmer._id)?.purchaseCount ?? 0;
  const owned = count > 0;
  const badges = productBadges(product);
  const soldOut = product.stock <= 0;

  const buyNow = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await createOrder({ userId: DEMO_USER_ID, items: [{ productId: product._id, quantity: qty }] });
      selectFarmer(null);
      enqueueReveal(res.cards);
      router.navigate("/");
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "購入に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ aspectRatio: 1 / 0.9, backgroundColor: colors.bgAlt }}>
          <Image source={{ uri: product.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={250} />
          <View style={{ position: "absolute", top: insets.top + 8, left: 16 }}>
            <IconButton name="chevron-back" onPress={() => router.back()} />
          </View>
        </View>
        <View style={{ paddingHorizontal: 18, paddingVertical: 20, gap: 14 }}>
          <Pressable onPress={() => router.push(`/farmer/${farmer._id}`)} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <FarmerAvatar uri={farmer.avatar} size={28} owned={owned} tint={farmer.tint} borderWidth={1.5} />
            <Txt w={500} size={12} color={colors.inkSoft}>
              {farmer.name} · {farmer.farmName}
            </Txt>
          </Pressable>
          {badges.length > 0 && (
            <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
              {badges.map((b) => <Badge key={b.label} {...b} />)}
            </View>
          )}
          <View style={{ gap: 6 }}>
            <Txt w={700} size={22}>{product.name}</Txt>
            <Txt size={12} color={colors.muted}>{product.unit}</Txt>
          </View>
          <Txt mono w={500} size={24}>
            {yen(product.price)}
            <Txt size={11} color={colors.muted}> 税込</Txt>
          </Txt>
          <Txt size={13} color={colors.inkSoft} style={{ lineHeight: 23 }}>{product.description}</Txt>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Info label="収穫" value={product.harvest} />
            <Info label="在庫" value={soldOut ? "売り切れ" : `${product.stock}点`} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: owned ? colors.greenTint : colors.bg,
              borderWidth: 1,
              borderColor: owned ? colors.greenLine : "#D4D4CE",
              borderStyle: owned ? "solid" : "dashed",
            }}
          >
            <View style={{ backgroundColor: colors.white, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Txt mono w={500} size={10} color={colors.inkSoft}>No.{pad3(farmer.no)}</Txt>
            </View>
            <Txt w={500} size={12} color="#44443F" style={{ flex: 1 }}>
              {owned ? `購入すると${count + 1}枚目のカードが届きます` : `購入すると${farmer.name}さんのカードが解放されます`}
            </Txt>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: insets.bottom + 12, borderTopWidth: 1, borderTopColor: "#F0F0EC", backgroundColor: colors.white, gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Stepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(n, Math.max(product.stock, 1))))} size="md" />
          <Btn
            label="カートに入れる"
            variant="green"
            height={50}
            style={{ flex: 1 }}
            disabled={soldOut}
            onPress={() => {
              addToCart({ productId: product._id, farmerId: farmer._id, quantity: qty });
              showToast(`${product.name} をカートに追加しました`);
            }}
          />
        </View>
        <Btn label={busy ? "処理中…" : "今すぐ購入してカードを受け取る"} variant="outline" height={44} disabled={soldOut || busy} onPress={buyNow} />
      </View>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 3 }}>
      <Txt size={10} color={colors.muted}>{label}</Txt>
      <Txt w={700} size={13}>{value}</Txt>
    </View>
  );
}
