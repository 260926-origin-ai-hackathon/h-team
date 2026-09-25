import { Image } from "expo-image";
import { View } from "react-native";
import { seasonPill } from "../lib/farmerView";
import { colors, pad3 } from "../lib/theme";
import type { Farmer } from "../lib/types";
import { Pill, Txt } from "./ui";

export const BIG_CARD = { width: 262, height: 366 };

/** Trading-card face (262×366) used by the card detail screen and the reveal. */
export function BigFarmerCard({
  farmer,
  count,
  showLockedTag = true,
}: {
  farmer: Farmer;
  count: number;
  showLockedTag?: boolean;
}) {
  const locked = count === 0;
  const season = seasonPill(farmer);
  return (
    <View
      style={{
        width: BIG_CARD.width,
        height: BIG_CARD.height,
        borderRadius: 18,
        backgroundColor: colors.white,
        padding: 12,
        gap: 10,
        borderWidth: locked ? 1.5 : 1,
        borderColor: locked ? "#C4C4BE" : colors.line,
        borderStyle: locked ? "dashed" : "solid",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 18 },
        elevation: 8,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Txt mono w={500} size={10} color={colors.muted}>
          No.{pad3(farmer.no)} · OSAKA
        </Txt>
        <Pill label={season.label} bg={season.bg} color={season.color} size={9.5} />
      </View>
      <View style={{ height: 162, borderRadius: 12, overflow: "hidden", backgroundColor: locked ? colors.lockedBg : farmer.tint }}>
        <Image source={{ uri: farmer.avatar }} style={{ width: "100%", height: "100%" }} contentFit="cover" blurRadius={locked ? 18 : 0} transition={250} />
        {locked && <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(239,239,235,0.62)" }} />}
        {farmer.hasTodayHarvest && (
          <View style={{ position: "absolute", left: 8, top: 8, backgroundColor: colors.green, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Txt w={700} size={10} color={colors.white}>本日収穫</Txt>
          </View>
        )}
        {locked && showLockedTag && (
          <View style={{ position: "absolute", left: 8, bottom: 8, backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Txt w={700} size={10} color={colors.inkMid}>未解放</Txt>
          </View>
        )}
      </View>
      <View style={{ gap: 1 }}>
        <Txt size={10} color={colors.muted}>{farmer.kana}</Txt>
        <Txt w={700} size={20} color={locked ? colors.muted : colors.ink}>{farmer.name}</Txt>
        <Txt size={11} color={colors.inkMid}>
          {farmer.farmName} · {farmer.city}
        </Txt>
      </View>
      <View style={{ flexDirection: "row", gap: 6 }}>
        <Stat label="作物" value={farmer.crops[0]} />
        <Stat label="旬" value={farmer.season} />
        <Stat label="所持" value={`×${count}`} mono />
      </View>
      <Txt w={500} size={11} color={colors.inkSoft} style={{ textAlign: "center", marginTop: "auto" }} numberOfLines={1}>
        「{farmer.catchphrase}」
      </Txt>
    </View>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, gap: 1 }}>
      <Txt size={9} color={colors.muted}>{label}</Txt>
      {mono ? (
        <Txt mono w={500} size={12}>{value}</Txt>
      ) : (
        <Txt w={700} size={11.5} numberOfLines={1}>{value}</Txt>
      )}
    </View>
  );
}
