import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "はたけマップ",
  slug: "hatake-map",
  scheme: "hatakemap",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: false,
    bundleIdentifier: "jp.hatakemap.app",
    buildNumber: "1",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "近くの生産者を地図で見つけるため、また農園設定で畑の位置を登録するために位置情報を使用します。",
      ITSAppUsesNonExemptEncryption: false,
      CFBundleDevelopmentRegion: "ja",
      CFBundleLocalizations: ["ja"],
    },
  },
  android: {
    package: "jp.hatakemap.app",
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: "#FAFAF8",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },
  web: { favicon: "./assets/favicon.png" },
  // `eas init` が extra.eas.projectId と owner を書き込みます（未ログインのため未設定）。
  extra: { eas: {} },
  plugins: [
    "expo-router",
    "expo-image",
    [
      "expo-splash-screen",
      { image: "./assets/splash-icon.png", resizeMode: "contain", backgroundColor: "#FAFAF8" },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "近くの生産者を地図で見つけるため、また農園設定で畑の位置を登録するために位置情報を使用します。",
      },
    ],
    "@rnmapbox/maps",
  ],
});
