import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Btn, Card, Field, IconButton, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useStore } from "../../../lib/store";
import { colors, yen } from "../../../lib/theme";

/** モック決済。カード情報はどこにも送らず、支払い済みにするだけ。 */
export default function PayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const r = useQuery(api.reservations.get, { id: id as Id<"reservations"> });
  const pay = useMutation(api.reservations.pay);
  const { userId, showToast } = useStore();
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/29");
  const [cvc, setCvc] = useState("123");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!r || busy) return;
    setBusy(true);
    try {
      await pay({ id: r._id, userId });
      showToast("お支払いが完了しました");
      router.back();
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "支払いに失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: 18, paddingHorizontal: 18, paddingBottom: insets.bottom + 30, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <IconButton name="close" iconSize={16} onPress={() => router.back()} />
          <Txt w={700} size={20}>お支払い</Txt>
          <View style={{ flex: 1 }} />
          <View style={{ backgroundColor: colors.amberBg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Txt w={700} size={10} color={colors.amberText}>テスト決済</Txt>
          </View>
        </View>
        {r && (
          <Card style={{ padding: 14, gap: 8 }}>
            <Txt size={11} color={colors.muted}>{r.farmer?.name} · {r.items.map((i) => `${i.name} ×${i.quantity}`).join("、")}</Txt>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              <Txt w={700} size={13}>お支払い金額{r.shipping ? "（送料込み）" : ""}</Txt>
              <Txt mono w={500} size={24}>{yen(r.total)}</Txt>
            </View>
          </Card>
        )}
        <Card style={{ padding: 14, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="card-outline" size={16} color={colors.ink} />
            <Txt w={700} size={13}>クレジットカード</Txt>
          </View>
          <Field label="カード番号" value={card} onChangeText={setCard} keyboardType="numeric" />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="有効期限" value={exp} onChangeText={setExp} /></View>
            <View style={{ flex: 1 }}><Field label="セキュリティコード" value={cvc} onChangeText={setCvc} keyboardType="numeric" /></View>
          </View>
          <Txt size={11} color={colors.muted}>ハッカソン用のモック決済です。入力内容は送信されません。</Txt>
        </Card>
        <Btn label={busy ? "処理中…" : r ? `${yen(r.total)} を支払う` : "支払う"} variant="green" height={52} disabled={busy || !r} onPress={submit} />
      </ScrollView>
    </View>
  );
}
