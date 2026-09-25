import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { productBadges } from "../lib/farmerView";
import { colors, shadow, yen } from "../lib/theme";
import type { Product } from "../lib/types";
import { AddButton, Txt } from "./ui";

/**
 * Product row. `md` = white card with 76px image and black + (farmer detail).
 * `sm` = plain row with 48px image and chip-coloured + (sheet, card detail).
 */
export function ProductCard({
  product,
  size = "md",
  onPress,
  onAdd,
}: {
  product: Product;
  size?: "md" | "sm";
  onPress: () => void;
  onAdd: () => void;
}) {
  const badges = productBadges(product);
  const img = size === "md" ? 76 : 48;
  const soldOut = product.stock <= 0;
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "center", gap: size === "md" ? 12 : 10 },
        size === "md"
          ? { backgroundColor: colors.white, borderRadius: 16, padding: 10, ...shadow.card }
          : { paddingVertical: 6 },
      ]}
    >
      <Pressable onPress={onPress}>
        <Image
          source={{ uri: product.image }}
          style={{ width: img, height: img, borderRadius: size === "md" ? 12 : 10, backgroundColor: colors.bgAlt }}
          contentFit="cover"
          transition={200}
        />
      </Pressable>
      <Pressable onPress={onPress} style={{ flex: 1, minWidth: 0, gap: size === "md" ? 4 : 3 }}>
        {size === "md" && badges.length > 0 && (
          <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
            {badges.map((b) => (
              <Badge key={b.label} {...b} />
            ))}
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Txt w={700} size={size === "md" ? 14 : 13} numberOfLines={1} style={{ flexShrink: 1 }}>
            {product.name}
          </Txt>
          {size === "sm" && badges.map((b) => <Badge key={b.label} {...b} />)}
        </View>
        <Txt size={11} color={colors.muted}>
          <Txt mono w={500} size={size === "md" ? 13 : 12}>
            {yen(product.price)}
          </Txt>
          {" · "}
          {product.unit}
        </Txt>
      </Pressable>
      {soldOut ? (
        <Txt size={11} color={colors.mutedLight}>売り切れ</Txt>
      ) : (
        <AddButton onPress={onAdd} dark={size === "md"} size={size === "md" ? 40 : 36} />
      )}
    </View>
  );
}

export function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, backgroundColor: bg }}>
      <Txt w={700} size={9.5} color={color}>
        {label}
      </Txt>
    </View>
  );
}
