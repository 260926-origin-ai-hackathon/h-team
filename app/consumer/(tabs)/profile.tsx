import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Rating } from "../../../components/Stars";
import { Btn, Card, Field, ScreenTitle, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import { useStore } from "../../../lib/store";
import { colors } from "../../../lib/theme";

/** 買う側のプロフィール: 名前・連絡先・発送先・ひとこと。生産者からの評価も見える。 */
export default function ConsumerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userId, showToast } = useStore();
  const me = useQuery(api.users.get, userId ? { userId } : "skip");
  const update = useMutation(api.users.updateProfile);
  const reservations = useQuery(api.reservations.listMine, userId ? { userId } : "skip") ?? [];
  const [f, setF] = useState({ name: "", phone: "", address: "", bio: "" });
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  if (me && !loaded) {
    setF({ name: me.name, phone: me.phone, address: me.address, bio: me.bio });
    setLoaded(true);
  }
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const completed = reservations.filter((r) => r.status === "completed").length;

  const save = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await update({ userId, name: f.name.trim(), phone: f.phone.trim() || undefined, address: f.address.trim() || undefined, bio: f.bio.trim() || undefined });
      showToast("プロフィールを保存しました");
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "保存に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 40, gap: 14 }} keyboardShouldPersistTaps="handled">
        <ScreenTitle
          label="MY PAGE"
          title="マイページ"
          right={
            <Pressable onPress={() => router.replace("/")} accessibilityLabel="ロールを切り替え" style={{ paddingVertical: 6 }}>
              <Txt w={500} size={11} color={colors.muted}>切り替え</Txt>
            </Pressable>
          }
        />
        <Card style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.beigeAvatar, alignItems: "center", justifyContent: "center" }}>
            <Txt w={700} size={20}>{(me?.name ?? "ゲ").slice(0, 1)}</Txt>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Txt w={700} size={16}>{me?.name ?? "ゲスト"}</Txt>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Txt size={11} color={colors.muted}>生産者からの評価</Txt>
              <Rating avg={me?.ratingAvg ?? 0} count={me?.ratingCount ?? 0} size={12} />
            </View>
            <Txt size={11} color={colors.muted}>受取完了 {completed} 回</Txt>
          </View>
        </Card>

        <Card style={{ padding: 14, gap: 12 }}>
          <Field label="名前" value={f.name} onChangeText={set("name")} placeholder="田中 花" />
          <Field label="電話番号（受取時の連絡用）" value={f.phone} onChangeText={set("phone")} placeholder="090-1234-5678" keyboardType="numeric" />
          <Field label="発送先住所（発送を選んだときに使います）" value={f.address} onChangeText={set("address")} placeholder="大阪市北区…" />
          <Field label="ひとこと（生産者に見えます）" value={f.bio} onChangeText={set("bio")} multiline placeholder="野菜好き。週末に畑まで取りに行くのが楽しみです。" />
        </Card>
        <Btn label={busy ? "保存中…" : "保存する"} variant="green" height={48} disabled={busy} onPress={save} />
        <Txt size={11} color={colors.muted} style={{ lineHeight: 17 }}>生産者は受取完了後にあなたを評価できます。評価は他の生産者が予約を受けるときの参考になります。</Txt>
      </ScrollView>
    </View>
  );
}
