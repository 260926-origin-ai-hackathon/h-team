import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { fmtDateTime, methodLabel, statusPill } from "../lib/farmerView";
import { colors, shadow, yen } from "../lib/theme";
import type { Reservation } from "../lib/types";
import { FarmerAvatar } from "./FarmerAvatar";
import { StatusPill, Txt } from "./ui";

/** Reservation row. `perspective` decides whether the farmer or the consumer is the counterparty. */
export function ReservationCard({ reservation: r, perspective, onPress }: { reservation: Reservation; perspective: "consumer" | "farmer"; onPress: () => void }) {
  const st = statusPill(r.status, r.method);
  const summary = r.items.map((i) => `${i.name} ×${i.quantity}`).join("、");
  return (
    <Pressable onPress={onPress} accessibilityLabel={`予約 ${perspective === "consumer" ? r.farmer?.name : r.consumerName} ${st.label}`} style={({ pressed }) => [{ backgroundColor: colors.white, borderRadius: 16, padding: 14, gap: 10, opacity: pressed ? 0.9 : 1 }, shadow.card]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {perspective === "consumer" && r.farmer ? (
          <FarmerAvatar uri={r.farmer.avatar} size={36} tint={r.farmer.tint} borderWidth={2} />
        ) : (
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.beigeAvatar, alignItems: "center", justifyContent: "center" }}>
            <Txt w={700} size={13}>{r.consumerName.slice(0, 1)}</Txt>
          </View>
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Txt w={700} size={14} numberOfLines={1}>{perspective === "consumer" ? (r.farmer?.name ?? "") : r.consumerName}</Txt>
          <Txt size={11} color={colors.muted} numberOfLines={1}>{summary}</Txt>
        </View>
        <StatusPill {...st} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name={r.method === "pickup" ? "walk-outline" : "cube-outline"} size={13} color={colors.inkMid} />
          <Txt size={11} color={colors.inkMid}>{methodLabel(r.method)}</Txt>
        </View>
        {r.pickupAt && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="time-outline" size={13} color={colors.inkMid} />
            <Txt mono size={11} color={colors.inkMid}>{fmtDateTime(r.pickupAt)}</Txt>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <Txt mono w={500} size={13}>{yen(r.total)}</Txt>
      </View>
    </Pressable>
  );
}
