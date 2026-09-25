import { memo, useEffect, useState } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import { fmtRating } from "../lib/farmerView";
import { colors } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { FarmerAvatar } from "./FarmerAvatar";
import { Txt } from "./ui";

/**
 * Map pin for react-native-maps (Apple Maps in Expo Go): face + rating badge; PR farmers
 * are larger with a gold ring and tag. Custom marker views are rasterised by the map, so
 * `tracksViewChanges` is only on while the avatar loads or the selection changes.
 */
export const FarmerMarker = memo(function FarmerMarker({ farmer, selected, onPress }: { farmer: Farmer; selected: boolean; onPress: () => void }) {
  const size = farmer.pr ? 58 : 48;
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    setTracks(true);
    const t = setTimeout(() => setTracks(false), 600);
    return () => clearTimeout(t);
  }, [selected, farmer.avatar, farmer.ratingAvg, farmer.hasTodayHarvest, farmer.pr]);

  return (
    <Marker
      coordinate={{ latitude: farmer.latitude, longitude: farmer.longitude }}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: 0 }}
      onPress={(e) => {
        e.stopPropagation();
        onPress();
      }}
      tracksViewChanges={tracks}
      zIndex={selected ? 100 : farmer.pr ? 10 : 1}
      accessibilityLabel={`${farmer.name} ${farmer.crops[0]}`}
      testID={`marker-${farmer._id}`}
    >
      <View accessible accessibilityLabel={`${farmer.name} ${farmer.crops[0]}`} style={{ width: 120, alignItems: "center", gap: 4, paddingTop: 4, transform: [{ scale: selected ? 1.12 : 1 }] }}>
        <View>
          <FarmerAvatar uri={farmer.avatar} size={size} tint={farmer.tint} selected={selected} pr={farmer.pr} onLoad={() => setTracks(true)} />
          <View style={{ position: "absolute", right: -6, bottom: 0, flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: colors.white, borderRadius: 9, paddingHorizontal: 5, paddingVertical: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}>
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
      </View>
    </Marker>
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
});
