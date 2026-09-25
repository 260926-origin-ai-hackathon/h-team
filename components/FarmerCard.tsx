import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { seasonPill } from "../lib/farmerView";
import { colors, pad3 } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { Pill, Txt } from "./ui";

/** 図鑑 grid card (63:88). Owned cards stack visually with the number of copies. */
export function FarmerCard({
  farmer,
  count,
  width,
  onPress,
}: {
  farmer: Farmer;
  count: number;
  width: number;
  onPress: () => void;
}) {
  const locked = count === 0;
  const height = (width * 88) / 63;
  const season = seasonPill(farmer);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ width, height, opacity: pressed ? 0.9 : 1 })}>
      {count > 2 && <Backer offset={10} />}
      {count > 1 && <Backer offset={5} />}
      <View
        style={{
          flex: 1,
          borderRadius: 14,
          backgroundColor: colors.white,
          padding: 8,
          gap: 7,
          borderWidth: locked ? 1.5 : 1,
          borderColor: locked ? "#CFCFC9" : colors.line,
          borderStyle: locked ? "dashed" : "solid",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Txt mono w={500} size={9} color="#9A9A94">
            No.{pad3(farmer.no)}
          </Txt>
          <Txt mono w={500} size={9} color={locked ? colors.mutedLight : colors.ink}>
            {locked ? "未解放" : `×${count}`}
          </Txt>
        </View>
        <View style={{ flex: 1, borderRadius: 9, overflow: "hidden", backgroundColor: locked ? colors.lockedBg : farmer.tint }}>
          <Image
            source={{ uri: farmer.avatar }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            blurRadius={locked ? 16 : 0}
            transition={250}
          />
          {locked && <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(239,239,235,0.62)" }} />}
          {farmer.hasTodayHarvest && (
            <View style={{ position: "absolute", left: 6, top: 6, backgroundColor: colors.green, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Txt w={700} size={9} color={colors.white}>本日収穫</Txt>
            </View>
          )}
          {locked && (
            <View style={{ position: "absolute", right: 6, bottom: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="lock-closed" size={10} color={colors.mutedLight} />
            </View>
          )}
        </View>
        <View style={{ gap: 2 }}>
          <Txt w={700} size={13} color={locked ? colors.muted : colors.ink} numberOfLines={1}>
            {farmer.name}
          </Txt>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
            <Txt size={10} color={colors.muted} numberOfLines={1} style={{ flexShrink: 1 }}>
              {farmer.crops[0]}
            </Txt>
            <Pill label={season.label} bg={season.bg} color={season.color} size={9} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function Backer({ offset }: { offset: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        inset: 0,
        transform: [{ translateX: offset }, { translateY: offset }],
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: offset > 5 ? "#E9E9E5" : colors.line,
      }}
    />
  );
}
