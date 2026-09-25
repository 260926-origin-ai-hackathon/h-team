import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Farmer Cards",
  slug: "farmer-cards",
  scheme: "farmercards",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: false,
    bundleIdentifier: "dev.farmercards.app",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "近くの農家を地図で見つけるために位置情報を使用します。",
    },
  },
  android: {
    package: "dev.farmercards.app",
    adaptiveIcon: {
      backgroundColor: "#FAFAF8",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },
  web: { favicon: "./assets/favicon.png" },
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
          "近くの農家を地図で見つけるために位置情報を使用します。",
      },
    ],
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN ?? "",
      },
    ],
  ],
});
