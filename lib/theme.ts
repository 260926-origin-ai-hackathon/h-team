// Design tokens from "Farm Card App v2" (claude.ai/design). Keep in sync with the design.
export const colors = {
  white: "#FFFFFF",
  bg: "#FAFAF8",
  bgAlt: "#F4F4F1",
  bgSoft: "#F7F7F4",
  chip: "#F3F3F0",
  mapBg: "#EFEFEC",

  ink: "#22221F",
  inkSoft: "#55554F",
  inkMid: "#77776F",
  muted: "#8A8A84",
  mutedLight: "#A9A9A3",

  line: "#E3E3DF",
  lineSoft: "#ECECE8",
  lineLight: "#F1F1EE",

  lockedBg: "#EFEFEB",
  lockedBorder: "#B3B3AD",
  lockedText: "#A3A39D",

  green: "#43955F",
  greenDeep: "#3B8A55",
  greenBg: "#E1F2E5",
  greenText: "#2A6540",
  greenLine: "#DAEADD",
  greenTint: "#F0F7F1",

  amberBg: "#F6EFD9",
  amberText: "#7A5A22",
  fewBg: "#F9EBE3",
  fewText: "#9A4A2C",
};

export const fonts = {
  sans400: "ZenKakuGothicNew_400Regular",
  sans500: "ZenKakuGothicNew_500Medium",
  sans700: "ZenKakuGothicNew_700Bold",
  mono400: "IBMPlexMono_400Regular",
  mono500: "IBMPlexMono_500Medium",
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 999 };

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  float: {
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  pin: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
};

export const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
export const pad3 = (n: number) => String(n).padStart(3, "0");
