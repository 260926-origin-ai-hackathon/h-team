import { create } from "zustand";
import type { FarmerId, ProductId } from "./types";

export type Role = "consumer" | "farmer" | "admin";
export type FilterKind = "all" | "today" | "delivery" | "top";
export type CartItem = { productId: ProductId; quantity: number };
export type Cart = { farmerId: FarmerId; farmerName: string; items: CartItem[] } | null;

type AppState = {
  role: Role | null;
  userId: string;
  setIdentity: (role: Role, userId: string) => void;

  selectedFarmerId: FarmerId | null;
  selectFarmer: (id: FarmerId | null) => void;
  filter: FilterKind;
  setFilter: (f: FilterKind) => void;
  query: string;
  setQuery: (q: string) => void;

  /** Single-farmer cart: a reservation is always with one farmer. */
  cart: Cart;
  addToCart: (farmerId: FarmerId, farmerName: string, productId: ProductId, quantity: number) => "added" | "replaced";
  setQuantity: (productId: ProductId, quantity: number) => void;
  clearCart: () => void;

  toast: string | null;
  showToast: (msg: string) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<AppState>((set, get) => ({
  role: null,
  userId: "",
  setIdentity: (role, userId) => set({ role, userId, cart: null, selectedFarmerId: null }),

  selectedFarmerId: null,
  selectFarmer: (id) => set({ selectedFarmerId: id }),
  filter: "all",
  setFilter: (filter) => set({ filter }),
  query: "",
  setQuery: (query) => set({ query }),

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
  showToast: (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: null }), 1800);
  },
}));

export const cartCount = (cart: Cart) => cart?.items.reduce((a, c) => a + c.quantity, 0) ?? 0;
