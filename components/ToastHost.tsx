import { View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../lib/store";
import { colors } from "../lib/theme";
import { Txt } from "./ui";

export function ToastHost() {
  const toast = useStore((s) => s.toast);
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: insets.top + 12, left: 0, right: 0, alignItems: "center" }}>
      <Animated.View
        entering={FadeInUp.duration(200)}
        exiting={FadeOutUp.duration(200)}
        style={{
          backgroundColor: colors.ink,
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 10,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}
      >
        <Txt w={500} size={12} color={colors.white}>
          {toast}
        </Txt>
      </Animated.View>
    </View>
  );
}
