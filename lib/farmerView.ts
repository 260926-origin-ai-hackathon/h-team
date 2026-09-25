import { colors } from "./theme";
import type { Farmer, Product } from "./types";

/** Season pill per design: 今が旬 / もうすぐ旬 / 旬 X〜Y月 */
export function seasonPill(f: Pick<Farmer, "season" | "seasonState">) {
  if (f.seasonState === "now") return { label: "今が旬", bg: colors.greenBg, color: colors.greenText };
  if (f.seasonState === "soon") return { label: "もうすぐ旬", bg: colors.amberBg, color: colors.amberText };
  return { label: `旬 ${f.season}`, bg: colors.chip, color: colors.muted };
}

export function unlockText(count: number) {
  return count === 0
    ? "はじめて購入すると、このカードが手に入ります"
    : `カード ${count}枚所持 · 購入するたびに1枚増えます`;
}

export function statusPill(count: number) {
  return count === 0
    ? { label: "未解放", bg: colors.white, color: colors.muted, border: colors.lockedBorder, dashed: true }
    : { label: `購入済み ×${count}`, bg: "#E7F2E9", color: colors.greenText, border: "transparent", dashed: false };
}

export type ProductBadge = { label: string; bg: string; color: string };

export function productBadges(p: Pick<Product, "harvestedToday" | "stock">): ProductBadge[] {
  const out: ProductBadge[] = [];
  if (p.harvestedToday) out.push({ label: "本日収穫", bg: colors.green, color: colors.white });
  if (p.stock > 0 && p.stock <= 4) out.push({ label: `残り${p.stock}点`, bg: colors.fewBg, color: colors.fewText });
  return out;
}

/** Products worth surfacing first: today's harvest, then low stock. */
export function featuredProducts<T extends Pick<Product, "harvestedToday" | "stock">>(products: T[], n = 2) {
  const score = (p: T) => (p.harvestedToday ? 2 : 0) + (p.stock > 0 && p.stock <= 4 ? 1 : 0);
  return [...products].sort((a, b) => score(b) - score(a)).slice(0, n);
}
