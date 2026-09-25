import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { api } from "../convex/_generated/api";
import { cartCount, useStore } from "../lib/store";
import { colors, shadow, yen } from "../lib/theme";
import { Txt } from "./ui";

/** Floating "カゴ N点 · ¥X → 予約へ" bar. Shown wherever a consumer can add products. */
export function FloatingCartBar({ bottom }: { bottom: number }) {
  const cart = useStore((s) => s.cart);
  const products = useQuery(api.products.byIds, { ids: cart?.items.map((c) => c.productId) ?? [] }) ?? [];
  if (!cart) return null;
  const count = cartCount(cart);
  const subtotal = cart.items.reduce((a, c) => a + (products.find((p) => p._id === c.productId)?.price ?? 0) * c.quantity, 0);
  return (
    <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutDown.duration(180)} style={{ position: "absolute", left: 14, right: 14, bottom }}>
      <Pressable
        onPress={() => router.navigate("/consumer/cart")}
        accessibilityRole="button"
        accessibilityLabel="カゴを見る"
        style={({ pressed }) => [{ height: 54, borderRadius: 16, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 10, gap: 10, opacity: pressed ? 0.9 : 1 }, shadow.float]}
      >
        <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.greenDeep, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 }}>
          <Txt mono w={500} size={11} color={colors.white}>{String(count)}</Txt>
        </View>
        <View style={{ flex: 1, gap: 1 }}>
          <Txt w={700} size={13} color={colors.white} numberOfLines={1}>{cart.farmerName}さんの商品</Txt>
          <Txt size={11} color="rgba(255,255,255,0.7)">{count}点 · {yen(subtotal)}</Txt>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.white, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Txt w={700} size={12}>予約へ</Txt>
          <Ionicons name="arrow-forward" size={13} color={colors.ink} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
