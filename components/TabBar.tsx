import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cartCount, useStore } from "../lib/store";
import { colors } from "../lib/theme";
import { Txt } from "./ui";

type IconName = "map" | "calendar" | "bag" | "home" | "leaf" | "person" | "star";
type Tab = { key: string; label: string; icon: IconName; href: string; badge?: boolean };

export const CONSUMER_TABS: Tab[] = [
  { key: "map", label: "地図", icon: "map", href: "/consumer/map" },
  { key: "reservations", label: "予約", icon: "calendar", href: "/consumer/reservations" },
  { key: "cart", label: "カゴ", icon: "bag", href: "/consumer/cart", badge: true },
];

export const FARMER_TABS: Tab[] = [
  { key: "home", label: "ホーム", icon: "home", href: "/farmer/home" },
  { key: "reservations", label: "予約", icon: "calendar", href: "/farmer/reservations" },
  { key: "products", label: "商品", icon: "leaf", href: "/farmer/products" },
  { key: "reviews", label: "レビュー", icon: "star", href: "/farmer/reviews" },
  { key: "profile", label: "プロフィール", icon: "person", href: "/farmer/profile" },
];

export const TAB_BAR_HEIGHT = 84;

export function TabBar({ active, tabs = CONSUMER_TABS }: { active: string; tabs?: Tab[] }) {
  const insets = useSafeAreaInsets();
  const count = useStore((s) => cartCount(s.cart));
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: TAB_BAR_HEIGHT + Math.max(insets.bottom - 20, 0),
        backgroundColor: "rgba(255,255,255,0.96)",
        borderTopWidth: 1,
        borderTopColor: "#EFEFEB",
        flexDirection: "row",
        paddingTop: 8,
        paddingHorizontal: 20,
      }}
    >
      {tabs.map((t) => {
        const on = t.key === active;
        const color = on ? colors.ink : colors.muted;
        return (
          <Pressable
            key={t.key}
            onPress={() => {
              if (!on) router.navigate(t.href as never);
            }}
            accessibilityRole="tab"
            accessibilityLabel={t.label}
            accessibilityState={{ selected: on }}
            style={{ flex: 1, alignItems: "center", gap: 6, paddingTop: 6 }}
          >
            <View>
              <Ionicons name={on ? t.icon : (`${t.icon}-outline` as const)} size={24} color={color} />
              {t.badge && count > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -7,
                    right: -10,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: colors.greenDeep,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Txt mono w={500} size={10} color={colors.white} style={{ lineHeight: 16 }}>
                    {String(count)}
                  </Txt>
                </View>
              )}
            </View>
            <Txt w={500} size={11} color={color}>
              {t.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
