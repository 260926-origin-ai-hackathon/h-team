import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono";
import { ZenKakuGothicNew_400Regular, ZenKakuGothicNew_500Medium, ZenKakuGothicNew_700Bold, useFonts } from "@expo-google-fonts/zen-kaku-gothic-new";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ConvexProvider } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastHost } from "../components/ToastHost";
import { Txt } from "../components/ui";
import { CONVEX_URL, convex } from "../lib/convex";
import { colors } from "../lib/theme";

// Harmless RN Animated warning (emitted by the native stack/keyboard); keep the dev banner off the tab bar.
LogBox.ignoreLogs(["Sending `onAnimatedValueUpdate` with no listeners registered.", /\[CONVEX M\(/]);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ZenKakuGothicNew_400Regular,
    ZenKakuGothicNew_500Medium,
    ZenKakuGothicNew_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  if (!CONVEX_URL) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
        <Txt w={700} size={18}>Convex が未設定です</Txt>
        <Txt size={13} color={colors.inkSoft} style={{ textAlign: "center", lineHeight: 21 }}>
          `npx convex dev` を実行し、表示された URL を .env.local の EXPO_PUBLIC_CONVEX_URL に設定してから再起動してください。
        </Txt>
      </View>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: "slide_from_right", gestureEnabled: true }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="consumer/(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen name="farmer/(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen name="admin" options={{ animation: "fade" }} />
            <Stack.Screen name="consumer/review/[id]" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
            <Stack.Screen name="consumer/pay/[id]" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
            <Stack.Screen name="farmer/product/[id]" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
          </Stack>
          <ToastHost />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ConvexProvider>
  );
}
