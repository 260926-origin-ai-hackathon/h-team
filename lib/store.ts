import { create } from "zustand";
import type { FarmerId, ProductId } from "./types";

export type Role = "consumer" | "farmer" | "admin";
export type Filters = { query: string; today: boolean; delivery: boolean; top: boolean; crop: string | null };
export type CartItem = { productId: ProductId; quantity: number };
export type Cart = { farmerId: FarmerId; farmerName: string; items: CartItem[] } | null;
export type Toast = { msg: string; action?: { label: string; href: string } };

export const EMPTY_FILTERS: Filters = { query: "", today: false, delivery: false, top: false, crop: null };

type AppState = {
  role: Role | null;
  userId: string;
  setIdentity: (role: Role, userId: string) => void;

  selectedFarmerId: FarmerId | null;
  selectFarmer: (id: FarmerId | null) => void;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;

  /** Single-farmer cart: a reservation is always with one farmer. */
  cart: Cart;
  addToCart: (farmerId: FarmerId, farmerName: string, productId: ProductId, quantity: number) => "added" | "replaced";
  setQuantity: (productId: ProductId, quantity: number) => void;
  clearCart: () => void;

  toast: Toast | null;
  showToast: (msg: string, action?: Toast["action"]) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<AppState>((set, get) => ({
  role: null,
  userId: "",
  setIdentity: (role, userId) => set({ role, userId, cart: null, selectedFarmerId: null, filters: EMPTY_FILTERS }),

  selectedFarmerId: null,
  selectFarmer: (id) => set({ selectedFarmerId: id }),
  filters: EMPTY_FILTERS,
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: EMPTY_FILTERS }),

  cart: null,
  addToCart: (farmerId, farmerName, productId, quantity) => {
    const cart = get().cart;
    if (cart && cart.farmerId === farmerId) {
      const existing = cart.items.find((c) => c.productId === productId);
      const items = existing
        ? cart.items.map((c) => (c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c))
        : [...cart.items, { productId, quantity }];
      set({ cart: { ...cart, items } });
      return "added";
    }
    set({ cart: { farmerId, farmerName, items: [{ productId, quantity }] } });
    return cart ? "replaced" : "added";
  },
  setQuantity: (productId, quantity) =>
    set((s) => {
      if (!s.cart) return {};
      const items =
        quantity <= 0
          ? s.cart.items.filter((c) => c.productId !== productId)
          : s.cart.items.map((c) => (c.productId === productId ? { ...c, quantity } : c));
      return { cart: items.length ? { ...s.cart, items } : null };
    }),
  clearCart: () => set({ cart: null }),

  toast: null,
  showToast: (msg, action) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { msg, action } });
    toastTimer = setTimeout(() => set({ toast: null }), action ? 3000 : 1800);
  },
}));

export const cartCount = (cart: Cart) => cart?.items.reduce((a, c) => a + c.quantity, 0) ?? 0;
export const activeFilterCount = (f: Filters) => Number(f.today) + Number(f.delivery) + Number(f.top) + Number(!!f.crop) + Number(!!f.query.trim());
