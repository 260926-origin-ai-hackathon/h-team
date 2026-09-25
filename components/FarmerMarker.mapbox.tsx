import Mapbox from "@rnmapbox/maps";
import { memo, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { fmtRating } from "../lib/farmerView";
import { toPosition } from "../lib/map";
// Mapbox marker (kept for switching back; see lib/mapbox.ts).
import { colors } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { FarmerAvatar } from "./FarmerAvatar";
import { Txt } from "./ui";

/** Map pin: face + rating badge; PR farmers are larger with a gold ring and tag. */
export const FarmerMarker = memo(function FarmerMarker({
  farmer,
  selected,
  onPress,
}: {
  farmer: Farmer;
  selected: boolean;
  onPress: () => void;
}) {
  const size = farmer.pr ? 58 : 48;
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(selected ? 1.12 : 1, { damping: 14, stiffness: 180 });
  }, [selected, scale]);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Mapbox.MarkerView coordinate={toPosition(farmer)} anchor={{ x: 0.5, y: 1 }} allowOverlap isSelected={selected}>
      <Pressable onPress={onPress} hitSlop={6} accessibilityLabel={`${farmer.name} ${farmer.crops[0]}`}>
        <Animated.View style={[{ width: 120, alignItems: "center", gap: 4, transformOrigin: "50% 100%" }, aStyle]}>
          <View>
            <FarmerAvatar uri={farmer.avatar} size={size} tint={farmer.tint} selected={selected} pr={farmer.pr} />
            <View
              style={{
                position: "absolute",
                right: -6,
                bottom: 0,
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                backgroundColor: colors.white,
                borderRadius: 9,
                paddingHorizontal: 5,
                paddingVertical: 1,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 2,
              }}
            >
              <Txt size={9} color={colors.star}>★</Txt>
              <Txt mono w={500} size={9.5}>{fmtRating(farmer.ratingAvg)}</Txt>
            </View>
            {farmer.pr && (
              <View style={{ position: "absolute", left: -4, top: -2, backgroundColor: colors.pr, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1, borderWidth: 1.5, borderColor: colors.white }}>
                <Txt mono w={500} size={8.5} color={colors.white}>PR</Txt>
              </View>
            )}
          </View>
          {farmer.hasTodayHarvest ? (
            <View style={pillStyle(colors.green)}>
              <Txt w={700} size={9.5} color={colors.white}>{farmer.crops[0]}・本日収穫</Txt>
            </View>
          ) : (
            <View style={pillStyle(colors.white)}>
              <Txt w={500} size={10} color="#33332F">{farmer.crops[0]}</Txt>
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
