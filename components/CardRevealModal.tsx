import { useQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect } from "react";
import { Modal, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { api } from "../convex/_generated/api";
import { DEMO_USER_ID } from "../lib/convex";
import { useStore } from "../lib/store";
import { colors } from "../lib/theme";
import { BIG_CARD, BigFarmerCard } from "./BigFarmerCard";
import { Btn, Txt } from "./ui";

/**
 * Full-screen card reveal after checkout. One card per farmer in the order;
 * the card flips in (rotateY 100° → 0°) with a sheen sweep, then the copy fades in.
 */
export function CardRevealModal() {
  const { revealQueue, shiftReveal, clearReveal } = useStore();
  const farmers = useQuery(api.farmers.list) ?? [];
  const unlocked = useQuery(api.collections.unlockedIds, { userId: DEMO_USER_ID }) ?? [];
  const item = revealQueue[0];
  const farmer = item ? farmers.find((f) => f._id === item.farmerId) : undefined;

  const flip = useSharedValue(0); // 0 = hidden/rotated, 1 = shown
  useEffect(() => {
    if (!item) return;
    flip.value = 0;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    flip.value = withDelay(80, withTiming(1, { duration: 800, easing: Easing.bezier(0.2, 0.8, 0.2, 1) }));
  }, [item?.farmerId, item?.count, flip, item]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: flip.value < 0.05 ? 0 : 1,
    transform: [
      { perspective: 1000 },
      { rotateY: `${100 * (1 - flip.value)}deg` },
      { scale: 0.8 + 0.2 * flip.value },
    ],
  }));
  const sheenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -140 + 440 * flip.value }, { skewX: "-15deg" }],
    opacity: flip.value > 0.15 && flip.value < 0.95 ? 0.7 : 0,
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: withTiming(flip.value > 0.6 ? 1 : 0, { duration: 500 }),
  }));

  if (!item || !farmer) return null;

  const first = item.count === 1;
  const ownedCount = unlocked.length;
  const total = farmers.length;
  const isLast = revealQueue.length === 1;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: "rgba(250,250,248,0.96)", alignItems: "center", justifyContent: "center", gap: 22, paddingHorizontal: 24 }}>
        <Animated.View style={[{ alignItems: "center", gap: 6 }, textStyle]}>
          <Txt mono w={500} size={10} color={colors.muted} style={{ letterSpacing: 1 }}>
            {`${1} / ${revealQueue.length}`}
          </Txt>
          <Txt w={700} size={22}>
            {first ? "新しいカードを手に入れました" : `${item.count}枚目のカードです`}
          </Txt>
        </Animated.View>

        <Animated.View style={[{ width: BIG_CARD.width, height: BIG_CARD.height }, cardStyle]}>
          <BigFarmerCard farmer={farmer} count={item.count} showLockedTag={false} />
          <Animated.View
            pointerEvents="none"
            style={[
              { position: "absolute", top: 0, bottom: 0, left: 0, width: 120, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 18 },
              sheenStyle,
            ]}
          />
        </Animated.View>

        <Animated.View style={[{ alignItems: "center", gap: 8, width: 220 }, textStyle]}>
          <View style={{ flexDirection: "row", gap: 3, width: "100%" }}>
            {farmers.map((f) => (
              <View
                key={f._id}
                style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: unlocked.includes(f._id) ? colors.green : "#E9E9E5" }}
              />
            ))}
          </View>
          <Txt size={12} color={colors.inkMid}>
            {first
              ? `図鑑 ${ownedCount} / ${total} · あと${total - ownedCount}人でコンプリート`
              : `${farmer.name}さんのカード ×${item.count}`}
          </Txt>
        </Animated.View>

        <Animated.View style={[{ flexDirection: "row", gap: 10 }, textStyle]}>
          <Btn
            label="図鑑で見る"
            variant="outline"
            style={{ paddingHorizontal: 20 }}
            onPress={() => {
              clearReveal();
              router.navigate("/collection");
            }}
          />
          <Btn label={isLast ? "閉じる" : "次のカード"} style={{ paddingHorizontal: 26 }} onPress={shiftReveal} />
        </Animated.View>
      </View>
    </Modal>
  );
}
