import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerAvatar } from "../../../components/FarmerAvatar";
import { Badge } from "../../../components/ProductCard";
import { Rating } from "../../../components/Stars";
import { Btn, IconButton, Stepper, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { productBadges , CARRIER } from "../../../lib/farmerView";
import { cartCount, useStore } from "../../../lib/store";
import { colors, yen } from "../../../lib/theme";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const product = useQuery(api.products.get, { id: id as Id<"products"> });
  const { addToCart, showToast } = useStore();
  const cartN = useStore((s) => cartCount(s.cart));
  const [qty, setQty] = useState(1);

  if (product === undefined) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}><ActivityIndicator color={colors.ink} /></View>;
  }
  if (product === null || !product.farmer) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}><Txt color={colors.muted}>商品が見つかりません</Txt></View>;
  }
  const farmer = product.farmer;
  const badges = productBadges(product);
  const soldOut = product.stock <= 0;
  const add = (thenGo: boolean) => {
    const r = addToCart(farmer._id, farmer.name, product._id, qty);
    showToast(r === "replaced" ? "別の生産者の商品を入れ替えました" : `${product.name} をカゴに追加しました`, thenGo ? undefined : { label: "カゴを見る", href: "/consumer/cart" });
    if (thenGo) router.navigate("/consumer/cart");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ aspectRatio: 1 / 0.9, backgroundColor: colors.bgAlt }}>
          <Image source={{ uri: product.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={250} />
          <View style={{ position: "absolute", top: insets.top + 8, left: 16 }}>
            <IconButton name="chevron-back" onPress={() => router.back()} />
          </View>
          {cartN > 0 && (
            <Pressable onPress={() => router.navigate("/consumer/cart")} accessibilityLabel={`カゴ ${cartN}`} style={{ position: "absolute", top: insets.top + 8, right: 16, height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", gap: 6, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
              <Ionicons name="bag-outline" size={14} color={colors.ink} />
              <View style={{ backgroundColor: colors.ink, borderRadius: 9, paddingHorizontal: 6, paddingVertical: 1 }}>
                <Txt mono w={500} size={11} color={colors.white}>{String(cartN)}</Txt>
              </View>
            </Pressable>
          )}
        </View>
        <View style={{ paddingHorizontal: 18, paddingVertical: 20, gap: 14 }}>
          <Pressable onPress={() => router.push(`/consumer/farmer/${farmer._id}`)} accessibilityLabel={`生産者 ${farmer.name}`} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <FarmerAvatar uri={farmer.avatar} size={28} tint={farmer.tint} borderWidth={1.5} />
            <Txt w={500} size={12} color={colors.inkSoft}>{farmer.name} · {farmer.farmName}</Txt>
            <Rating avg={farmer.ratingAvg} count={farmer.reviewCount} size={11} showCount={false} />
          </Pressable>
          {badges.length > 0 && <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>{badges.map((b) => <Badge key={b.label} {...b} />)}</View>}
          <View style={{ gap: 6 }}>
            <Txt w={700} size={22}>{product.name}</Txt>
            <Txt size={12} color={colors.muted}>{product.unit}</Txt>
          </View>
          <Txt mono w={500} size={24}>{yen(product.price)}<Txt size={11} color={colors.muted}> 税込</Txt></Txt>
          <Txt size={13} color={colors.inkSoft} style={{ lineHeight: 23 }}>{product.description}</Txt>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Info label="収穫" value={product.harvest} />
            <Info label="在庫" value={soldOut ? "売り切れ" : `${product.stock}点`} />
          </View>
          <View style={{ gap: 8, padding: 14, borderRadius: 14, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="walk-outline" size={14} color={colors.green} />
              <Txt w={700} size={12}>取りに行く</Txt>
              <Txt size={11} color={colors.inkSoft}>{farmer.pickupHours}</Txt>
            </View>
            <Txt size={11.5} color={colors.muted} style={{ lineHeight: 17 }}>{farmer.pickupAddress}</Txt>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="cube-outline" size={14} color={product.deliveryAvailable ? colors.green : colors.mutedLight} />
              <Txt w={700} size={12} color={product.deliveryAvailable ? colors.ink : colors.muted}>発送</Txt>
              <Txt size={11} color={colors.inkSoft}>{product.deliveryAvailable ? `${CARRIER} 宅急便（送料 ¥880）` : "この商品は受取のみ"}</Txt>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: insets.bottom + 12, borderTopWidth: 1, borderTopColor: "#F0F0EC", backgroundColor: colors.white, gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Stepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(n, Math.max(product.stock, 1))))} size="md" />
          <Btn label="カゴに入れる" variant="green" height={50} style={{ flex: 1 }} disabled={soldOut} onPress={() => add(false)} />
        </View>
        <Btn label="この商品を予約する" variant="outline" height={44} disabled={soldOut} onPress={() => add(true)} />
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
