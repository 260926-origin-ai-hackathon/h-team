import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FarmerAvatar } from "../../../components/FarmerAvatar";
import { StarRow } from "../../../components/Stars";
import { Btn, Card, Field, IconButton, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useStore } from "../../../lib/store";
import { colors } from "../../../lib/theme";

const LABELS = ["", "残念", "いまいち", "ふつう", "良かった", "最高"];

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const r = useQuery(api.reservations.get, { id: id as Id<"reservations"> });
  const create = useMutation(api.reviews.create);
  const { userId, showToast } = useStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!r || busy) return;
    setBusy(true);
    try {
      await create({ reservationId: r._id, userId, rating, comment });
      showToast("レビューを投稿しました");
      router.back();
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "投稿に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 18, paddingBottom: insets.bottom + 40, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <IconButton name="chevron-back" onPress={() => router.back()} />
          <Txt w={700} size={20}>レビューを書く</Txt>
        </View>
        {r?.farmer && (
          <Card style={{ padding: 16, alignItems: "center", gap: 10 }}>
            <FarmerAvatar uri={r.farmer.avatar} size={64} tint={r.farmer.tint} />
            <Txt w={700} size={15}>{r.farmer.name}さんはどうでしたか？</Txt>
            <Txt size={11} color={colors.muted}>{r.items.map((i) => i.name).join("、")}</Txt>
            <StarRow value={rating} onChange={setRating} size={32} />
            <Txt w={500} size={12} color={colors.inkSoft}>{LABELS[rating] || "星をタップして評価"}</Txt>
          </Card>
        )}
        <Field label="コメント" value={comment} onChangeText={setComment} multiline placeholder="受取のスムーズさ、味、生産者とのやりとりなど" />
        <Btn label={busy ? "送信中…" : "投稿する"} variant="green" height={50} disabled={busy || rating === 0} onPress={submit} />
        <Txt size={11} color={colors.muted} style={{ lineHeight: 17 }}>レビューは生産者ページに公開されます。生産者もあなたを評価でき、他の生産者が参照します。</Txt>
      </ScrollView>
    </View>
  );
}
