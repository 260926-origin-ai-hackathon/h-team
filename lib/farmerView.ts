import { colors } from "./theme";
import type { Farmer, Product, ReservationStatus, Fulfillment } from "./types";

export function seasonPill(f: Pick<Farmer, "season" | "seasonState">) {
  if (f.seasonState === "now") return { label: "今が旬", bg: colors.greenBg, color: colors.greenText };
  if (f.seasonState === "soon") return { label: "もうすぐ旬", bg: colors.amberBg, color: colors.amberText };
  return { label: `旬 ${f.season}`, bg: colors.chip, color: colors.muted };
}

export type ProductBadge = { label: string; bg: string; color: string };

export function productBadges(p: Pick<Product, "harvestedToday" | "stock" | "deliveryAvailable">): ProductBadge[] {
  const out: ProductBadge[] = [];
  if (p.harvestedToday) out.push({ label: "本日収穫", bg: colors.green, color: colors.white });
  if (p.deliveryAvailable) out.push({ label: "発送可", bg: colors.chip, color: colors.inkSoft });
  if (p.stock > 0 && p.stock <= 4) out.push({ label: `残り${p.stock}点`, bg: colors.fewBg, color: colors.fewText });
  return out;
}

export function featuredProducts<T extends Pick<Product, "harvestedToday" | "stock">>(products: T[], n = 2) {
  const score = (p: T) => (p.harvestedToday ? 2 : 0) + (p.stock > 0 && p.stock <= 4 ? 1 : 0);
  return [...products].sort((a, b) => score(b) - score(a)).slice(0, n);
}

export const fmtRating = (avg: number) => (avg > 0 ? avg.toFixed(1) : "–");

export function statusPill(status: ReservationStatus, method: Fulfillment) {
  switch (status) {
    case "requested":
      return { label: "リクエスト中", bg: colors.amberBg, color: colors.amberText };
    case "confirmed":
      return { label: method === "pickup" ? "受取確定" : "発送準備中", bg: colors.greenBg, color: colors.greenText };
    case "completed":
      return { label: method === "pickup" ? "受取完了" : "発送済み", bg: colors.chip, color: colors.inkSoft };
    case "declined":
      return { label: "辞退", bg: colors.fewBg, color: colors.fewText };
    case "cancelled":
      return { label: "キャンセル", bg: colors.chip, color: colors.muted };
  }
}

export const methodLabel = (m: Fulfillment) => (m === "pickup" ? "取りに行く" : "発送代行");

export function fmtDateTime(ts: number) {
  const d = new Date(ts);
  const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}（${w}） ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function fmtDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export const PICKUP_HOURS = [9, 10, 11, 14, 15, 16];

export function pickupDays(n = 7) {
  const out: { label: string; date: Date }[] = [];
  const names = ["日", "月", "火", "水", "木", "金", "土"];
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    out.push({ label: i === 1 ? "明日" : `${d.getMonth() + 1}/${d.getDate()} ${names[d.getDay()]}`, date: d });
  }
  return out;
}
