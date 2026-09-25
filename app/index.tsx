import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SectionLabel, Txt } from "../components/ui";
import { DEMO_USERS } from "../lib/convex";
import { useStore, type Role } from "../lib/store";
import { colors, shadow } from "../lib/theme";

type Choice = { role: Role; userId: string; title: string; sub: string; icon: ComponentProps<typeof Ionicons>["name"]; href: string; tint: string };

const CHOICES: Choice[] = [
  { role: "consumer", userId: DEMO_USERS.consumer.userId, title: "消費者として使う", sub: `地図から生産者を探して予約 · ${DEMO_USERS.consumer.label}`, icon: "map-outline", href: "/consumer/map", tint: colors.greenBg },
  { role: "farmer", userId: DEMO_USERS.farmer.userId, title: "生産者として使う", sub: `予約・商品・レビューを管理 · ${DEMO_USERS.farmer.label}`, icon: "leaf-outline", href: "/farmer/home", tint: colors.amberBg },
  { role: "farmer", userId: DEMO_USERS.newFarmer.userId, title: "生産者として新規登録", sub: "プロフィールを作成して承認を待つ", icon: "person-add-outline", href: "/farmer/home", tint: colors.beigeAvatar },
];

/** Launch screen: pick which side of the marketplace to use. */
export default function RoleSelectScreen() {
  const insets = useSafeAreaInsets();
  const setIdentity = useStore((s) => s.setIdentity);
  // 運営（承認）画面は一般テスターに見せない: タイトル長押しで表示
  const [showAdmin, setShowAdmin] = useState(false);
  const go = (c: Choice) => {
    setIdentity(c.role, c.userId);
    router.replace(c.href as never);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 32, paddingHorizontal: 22, paddingBottom: insets.bottom + 24, gap: 18 }}>
      <View style={{ gap: 6 }}>
        <SectionLabel>HATAKE MAP · OSAKA</SectionLabel>
        <Pressable onLongPress={() => setShowAdmin(true)} delayLongPress={1500} accessibilityLabel="はたけマップ">
          <Txt w={700} size={28}>はたけマップ</Txt>
        </Pressable>
        <Txt size={13} color={colors.inkSoft} style={{ lineHeight: 21 }}>
          地図で生産者を知って、畑に取りに行く。どちらで使いますか？
        </Txt>
      </View>
      <View style={{ gap: 12 }}>
        {CHOICES.map((c) => (
          <Pressable key={c.userId} onPress={() => go(c)} accessibilityRole="button" accessibilityLabel={c.title} style={({ pressed }) => [{ backgroundColor: colors.white, borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, opacity: pressed ? 0.9 : 1 }, shadow.card]}>
            <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: c.tint, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={c.icon} size={22} color={colors.ink} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Txt w={700} size={15}>{c.title}</Txt>
              <Txt size={11} color={colors.muted}>{c.sub}</Txt>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      {showAdmin && (
        <Pressable
          onPress={() => {
            setIdentity("admin", DEMO_USERS.admin.userId);
            router.replace("/admin" as never);
          }}
          accessibilityLabel="運営として承認する"
          style={{ alignSelf: "center", paddingVertical: 10, paddingHorizontal: 16 }}
        >
          <Txt w={500} size={12} color={colors.muted}>運営（デモ）: 生産者の承認画面へ</Txt>
        </Pressable>
      )}
    </View>
  );
}
