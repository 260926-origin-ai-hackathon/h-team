import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerAvatar } from "../components/FarmerAvatar";
import { Rating } from "../components/Stars";
import { Btn, Card, IconButton, Pill, ScreenTitle, Txt } from "../components/ui";
import { api } from "../convex/_generated/api";
import { useStore } from "../lib/store";
import { colors } from "../lib/theme";

const STATUS = {
  pending: { label: "承認待ち", bg: colors.amberBg, color: colors.amberText },
  approved: { label: "承認済み", bg: colors.greenBg, color: colors.greenText },
  rejected: { label: "却下", bg: colors.fewBg, color: colors.fewText },
} as const;

/** 運営（デモ）: 生産者の承認。承認された生産者だけが地図に出る。 */
export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const farmers = useQuery(api.farmers.adminList) ?? [];
  const setStatus = useMutation(api.farmers.adminSetStatus);
  const showToast = useStore((s) => s.showToast);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 10, paddingHorizontal: 18, paddingBottom: insets.bottom + 30, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <IconButton name="chevron-back" onPress={() => router.replace("/")} />
          <ScreenTitle label="ADMIN" title="生産者の承認" />
        </View>
        {farmers.map((f) => (
          <Card key={f._id} style={{ padding: 14, gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <FarmerAvatar uri={f.avatar} size={40} tint={f.tint} borderWidth={2} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt w={700} size={14}>{f.name} <Txt size={11} color={colors.muted}>{f.farmName}</Txt></Txt>
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  <Txt size={11} color={colors.muted}>{f.prefecture}{f.city} · {f.crops.join("・")}</Txt>
                  <Rating avg={f.ratingAvg} count={f.reviewCount} size={11} />
                </View>
              </View>
              <Pill {...STATUS[f.status]} weight={700} />
            </View>
            {f.status !== "approved" && (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Btn label="承認する" variant="green" height={40} style={{ flex: 1 }} onPress={() => setStatus({ id: f._id, status: "approved" }).then(() => showToast(`${f.name} を承認しました`))} />
                {f.status === "pending" && <Btn label="却下" variant="outline" height={40} style={{ flex: 0.6 }} onPress={() => setStatus({ id: f._id, status: "rejected" })} />}
              </View>
            )}
            {f.status === "approved" && (
              <Btn label="承認を取り消す" variant="outline" height={38} onPress={() => setStatus({ id: f._id, status: "pending" })} />
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
