import { Image } from "expo-image";
import { View } from "react-native";
import { colors } from "../lib/theme";

/** Round face photo with a white ring on the farmer's tint; green ring when selected, gold-ish when PR. */
export function FarmerAvatar({
  uri,
  size,
  tint,
  selected = false,
  pr = false,
  borderWidth = 3,
  onLoad,
}: {
  uri: string;
  size: number;
  tint: string;
  selected?: boolean;
  pr?: boolean;
  borderWidth?: number;
  onLoad?: () => void;
}) {
  const inner = size - borderWidth * 2;
  return (
    <View
      style={{
        width: size + 6,
        height: size + 6,
        borderRadius: (size + 6) / 2,
        borderWidth: 3,
        borderColor: selected ? colors.green : pr ? colors.pr : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tint,
          borderWidth,
          borderColor: colors.white,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
      >
        <View style={{ width: inner, height: inner, borderRadius: inner / 2, overflow: "hidden" }}>
          <Image source={{ uri }} style={{ width: inner, height: inner }} contentFit="cover" transition={0} cachePolicy="memory-disk" onLoad={onLoad} />
        </View>
      </View>
    </View>
  );
}
