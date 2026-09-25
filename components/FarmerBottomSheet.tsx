import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../convex/_generated/api";
import { featuredProducts, statusPill, unlockText } from "../lib/farmerView";
import { useStore } from "../lib/store";
import { colors, pad3 } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { FarmerAvatar } from "./FarmerAvatar";
import { ProductCard } from "./ProductCard";
import { Btn, IconButton, Pill, SectionLabel, Txt } from "./ui";

/**
 * Detached sheet shown when a marker is selected. Reads the selected farmer
 * from the store; `farmer` is the resolved doc (null closes the sheet).
 */
export function FarmerBottomSheet({ farmer, count }: { farmer: Farmer | null; count: number }) {
  const ref = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  // Keep the last farmer while the sheet animates closed.
  const [shown, setShown] = useState<Farmer | null>(farmer);
  if (farmer && farmer !== shown) setShown(farmer);

  const { selectFarmer, addToCart, showToast } = useStore();
  const products = useQuery(api.products.byFarmer, shown ? { farmerId: shown._id } : "skip") ?? [];

  useEffect(() => {
    if (farmer) ref.current?.expand();
    else ref.current?.close();
  }, [farmer]);

  const status = statusPill(count);
  const owned = count > 0;

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
              <FarmerAvatar uri={shown.avatar} size={54} owned={owned} tint={shown.tint} />
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <Txt w={700} size={17} numberOfLines={1}>
                    {shown.name}
                  </Txt>
                  <Pill label={status.label} bg={status.bg} color={status.color} border={status.border} dashed={status.dashed} />
                </View>
                <Txt size={11} color={colors.muted} numberOfLines={1}>
                  {shown.farmName} · {shown.city}
                </Txt>
              </View>
              <View style={{ alignSelf: "flex-start" }}>
                <IconButton name="close" size={28} iconSize={14} bg={colors.bgAlt} color={colors.inkMid} flat onPress={() => selectFarmer(null)} />
              </View>
            </View>

            <Txt w={500} size={13} color="#33332F" style={{ lineHeight: 21 }}>
              {shown.catchphrase}
            </Txt>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 12,
                paddingVertical: 9,
                borderRadius: 12,
                backgroundColor: owned ? colors.greenTint : colors.bg,
                borderWidth: 1,
                borderColor: owned ? colors.greenLine : "#D4D4CE",
                borderStyle: owned ? "solid" : "dashed",
              }}
            >
              <View style={{ backgroundColor: colors.white, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                <Txt mono w={500} size={9.5} color={colors.inkSoft}>
                  No.{pad3(shown.no)}
                </Txt>
              </View>
              <Txt w={500} size={11} color="#44443F" style={{ flex: 1 }}>
                {unlockText(count)}
              </Txt>
            </View>

            {products.length > 0 && (
              <View style={{ gap: 2 }}>
                <View style={{ marginBottom: 4 }}>
                  <SectionLabel>今買える</SectionLabel>
                </View>
                {featuredProducts(products).map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    size="sm"
                    onPress={() => router.push(`/product/${p._id}`)}
                    onAdd={() => {
                      addToCart({ productId: p._id, farmerId: p.farmerId, quantity: 1 });
                      showToast(`${p.name} をカートに追加しました`);
                    }}
                  />
                ))}
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Btn label="プロフィールを見る" variant="outline" style={{ flex: 1 }} onPress={() => router.push(`/farmer/${shown._id}`)} />
              <Btn
                label="商品を見る"
                count={shown.productCount}
                style={{ flex: 1.2 }}
                onPress={() => router.push({ pathname: "/farmer/[id]", params: { id: shown._id, section: "products" } })}
              />
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}
