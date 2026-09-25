import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleProp, Text, TextProps, View, ViewStyle } from "react-native";
import { colors, fonts, radius, shadow } from "../lib/theme";

type Weight = 400 | 500 | 700;

export function Txt({
  w = 400,
  mono = false,
  size = 13,
  color = colors.ink,
  style,
  ...rest
}: TextProps & { w?: Weight; mono?: boolean; size?: number; color?: string }) {
  const family = mono
    ? w === 400
      ? fonts.mono400
      : fonts.mono500
    : w === 700
      ? fonts.sans700
      : w === 500
        ? fonts.sans500
        : fonts.sans400;
  return <Text {...rest} style={[{ fontFamily: family, fontSize: size, color }, style]} />;
}

/** Section label like "01 · 人" or "COLLECTION · OSAKA" */
export function SectionLabel({ children, rule = false }: { children: string; rule?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Txt mono w={500} size={10} color={colors.muted} style={{ letterSpacing: 0.8 }}>
        {children}
      </Txt>
      {rule && <View style={{ flex: 1, height: 1, backgroundColor: colors.lineSoft }} />}
    </View>
  );
}

export function Pill({
  label,
  bg,
  color,
  border,
  dashed,
  size = 10,
  weight = 500,
}: {
  label: string;
  bg: string;
  color: string;
  border?: string;
  dashed?: boolean;
  size?: number;
  weight?: Weight;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.pill,
        backgroundColor: bg,
        borderWidth: border ? 1 : 0,
        borderColor: border,
        borderStyle: dashed ? "dashed" : "solid",
        alignSelf: "flex-start",
      }}
    >
      <Txt w={weight} size={size} color={color}>
        {label}
      </Txt>
    </View>
  );
}

export function Btn({
  label,
  onPress,
  variant = "black",
  count,
  height = 46,
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: "black" | "green" | "outline";
  count?: number | string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const bg = variant === "black" ? colors.ink : variant === "green" ? colors.greenDeep : colors.white;
  const fg = variant === "outline" ? colors.ink : colors.white;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          height,
          borderRadius: 13,
          backgroundColor: bg,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: colors.line,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Txt w={700} size={13} color={fg}>
        {label}
      </Txt>
      {count !== undefined && (
        <Txt mono w={500} size={11} color={fg} style={{ opacity: 0.6 }}>
          {String(count)}
        </Txt>
      )}
    </Pressable>
  );
}

export function IconButton({
  name,
  onPress,
  size = 38,
  bg = colors.white,
  color = colors.ink,
  iconSize = 18,
  flat = false,
}: {
  name: ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  size?: number;
  bg?: string;
  color?: string;
  iconSize?: number;
  flat?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        },
        !flat && shadow.pin,
      ]}
    >
      <Ionicons name={name} size={iconSize} color={color} />
    </Pressable>
  );
}

export function Stepper({
  value,
  onChange,
  size = "sm",
}: {
  value: number;
  onChange: (n: number) => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? 30 : 48;
  const w = size === "sm" ? 30 : 40;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E8E8E4",
        borderRadius: size === "sm" ? 10 : 12,
        overflow: "hidden",
      }}
    >
      <Pressable onPress={() => onChange(value - 1)} style={{ width: w, height: h, alignItems: "center", justifyContent: "center" }}>
        <Txt size={size === "sm" ? 16 : 18} color={colors.inkSoft}>−</Txt>
      </Pressable>
      <Txt mono w={500} size={size === "sm" ? 13 : 15} style={{ width: 24, textAlign: "center" }}>
        {String(value)}
      </Txt>
      <Pressable onPress={() => onChange(value + 1)} style={{ width: w, height: h, alignItems: "center", justifyContent: "center" }}>
        <Txt size={size === "sm" ? 16 : 18} color={colors.inkSoft}>+</Txt>
      </Pressable>
    </View>
  );
}

/** Small "+" add-to-cart square */
export function AddButton({ onPress, dark = false, size = 36 }: { onPress: () => void; dark?: boolean; size?: number }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: pressed ? colors.greenDeep : dark ? colors.ink : colors.chip,
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      {({ pressed }) => (
        <Txt size={size / 2} color={dark || pressed ? colors.white : colors.ink} style={{ lineHeight: size / 2 + 4 }}>
          +
        </Txt>
      )}
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: colors.white, borderRadius: radius.xl, ...shadow.card }, style]}>{children}</View>
  );
}
