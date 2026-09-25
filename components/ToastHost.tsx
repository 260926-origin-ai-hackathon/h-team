import { router } from "expo-router";
import { Pressable, View } from "react-native";
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
    <View pointerEvents="box-none" style={{ position: "absolute", top: insets.top + 12, left: 16, right: 16, alignItems: "center" }}>
      <Animated.View
        entering={FadeInUp.duration(200)}
        exiting={FadeOutUp.duration(200)}
        style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.ink, borderRadius: 999, paddingLeft: 16, paddingRight: toast.action ? 6 : 16, paddingVertical: toast.action ? 6 : 10, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 6 }}
      >
        <Txt w={500} size={12} color={colors.white} style={{ flexShrink: 1 }}>{toast.msg}</Txt>
        {toast.action && (
          <Pressable
            onPress={() => {
              useStore.setState({ toast: null });
              router.navigate(toast.action!.href as never);
            }}
            accessibilityRole="button"
            accessibilityLabel={toast.action.label}
            style={{ backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 }}
          >
            <Txt w={700} size={11} color={colors.ink}>{toast.action.label}</Txt>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
