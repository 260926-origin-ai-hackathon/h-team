import { colors } from "./theme";
import type { Farmer, Fulfillment, PickupSlot, Product, Reservation, ReservationStatus } from "./types";

export const CARRIER = "ヤマト運輸";
export const SHIPPING_FEE = 880;
export const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

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

export function paymentPill(r: Pick<Reservation, "paymentStatus" | "paymentMethod" | "status">) {
  if (r.paymentStatus === "paid") {
    return { label: r.paymentMethod === "cash" ? "現地払い済み" : "支払い済み", bg: colors.greenBg, color: colors.greenText };
  }
  if (r.status === "declined" || r.status === "cancelled") return null;
  return { label: "未払い", bg: colors.fewBg, color: colors.fewText };
}

export const methodLabel = (m: Fulfillment) => (m === "pickup" ? "取りに行く" : `発送（${CARRIER}）`);

export function fmtDateTime(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}（${DAY_NAMES[d.getDay()]}） ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function fmtDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function fmtExpected(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}（${DAY_NAMES[d.getDay()]}）出荷予定`;
}

/** Days (from tomorrow, up to `n` days ahead) on which the farmer accepts pickups, with the selectable hours. */
export function pickupDaysFor(slots: PickupSlot[], n = 14) {
  const out: { label: string; date: Date; hours: number[] }[] = [];
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const hours = new Set<number>();
    for (const s of slots) {
      if (!s.days.includes(d.getDay())) continue;
      for (let h = s.start; h < s.end; h++) hours.add(h);
    }
    if (hours.size === 0) continue;
    out.push({ label: i === 1 ? "明日" : `${d.getMonth() + 1}/${d.getDate()} ${DAY_NAMES[d.getDay()]}`, date: d, hours: [...hours].sort((a, b) => a - b) });
  }
  return out;
}

export const HOUR_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 6); // 6..20
