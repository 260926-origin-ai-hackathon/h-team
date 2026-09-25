import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cartCount, useStore } from "../lib/store";
import { colors } from "../lib/theme";
import { Txt } from "./ui";

type Tab = "map" | "collection" | "cart";

const TABS: { key: Tab; label: string; icon: "map" | "albums" | "bag"; href: "/" | "/collection" | "/cart" }[] = [
  { key: "map", label: "地図", icon: "map", href: "/" },
  { key: "collection", label: "図鑑", icon: "albums", href: "/collection" },
  { key: "cart", label: "カート", icon: "bag", href: "/cart" },
];

export const TAB_BAR_HEIGHT = 84;

export function TabBar({ active }: { active: Tab }) {
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
      {TABS.map((t) => {
        const on = t.key === active;
        const color = on ? colors.ink : colors.muted;
        return (
          <Pressable
            key={t.key}
            onPress={() => {
              if (!on) router.navigate(t.href);
            }}
            style={{ flex: 1, alignItems: "center", gap: 6, paddingTop: 6 }}
          >
            <View>
              <Ionicons name={on ? t.icon : (`${t.icon}-outline` as const)} size={24} color={color} />
              {t.key === "cart" && count > 0 && (
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
