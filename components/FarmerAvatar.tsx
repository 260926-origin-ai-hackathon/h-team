import { Image } from "expo-image";
import { View } from "react-native";
import { colors } from "../lib/theme";

/**
 * Face avatar. Locked farmers stay tappable but read as "not yet collected":
 * blurred, desaturated veil, dashed grey ring. Owned: sharp photo, white ring on tint.
 */
export function FarmerAvatar({
  uri,
  size,
  owned,
  tint,
  selected = false,
  borderWidth,
}: {
  uri: string;
  size: number;
  owned: boolean;
  tint: string;
  selected?: boolean;
  borderWidth?: number;
}) {
  const border = borderWidth ?? (owned ? 3 : 2);
  const inner = size - border * 2;
  return (
    <View
      style={{
        width: size + 6,
        height: size + 6,
        borderRadius: (size + 6) / 2,
        borderWidth: 3,
        borderColor: selected ? colors.green : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: owned ? tint : colors.lockedBg,
          borderWidth: border,
          borderColor: owned ? colors.white : colors.lockedBorder,
          borderStyle: owned ? "solid" : "dashed",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: owned ? 0.12 : 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: owned ? 3 : 1,
        }}
      >
        <View style={{ width: inner, height: inner, borderRadius: inner / 2, overflow: "hidden" }}>
          <Image
            source={{ uri }}
            style={{ width: inner, height: inner }}
            contentFit="cover"
            transition={250}
            blurRadius={owned ? 0 : Math.max(4, Math.round(inner / 7))}
            cachePolicy="memory-disk"
          />
          {!owned && (
            <View
              pointerEvents="none"
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(239,239,235,0.6)" }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
