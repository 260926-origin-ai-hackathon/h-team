import { useQuery } from "convex/react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReviewCard } from "../../../components/ReviewCard";
import { StarRow } from "../../../components/Stars";
import { Card, ScreenTitle, Txt } from "../../../components/ui";
import { api } from "../../../convex/_generated/api";
import { colors } from "../../../lib/theme";
import { useMyFarmer } from "../../../lib/useMyFarmer";

export default function FarmerReviewsScreen() {
  const insets = useSafeAreaInsets();
  const farmer = useMyFarmer();
  const reviews = useQuery(api.reviews.byFarmer, farmer ? { farmerId: farmer._id } : "skip") ?? [];
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 40, gap: 14 }}>
        <ScreenTitle label="REVIEWS" title="レビュー" />
        {farmer && (
          <Card style={{ padding: 16, gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 12 }}>
              <Txt mono w={500} size={36} style={{ lineHeight: 38 }}>{farmer.reviewCount ? farmer.ratingAvg.toFixed(1) : "–"}</Txt>
              <View style={{ gap: 3, paddingBottom: 4 }}>
                <StarRow value={Math.round(farmer.ratingAvg)} size={14} />
                <Txt size={11} color={colors.muted}>{farmer.reviewCount} 件</Txt>
              </View>
            </View>
            <View style={{ gap: 4 }}>
              {dist.map(({ n, c }) => (
                <View key={n} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Txt mono size={10} color={colors.muted} style={{ width: 10 }}>{String(n)}</Txt>
                  <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.lineSoft, overflow: "hidden" }}>
                    <View style={{ width: `${reviews.length ? (c / reviews.length) * 100 : 0}%`, height: "100%", backgroundColor: colors.star }} />
                  </View>
                  <Txt mono size={10} color={colors.muted} style={{ width: 16, textAlign: "right" }}>{String(c)}</Txt>
                </View>
              ))}
            </View>
          </Card>
        )}
        <Card style={{ paddingHorizontal: 14 }}>
          {reviews.length === 0 && <Txt size={12} color={colors.muted} style={{ paddingVertical: 14 }}>まだレビューはありません。</Txt>}
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </Card>
      </ScrollView>
    </View>
  );
}
