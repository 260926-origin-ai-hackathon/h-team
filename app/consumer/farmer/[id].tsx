import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductCard } from "../../../components/ProductCard";
import { ReviewCard } from "../../../components/ReviewCard";
import { Rating, StarRow } from "../../../components/Stars";
import { Card, IconButton, Pill, SectionLabel, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { seasonPill } from "../../../lib/farmerView";
import { cartCount, useStore } from "../../../lib/store";
import { colors, shadow } from "../../../lib/theme";

/** 人 → 農園（受取場所） → 商品 → レビュー。`?section=products` で 03 まで自動スクロール。 */
export default function FarmerDetailScreen() {
  const { id, section } = useLocalSearchParams<{ id: string; section?: string }>();
  const insets = useSafeAreaInsets();
  const farmerId = id as Id<"farmers">;
  const farmer = useQuery(api.farmers.get, { id: farmerId });
  const products = useQuery(api.products.byFarmer, { farmerId }) ?? [];
  const reviews = useQuery(api.reviews.byFarmer, { farmerId }) ?? [];
  const { addToCart, showToast } = useStore();
  const cartN = useStore((s) => cartCount(s.cart));

  const scroll = useRef<ScrollView>(null);
  const [productsY, setProductsY] = useState<number | null>(null);
  useEffect(() => {
    if (section === "products" && productsY !== null && products.length > 0) {
      const t = setTimeout(() => scroll.current?.scrollTo({ y: productsY - 40, animated: true }), 250);
      return () => clearTimeout(t);
    }
  }, [section, productsY, products.length]);

  if (!farmer) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }
  const season = seasonPill(farmer);
  const add = (p: (typeof products)[number]) => {
    const r = addToCart(farmer._id, farmer.name, p._id, 1);
    showToast(r === "replaced" ? `別の生産者の商品を入れ替えました: ${p.name}` : `${p.name} を予約カゴに追加しました`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView ref={scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ height: 320, backgroundColor: farmer.tint }}>
          <Image source={{ uri: farmer.avatar }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={300} />
          <View style={{ position: "absolute", top: insets.top + 8, left: 16 }}>
            <IconButton name="chevron-back" onPress={() => router.back()} />
          </View>
          <Pressable onPress={() => router.navigate("/consumer/cart")} accessibilityLabel={`カゴ ${cartN}`} style={[{ position: "absolute", top: insets.top + 8, right: 16, height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", gap: 6 }, shadow.pin]}>
            <Txt w={700} size={12}>カゴ</Txt>
            <View style={{ backgroundColor: colors.ink, borderRadius: 9, paddingHorizontal: 6, paddingVertical: 1 }}>
              <Txt mono w={500} size={11} color={colors.white}>{String(cartN)}</Txt>
            </View>
          </Pressable>
        </View>

        <View style={{ marginTop: -40, backgroundColor: colors.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 22, paddingHorizontal: 18, gap: 26 }}>
          {/* 01 · 人 */}
          <View style={{ gap: 12 }}>
            <SectionLabel rule>01 · 人</SectionLabel>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 10 }}>
              <View style={{ gap: 2 }}>
                <Txt size={11} color={colors.muted}>{farmer.kana}</Txt>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Txt w={700} size={24}>{farmer.name}</Txt>
                  {farmer.pr && <Pill label="PR" bg={colors.prBg} color={colors.prText} size={9.5} />}
                </View>
              </View>
              <Rating avg={farmer.ratingAvg} count={farmer.reviewCount} size={13} />
            </View>
            <Txt w={700} size={17} style={{ lineHeight: 27 }}>{farmer.catchphrase}</Txt>
            <Txt size={13} color={colors.inkSoft} style={{ lineHeight: 22 }}>{farmer.bio}</Txt>
            <View>
              {farmer.kodawari.map((k, i) => (
                <View key={k.title} style={{ flexDirection: "row", gap: 14, paddingVertical: 13, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
                  <Txt mono w={500} size={12} color={colors.green} style={{ width: 18 }}>{String(i + 1).padStart(2, "0")}</Txt>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Txt w={700} size={14}>{k.title}</Txt>
                    <Txt size={12} color="#66665F" style={{ lineHeight: 20 }}>{k.body}</Txt>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 02 · 農園 */}
          <View style={{ gap: 12 }}>
            <SectionLabel rule>02 · 農園と受取</SectionLabel>
            {farmer.farmPhotos.length > 0 && (
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -18 }} contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
                {farmer.farmPhotos.map((uri) => (
                  <Image key={uri} source={{ uri }} style={{ width: 320, aspectRatio: 16 / 9, borderRadius: 16, backgroundColor: colors.bgAlt }} contentFit="cover" transition={200} />
                ))}
              </ScrollView>
            )}
            <View style={{ gap: 2 }}>
              <Txt w={700} size={16}>{farmer.farmName}</Txt>
              <Txt size={12} color={colors.inkMid}>{farmer.prefecture}{farmer.city} · 就農{farmer.years}年</Txt>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Card style={{ flex: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 3 }}>
                <Txt size={10} color={colors.muted}>代表作物</Txt>
                <Txt w={700} size={14}>{farmer.crops.join("・")}</Txt>
              </Card>
              <Card style={{ flex: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 3 }}>
                <Txt size={10} color={colors.muted}>旬</Txt>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Txt w={700} size={14}>{farmer.season}</Txt>
                  <Pill label={season.label} bg={season.bg} color={season.color} size={9.5} />
                </View>
              </Card>
            </View>
            <Card style={{ padding: 14, gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="location-outline" size={14} color={colors.green} />
                <Txt w={700} size={13}>受取場所</Txt>
              </View>
              <Txt size={13} color={colors.inkSoft} style={{ lineHeight: 20 }}>{farmer.pickupAddress}</Txt>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="time-outline" size={13} color={colors.inkMid} />
                <Txt size={12} color={colors.inkSoft}>{farmer.pickupHours}</Txt>
              </View>
              {farmer.pickupNote && <Txt size={11.5} color={colors.muted} style={{ lineHeight: 18 }}>{farmer.pickupNote}</Txt>}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="cube-outline" size={13} color={colors.inkMid} />
                <Txt size={12} color={colors.inkSoft}>{farmer.deliveryAvailable ? "発送代行あり（対象商品のみ・送料 ¥880）" : "発送なし（受取のみ）"}</Txt>
              </View>
            </Card>
          </View>

          {/* 03 · 商品 */}
          <View style={{ gap: 10 }} onLayout={(e) => setProductsY(e.nativeEvent.layout.y + 280)}>
            <SectionLabel rule>03 · 商品</SectionLabel>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 2 }}>
              <Txt w={700} size={12}>予約できる商品</Txt>
              <Txt mono w={500} size={11} color={colors.muted}>{String(products.length)}</Txt>
            </View>
            <View style={{ gap: 10 }}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onPress={() => router.push(`/consumer/product/${p._id}`)} onAdd={() => add(p)} />
              ))}
            </View>
          </View>

          {/* 04 · レビュー */}
          <View style={{ gap: 10 }}>
            <SectionLabel rule>04 · レビュー</SectionLabel>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10 }}>
              <Txt mono w={500} size={30} style={{ lineHeight: 32 }}>{farmer.reviewCount ? farmer.ratingAvg.toFixed(1) : "–"}</Txt>
              <View style={{ gap: 2, paddingBottom: 4 }}>
                <StarRow value={Math.round(farmer.ratingAvg)} size={14} />
                <Txt size={11} color={colors.muted}>{farmer.reviewCount} 件のレビュー</Txt>
              </View>
            </View>
            <View>
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </View>
            <Txt size={11} color={colors.muted} style={{ lineHeight: 17 }}>レビューは受取完了後に、予約ページから投稿できます。</Txt>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
