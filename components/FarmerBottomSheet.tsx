import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../convex/_generated/api";
import { featuredProducts } from "../lib/farmerView";
import { useStore } from "../lib/store";
import { colors } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { FarmerAvatar } from "./FarmerAvatar";
import { ProductCard } from "./ProductCard";
import { Rating } from "./Stars";
import { Btn, IconButton, Pill, SectionLabel, Txt } from "./ui";

/** Detached sheet for the selected farmer: who they are, rating, こだわり, what's buyable now. */
export function FarmerBottomSheet({ farmer }: { farmer: Farmer | null }) {
  const ref = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [shown, setShown] = useState<Farmer | null>(farmer);
  if (farmer && farmer !== shown) setShown(farmer);

  const { selectFarmer, addToCart, showToast } = useStore();
  const products = useQuery(api.products.byFarmer, shown ? { farmerId: shown._id } : "skip") ?? [];

  useEffect(() => {
    if (farmer) ref.current?.expand();
    else ref.current?.close();
  }, [farmer]);

  const add = (p: (typeof products)[number]) => {
    if (!shown) return;
    const r = addToCart(shown._id, shown.name, p._id, 1);
    showToast(r === "replaced" ? `別の生産者の商品を入れ替えました: ${p.name}` : `${p.name} を予約カゴに追加しました`);
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      detached
      bottomInset={insets.bottom + 92}
      enablePanDownToClose
      onClose={() => selectFarmer(null)}
      handleComponent={null}
      accessible={false}
      accessibilityLabel={null}
      style={{ marginHorizontal: 10 }}
      backgroundStyle={{ borderRadius: 24, backgroundColor: colors.white }}
    >
      <BottomSheetView style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14, gap: 12 }}>
        {shown && (
          <>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
              <FarmerAvatar uri={shown.avatar} size={54} tint={shown.tint} pr={shown.pr} />
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <Txt w={700} size={17} numberOfLines={1}>{shown.name}</Txt>
                  {shown.pr && <Pill label="PR" bg={colors.prBg} color={colors.prText} size={9} />}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Rating avg={shown.ratingAvg} count={shown.reviewCount} />
                  <Txt size={11} color={colors.muted} numberOfLines={1}>{shown.farmName} · {shown.city}</Txt>
                </View>
              </View>
              <View style={{ alignSelf: "flex-start" }}>
                <IconButton name="close" size={28} iconSize={14} bg={colors.bgAlt} color={colors.inkMid} flat onPress={() => selectFarmer(null)} />
              </View>
            </View>

            <Txt w={500} size={13} color="#33332F" style={{ lineHeight: 21 }}>{shown.catchphrase}</Txt>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {shown.kodawari.map((k) => (
                <View key={k.title} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.bgSoft }}>
                  <Ionicons name="leaf-outline" size={10} color={colors.green} />
                  <Txt w={500} size={10.5} color={colors.inkSoft}>{k.title}</Txt>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.lineSoft }}>
              <Ionicons name="location-outline" size={13} color={colors.inkMid} />
              <Txt w={500} size={11} color="#44443F" style={{ flex: 1 }} numberOfLines={1}>
                受取 {shown.pickupHours}{shown.deliveryAvailable ? " · 発送代行あり" : ""}
              </Txt>
            </View>

            {products.length > 0 && (
              <View style={{ gap: 2 }}>
                <View style={{ marginBottom: 4 }}>
                  <SectionLabel>今予約できる</SectionLabel>
                </View>
                {featuredProducts(products).map((p) => (
                  <ProductCard key={p._id} product={p} size="sm" onPress={() => router.push(`/consumer/product/${p._id}`)} onAdd={() => add(p)} />
                ))}
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Btn label="生産者を見る" variant="outline" style={{ flex: 1 }} onPress={() => router.push(`/consumer/farmer/${shown._id}`)} />
              <Btn
                label="商品を予約"
                count={shown.productCount}
                style={{ flex: 1.2 }}
                onPress={() => router.push({ pathname: "/consumer/farmer/[id]", params: { id: shown._id, section: "products" } })}
              />
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}
