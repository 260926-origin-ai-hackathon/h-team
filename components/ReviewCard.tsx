import { View } from "react-native";
import { fmtDate } from "../lib/farmerView";
import { colors } from "../lib/theme";
import type { Review } from "../lib/types";
import { StarRow } from "./Stars";
import { Txt } from "./ui";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={{ gap: 6, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.beigeAvatar, alignItems: "center", justifyContent: "center" }}>
            <Txt w={700} size={11}>{review.authorName.slice(0, 1)}</Txt>
          </View>
          <Txt w={700} size={12}>{review.authorName}</Txt>
        </View>
        <Txt mono size={10} color={colors.muted}>{fmtDate(review.createdAt)}</Txt>
      </View>
      <StarRow value={review.rating} size={13} />
      <Txt size={12.5} color={colors.inkSoft} style={{ lineHeight: 20 }}>{review.comment}</Txt>
    </View>
  );
}
