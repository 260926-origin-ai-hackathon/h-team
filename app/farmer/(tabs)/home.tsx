import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerAvatar } from "../../../components/FarmerAvatar";
import { ReservationCard } from "../../../components/ReservationCard";
import { Rating } from "../../../components/Stars";
import { Btn, Card, Field, Pill, ScreenTitle, SectionLabel, ToggleRow, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import { useStore } from "../../../lib/store";
import { colors } from "../../../lib/theme";
import { useMyFarmer } from "../../../lib/useMyFarmer";

const STATUS = {
  pending: { label: "承認待ち", bg: colors.amberBg, color: colors.amberText, text: "運営が確認中です。承認されると地図に表示されます。" },
  approved: { label: "公開中", bg: colors.greenBg, color: colors.greenText, text: "地図に表示されています。" },
  rejected: { label: "却下", bg: colors.fewBg, color: colors.fewText, text: "プロフィールを見直して再申請してください。" },
} as const;

export default function FarmerHomeScreen() {
  const insets = useSafeAreaInsets();
  const farmer = useMyFarmer();
  const setPr = useMutation(api.farmers.setPr);
  const showToast = useStore((s) => s.showToast);
  const reservations = useQuery(api.reservations.listForFarmer, farmer ? { farmerId: farmer._id } : "skip") ?? [];
  const requested = reservations.filter((r) => r.status === "requested");
  const [prMessage, setPrMessage] = useState<string | null>(null);
  const [savingPr, setSavingPr] = useState(false);
  const today = reservations.filter((r) => r.status === "confirmed" && r.pickupAt && new Date(r.pickupAt).toDateString() === new Date().toDateString());

  const header = (
    <ScreenTitle
      label="FARMER"
      title={farmer ? farmer.farmName : "生産者"}
      right={
        <Pressable onPress={() => router.replace("/")} accessibilityLabel="ロールを切り替え" style={{ paddingVertical: 6 }}>
          <Txt w={500} size={11} color={colors.muted}>切り替え</Txt>
        </Pressable>
      }
    />
  );

  if (farmer === undefined) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}><ActivityIndicator color={colors.ink} /></View>;

  if (farmer === null) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 40, gap: 16 }}>
          {header}
          <Card style={{ padding: 20, gap: 12, alignItems: "center" }}>
            <Ionicons name="leaf-outline" size={28} color={colors.green} />
            <Txt w={700} size={16}>まずはプロフィールを作成</Txt>
            <Txt size={12} color={colors.inkSoft} style={{ textAlign: "center", lineHeight: 19 }}>
              顔写真・こだわり・受取場所を登録すると運営の承認に進みます。承認後に地図へ掲載されます。
            </Txt>
            <Btn label="プロフィールを作成" variant="green" height={46} style={{ alignSelf: "stretch" }} onPress={() => router.navigate("/farmer/profile")} />
          </Card>
        </ScrollView>
      </View>
    );
  }

  const st = STATUS[farmer.status];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 40, gap: 16 }}>
        {header}
        <Card style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <FarmerAvatar uri={farmer.avatar} size={48} tint={farmer.tint} borderWidth={2} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Txt w={700} size={15}>{farmer.name}</Txt>
              <Pill label={st.label} bg={st.bg} color={st.color} weight={700} />
            </View>
            <Txt size={11} color={colors.muted}>{st.text}</Txt>
          </View>
        </Card>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Stat label="未対応リクエスト" value={String(requested.length)} accent={requested.length > 0} />
          <Stat label="今日の受取" value={String(today.length)} />
          <Card style={{ flex: 1, padding: 12, gap: 4 }}>
            <Txt size={10} color={colors.muted}>評価</Txt>
            <Rating avg={farmer.ratingAvg} count={farmer.reviewCount} size={14} />
          </Card>
        </View>

        <Card style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
          <ToggleRow
            label="優先表示（PR）"
            hint="地図で大きく・一覧の先頭に表示されます"
            value={farmer.pr}
            onChange={(v) => setPr({ id: farmer._id, pr: v, prMessage: prMessage ?? farmer.prMessage }).then(() => showToast(v ? "優先表示をオンにしました" : "優先表示をオフにしました"))}
          />
          <View style={{ gap: 8, paddingBottom: 12 }}>
            <Field
              label="PR 文言（生産者ページとシートに表示・地図ピンには出ません）"
              value={prMessage ?? farmer.prMessage ?? ""}
              onChangeText={setPrMessage}
              multiline
              placeholder="今週末は朝採りを多めに用意します。駐車場あり。"
            />
            {prMessage !== null && prMessage !== (farmer.prMessage ?? "") && (
              <Btn
                label={savingPr ? "保存中…" : "PR 文言を保存"}
                height={40}
                disabled={savingPr}
                onPress={async () => {
                  setSavingPr(true);
                  try {
                    await setPr({ id: farmer._id, pr: farmer.pr, prMessage });
                    showToast("PR 文言を保存しました");
                    setPrMessage(null);
                  } finally {
                    setSavingPr(false);
                  }
                }}
              />
            )}
          </View>
        </Card>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <SectionLabel>新しいリクエスト</SectionLabel>
          <Pressable onPress={() => router.navigate("/farmer/reservations")} accessibilityLabel="すべての予約"><Txt w={500} size={11} color={colors.green}>すべて見る</Txt></Pressable>
        </View>
        {requested.length === 0 && <Txt size={12} color={colors.muted}>未対応のリクエストはありません。</Txt>}
        {requested.slice(0, 3).map((r) => (
          <ReservationCard key={r._id} reservation={r} perspective="farmer" onPress={() => router.push(`/farmer/reservation/${r._id}`)} />
        ))}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card style={{ flex: 1, padding: 12, gap: 4 }}>
      <Txt size={10} color={colors.muted}>{label}</Txt>
      <Txt mono w={500} size={22} color={accent ? colors.amberText : colors.ink} style={{ lineHeight: 26 }}>{value}</Txt>
    </Card>
  );
}
