import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "../../../components/ProductCard";
import { Btn, Card, ScreenTitle, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import { fmtExpected, productBadges } from "../../../lib/farmerView";
import { colors, yen } from "../../../lib/theme";
import { useMyFarmer } from "../../../lib/useMyFarmer";

export default function FarmerProductsScreen() {
  const insets = useSafeAreaInsets();
  const farmer = useMyFarmer();
  const products = useQuery(api.products.mine, farmer ? { farmerId: farmer._id } : "skip") ?? [];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 40, gap: 12 }}>
        <ScreenTitle label="PRODUCTS" title="商品" />
        {farmer === null ? (
          <Txt size={12} color={colors.muted}>先にプロフィールを作成してください。</Txt>
        ) : (
          <Btn label="＋ 商品を追加" variant="outline" height={44} onPress={() => router.push("/farmer/product/new")} />
        )}
        {products.map((p) => (
          <Pressable key={p._id} onPress={() => router.push(`/farmer/product/${p._id}`)} accessibilityLabel={`商品 ${p.name}`}>
            <Card style={{ padding: 10, flexDirection: "row", alignItems: "center", gap: 12, opacity: p.available ? 1 : 0.55 }}>
              <Image source={{ uri: p.image }} style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.bgAlt }} contentFit="cover" />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
                  {!p.available && p.expectedAt && <Badge label={fmtExpected(p.expectedAt)} bg={colors.amberBg} color={colors.amberText} />}
                  {!p.available && !p.expectedAt && <Badge label="非公開" bg={colors.chip} color={colors.muted} />}
                  {productBadges(p).map((b) => <Badge key={b.label} {...b} />)}
                </View>
                <Txt w={700} size={14}>{p.name}</Txt>
                <Txt size={11} color={colors.muted}><Txt mono w={500} size={12} color={colors.ink}>{yen(p.price)}</Txt> · {p.unit} · 在庫 {p.stock}{p.watcherCount > 0 ? ` · ${p.watcherCount}人がウォッチ` : ""}</Txt>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
