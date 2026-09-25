import { Platform } from "react-native";

export const colors = {
  white: "#FFFFFF",
  offWhite: "#F7F6F2",
  beige: "#EDE7DA",
  beigeSoft: "#F4F0E7",
  ink: "#141414",
  inkSoft: "#4A4A46",
  muted: "#8A8A84",
  line: "#E6E3DC",
  green: "#5F7C5A",
  greenSoft: "#DCE5D6",
  pastelPink: "#F3E3DF",
  pastelYellow: "#F5EFD8",
  overlay: "rgba(20,20,20,0.45)",
};

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const fonts = {
  display: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }),
  body: Platform.select({ ios: "System", android: "sans-serif", default: "System" }),
};

export const type = {
  display: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.ink },
  title: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.ink },
  heading: { fontSize: 16, fontWeight: "600" as const, color: colors.ink },
  body: { fontSize: 15, lineHeight: 23, color: colors.inkSoft },
  caption: { fontSize: 12, lineHeight: 16, color: colors.muted },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
    color: colors.muted,
    fontWeight: "600" as const,
  },
};

export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
};

export const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
