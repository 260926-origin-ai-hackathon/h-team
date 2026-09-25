import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BIG_CARD, BigFarmerCard } from "../../components/BigFarmerCard";
import { ProductCard } from "../../components/ProductCard";
import { Btn, Card, IconButton, SectionLabel, Txt } from "../../components/ui";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DEMO_USER_ID } from "../../lib/convex";
import { unlockText } from "../../lib/farmerView";
import { useStore } from "../../lib/store";
import { colors, pad3 } from "../../lib/theme";

/** Card detail: the stacked card with ownership count, then "また買う" / "買ってカードを解放". */
export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const farmerId = id as Id<"farmers">;
  const farmer = useQuery(api.farmers.get, { id: farmerId });
  const farmers = useQuery(api.farmers.list) ?? [];
  const products = useQuery(api.products.byFarmer, { farmerId }) ?? [];
  const collections = useQuery(api.collections.mine, { userId: DEMO_USER_ID }) ?? [];
  const count = collections.find((c) => c.farmerId === farmerId)?.purchaseCount ?? 0;
  const { addToCart, showToast } = useStore();

  if (!farmer) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bgAlt }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }
  const locked = count === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgAlt }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 18, paddingBottom: insets.bottom + 40, gap: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <IconButton name="close" iconSize={16} onPress={() => router.back()} />
          <Txt mono w={500} size={11} color={colors.muted}>
            No.{pad3(farmer.no)} / {pad3(farmers.length)}
          </Txt>
          <View style={{ width: 38 }} />
        </View>

        <View style={{ alignSelf: "center", width: BIG_CARD.width, height: BIG_CARD.height, marginTop: 6 }}>
          {count > 2 && <Backer rotate="5deg" x={10} y={4} />}
          {count > 1 && <Backer rotate="-4deg" x={-8} y={2} />}
          <BigFarmerCard farmer={farmer} count={count} />
        </View>

        <Txt w={500} size={12} color={colors.inkSoft} style={{ textAlign: "center", marginTop: 6 }}>
          {unlockText(count)}
        </Txt>

        {products.length > 0 && (
          <Card style={{ padding: 14, gap: 4 }}>
            <View style={{ marginBottom: 4 }}>
              <SectionLabel>{locked ? "買ってカードを解放" : "また買う"}</SectionLabel>
            </View>
            {products.map((p) => (
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
          </Card>
        )}

        <Btn label={`${farmer.name}さんの農園を見る`} variant="outline" height={48} onPress={() => router.push(`/farmer/${farmer._id}`)} />
      </ScrollView>
    </View>
  );
}

function Backer({ rotate, x, y }: { rotate: string; x: number; y: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 18,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: "#E6E6E2",
        transform: [{ rotate }, { translateX: x }, { translateY: y }],
      }}
    />
  );
}
