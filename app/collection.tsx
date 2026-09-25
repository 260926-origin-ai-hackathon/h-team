import { useQuery } from "convex/react";
import { router } from "expo-router";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerCard } from "../components/FarmerCard";
import { TabBar } from "../components/TabBar";
import { Card, SectionLabel, Txt } from "../components/ui";
import { api } from "../convex/_generated/api";
import { DEMO_USER_ID } from "../lib/convex";
import { colors } from "../lib/theme";

export default function CollectionScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const farmers = useQuery(api.farmers.list) ?? [];
  const collections = useQuery(api.collections.mine, { userId: DEMO_USER_ID }) ?? [];
  const countOf = (id: string) => collections.find((c) => c.farmerId === id)?.purchaseCount ?? 0;

  const ownedCount = farmers.filter((f) => countOf(f._id) > 0).length;
  const cardTotal = collections.reduce((a, c) => a + c.purchaseCount, 0);
  const total = farmers.length;
  const cardWidth = (width - 36 - 12) / 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 120, gap: 18 }}>
        <View style={{ gap: 6 }}>
          <SectionLabel>COLLECTION · OSAKA</SectionLabel>
          <Txt w={700} size={24}>生産者図鑑</Txt>
        </View>

        <Card style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 18 }}>
            <View style={{ gap: 2 }}>
              <Txt size={10} color={colors.muted}>出会った生産者</Txt>
              <Txt mono w={500} size={30} style={{ lineHeight: 32 }}>
                {ownedCount}
                <Txt mono size={15} color={colors.mutedLight}> / {total}</Txt>
              </Txt>
            </View>
            <View style={{ gap: 2 }}>
              <Txt size={10} color={colors.muted}>集めたカード</Txt>
              <Txt mono w={500} size={30} style={{ lineHeight: 32 }}>
                {cardTotal}
                <Txt size={12} color={colors.mutedLight}>枚</Txt>
              </Txt>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 3 }}>
            {farmers.map((f) => (
              <View key={f._id} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: countOf(f._id) > 0 ? colors.green : "#E9E9E5" }} />
            ))}
          </View>
          <Txt size={11} color={colors.inkMid}>
            {total - ownedCount > 0
              ? `あと${total - ownedCount}人で大阪コンプリート。未解放の生産者からもすぐ購入できます。`
              : "大阪の生産者をコンプリートしました。"}
          </Txt>
        </Card>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, rowGap: 14 }}>
          {farmers.map((f) => (
            <FarmerCard key={f._id} farmer={f} count={countOf(f._id)} width={cardWidth} onPress={() => router.push(`/card/${f._id}`)} />
          ))}
        </View>
      </ScrollView>
      <TabBar active="collection" />
    </View>
  );
}
