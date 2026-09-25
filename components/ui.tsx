import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleProp, Text, TextInput, TextProps, View, ViewStyle } from "react-native";
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
  label,
}: {
  name: ComponentProps<typeof Ionicons>["name"];
  label?: string;
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
      accessibilityRole="button"
      accessibilityLabel={label ?? (name === "chevron-back" ? "戻る" : name === "close" ? "閉じる" : undefined)}
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

export function StatusPill({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <Pill label={label} bg={bg} color={color} size={10} weight={700} />;
}

/** Labeled text input for the farmer-side forms. */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  hint,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  hint?: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Txt w={500} size={11} color={colors.muted}>{label}</Txt>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedLight}
        multiline={multiline}
        keyboardType={keyboardType}
        accessibilityLabel={label}
        testID={`field-${label}`}
        returnKeyType={multiline ? "default" : "done"}
        autoCorrect={false}
        spellCheck={false}
        style={{
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 10 : 0,
          height: multiline ? 92 : 44,
          textAlignVertical: multiline ? "top" : "center",
          fontFamily: fonts.sans400,
          fontSize: 14,
          color: colors.ink,
        }}
      />
      {hint && <Txt size={10.5} color={colors.muted}>{hint}</Txt>}
    </View>
  );
}

/** Two-way toggle row (e.g. 本日収穫 / 発送対応 / PR). */
export function ToggleRow({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Txt w={500} size={13}>{label}</Txt>
        {hint && <Txt size={11} color={colors.muted}>{hint}</Txt>}
      </View>
      <View style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: value ? colors.greenDeep : colors.line, padding: 3, alignItems: value ? "flex-end" : "flex-start" }}>
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white }} />
      </View>
    </Pressable>
  );
}

/** Segmented control (e.g. 取りに行く / 発送代行). */
export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string; disabled?: boolean }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={{ flexDirection: "row", padding: 3, backgroundColor: "#F0F0EC", borderRadius: 12 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            disabled={o.disabled}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: on, disabled: o.disabled }}
            style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 9, backgroundColor: on ? colors.white : "transparent", opacity: o.disabled ? 0.4 : 1, ...(on ? shadow.card : {}) }}
          >
            <Txt w={700} size={12} color={on ? colors.ink : colors.muted}>{o.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Screen header used by list screens: mono label + big title. */
export function ScreenTitle({ label, title, right }: { label: string; title: string; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
      <View style={{ gap: 4 }}>
        <SectionLabel>{label}</SectionLabel>
        <Txt w={700} size={24}>{title}</Txt>
      </View>
      {right}
    </View>
  );
}
