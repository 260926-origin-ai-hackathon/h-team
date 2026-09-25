import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductCard } from "../../components/ProductCard";
import { Card, IconButton, Pill, SectionLabel, Txt } from "../../components/ui";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DEMO_USER_ID } from "../../lib/convex";
import { seasonPill, statusPill, unlockText } from "../../lib/farmerView";
import { cartCount, useStore } from "../../lib/store";
import { colors, pad3, shadow } from "../../lib/theme";

/** 人 → 農園 → 商品 の順に見せる。`?section=products` で 03 まで自動スクロール。 */
export default function FarmerDetailScreen() {
  const { id, section } = useLocalSearchParams<{ id: string; section?: string }>();
  const insets = useSafeAreaInsets();
  const farmerId = id as Id<"farmers">;
  const farmer = useQuery(api.farmers.get, { id: farmerId });
  const products = useQuery(api.products.byFarmer, { farmerId }) ?? [];
  const collections = useQuery(api.collections.mine, { userId: DEMO_USER_ID }) ?? [];
  const count = collections.find((c) => c.farmerId === farmerId)?.purchaseCount ?? 0;
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

  const owned = count > 0;
  const status = statusPill(count);
  const season = seasonPill(farmer);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView ref={scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ height: 320, backgroundColor: farmer.tint }}>
          <Image
            source={{ uri: farmer.avatar }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            blurRadius={owned ? 0 : 22}
            transition={300}
          />
          {!owned && <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(239,239,235,0.5)" }} />}
          <View style={{ position: "absolute", top: insets.top + 8, left: 16 }}>
            <IconButton name="chevron-back" onPress={() => router.back()} />
          </View>
          <Pressable
            onPress={() => router.navigate("/cart")}
            style={[
              { position: "absolute", top: insets.top + 8, right: 16, height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", gap: 6 },
              shadow.pin,
            ]}
          >
            <Txt w={700} size={12}>カート</Txt>
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
                <Txt w={700} size={24}>{farmer.name}</Txt>
              </View>
              <Pill label={status.label} bg={status.bg} color={status.color} border={status.border} dashed={status.dashed} size={11} />
            </View>
            <Txt w={700} size={17} style={{ lineHeight: 27 }}>{farmer.catchphrase}</Txt>
            <Txt size={13} color={colors.inkSoft} style={{ lineHeight: 22 }}>{farmer.bio}</Txt>
            <Pressable onPress={() => router.push(`/card/${farmer._id}`)}>
              <Card
                style={{
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: owned ? colors.line : "#CFCFC9",
                  borderStyle: owned ? "solid" : "dashed",
                }}
              >
                <View style={{ width: 44, height: (44 * 88) / 63, borderRadius: 6, overflow: "hidden", backgroundColor: owned ? farmer.tint : colors.lockedBg }}>
                  <Image source={{ uri: farmer.avatar }} style={{ width: "100%", height: "100%" }} contentFit="cover" blurRadius={owned ? 0 : 10} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Txt w={700} size={13}>
                    {owned ? `カード No.${pad3(farmer.no)} ×${count}` : `カード No.${pad3(farmer.no)}（未解放）`}
                  </Txt>
                  <Txt size={11} color={colors.inkMid}>{unlockText(count)}</Txt>
                </View>
                <Txt size={18} color={colors.mutedLight}>›</Txt>
              </Card>
            </Pressable>
          </View>

          {/* 02 · 農園 */}
          <View style={{ gap: 12 }}>
            <SectionLabel rule>02 · 農園</SectionLabel>
            {farmer.farmPhotos.length > 0 && (
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -18 }} contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
                {farmer.farmPhotos.map((uri) => (
                  <Image key={uri} source={{ uri }} style={{ width: 320, aspectRatio: 16 / 9, borderRadius: 16, backgroundColor: colors.bgAlt }} contentFit="cover" transition={200} />
                ))}
              </ScrollView>
            )}
            <View style={{ gap: 2 }}>
              <Txt w={700} size={16}>{farmer.farmName}</Txt>
              <Txt size={12} color={colors.inkMid}>
                {farmer.prefecture}{farmer.city} · 就農{farmer.years}年
              </Txt>
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

          {/* 03 · 商品 */}
          <View style={{ gap: 10 }} onLayout={(e) => setProductsY(e.nativeEvent.layout.y + 280)}>
            <SectionLabel rule>03 · 商品</SectionLabel>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 2 }}>
              <Txt w={700} size={12}>販売中</Txt>
              <Txt mono w={500} size={11} color={colors.muted}>{String(products.length)}</Txt>
            </View>
            <View style={{ gap: 10 }}>
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onPress={() => router.push(`/product/${p._id}`)}
                  onAdd={() => {
                    addToCart({ productId: p._id, farmerId: p.farmerId, quantity: 1 });
                    showToast(`${p.name} をカートに追加しました`);
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
