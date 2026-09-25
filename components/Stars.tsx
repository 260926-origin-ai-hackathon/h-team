import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { colors } from "../lib/theme";
import { fmtRating } from "../lib/farmerView";
import { Txt } from "./ui";

/** Read-only rating: ★ 4.8 (12) */
export function Rating({ avg, count, size = 12, showCount = true }: { avg: number; count: number; size?: number; showCount?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
      <Ionicons name="star" size={size} color={count > 0 ? colors.star : colors.mutedLight} />
      <Txt mono w={500} size={size} color={count > 0 ? colors.ink : colors.muted}>
        {fmtRating(avg)}
      </Txt>
      {showCount && (
        <Txt size={size - 1} color={colors.muted}>
          {count > 0 ? `(${count})` : "レビューなし"}
        </Txt>
      )}
    </View>
  );
}

/** Five stars, static or tappable. */
export function StarRow({ value, onChange, size = 16 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: onChange ? 8 : 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} disabled={!onChange} onPress={() => onChange?.(n)} hitSlop={6} accessibilityLabel={`${n}つ星`}>
          <Ionicons name={n <= value ? "star" : "star-outline"} size={size} color={n <= value ? colors.star : colors.mutedLight} />
        </Pressable>
      ))}
    </View>
  );
}
