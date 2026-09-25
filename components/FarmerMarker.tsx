import Mapbox from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import { memo, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { toPosition } from "../lib/map";
import { colors } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { FarmerAvatar } from "./FarmerAvatar";
import { Txt } from "./ui";

export const FarmerMarker = memo(function FarmerMarker({
  farmer,
  count,
  selected,
  onPress,
}: {
  farmer: Farmer;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  const owned = count > 0;
  const size = owned ? 54 : 46;
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(selected ? 1.12 : 1, { damping: 14, stiffness: 180 });
  }, [selected, scale]);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Mapbox.MarkerView
      coordinate={toPosition(farmer)}
      anchor={{ x: 0.5, y: 1 }}
      allowOverlap
      isSelected={selected}
    >
      <Pressable onPress={onPress} hitSlop={6}>
        <Animated.View style={[{ width: 116, alignItems: "center", gap: 4, transformOrigin: "50% 100%" }, aStyle]}>
          <View>
            <FarmerAvatar uri={farmer.avatar} size={size} owned={owned} tint={farmer.tint} selected={selected} />
            {owned ? (
              <View
                style={{
                  position: "absolute",
                  right: -3,
                  top: -1,
                  backgroundColor: colors.ink,
                  borderRadius: 8,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  borderWidth: 1.5,
                  borderColor: colors.white,
                }}
              >
                <Txt mono w={500} size={9.5} color={colors.white}>
                  ×{count}
                </Txt>
              </View>
            ) : (
              <View
                style={{
                  position: "absolute",
                  right: -1,
                  bottom: 1,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.white,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 2,
                }}
              >
                <Ionicons name="lock-closed" size={10} color="#9A9A94" />
              </View>
            )}
          </View>
          {farmer.hasTodayHarvest ? (
            <View style={pillStyle(colors.green)}>
              <Txt w={700} size={9.5} color={colors.white}>
                {farmer.crops[0]}・本日収穫
              </Txt>
            </View>
          ) : (
            <View style={pillStyle(colors.white)}>
              <Txt w={500} size={10} color={owned ? "#33332F" : colors.muted}>
                {farmer.crops[0]}
              </Txt>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Mapbox.MarkerView>
  );
});

const pillStyle = (bg: string) => ({
  backgroundColor: bg,
  paddingHorizontal: 7,
  paddingVertical: 2,
  borderRadius: 999,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
});
