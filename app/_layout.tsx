import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono";
import {
  ZenKakuGothicNew_400Regular,
  ZenKakuGothicNew_500Medium,
  ZenKakuGothicNew_700Bold,
  useFonts,
} from "@expo-google-fonts/zen-kaku-gothic-new";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ConvexProvider } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CardRevealModal } from "../components/CardRevealModal";
import { ToastHost } from "../components/ToastHost";
import { Txt } from "../components/ui";
import { CONVEX_URL, convex } from "../lib/convex";
import { colors } from "../lib/theme";

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
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="collection" options={{ animation: "fade" }} />
            <Stack.Screen name="cart" options={{ animation: "fade" }} />
            <Stack.Screen name="farmer/[id]" />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="card/[id]" options={{ animation: "fade_from_bottom" }} />
          </Stack>
          <ToastHost />
          <CardRevealModal />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ConvexProvider>
  );
}
