import { create } from "zustand";
import type { FarmerId, ProductId } from "./types";

export type CartItem = { productId: ProductId; farmerId: FarmerId; quantity: number };
export type FilterKind = "all" | "today" | "owned" | "locked";
export type RevealItem = { farmerId: FarmerId; count: number };

type AppState = {
  selectedFarmerId: FarmerId | null;
  selectFarmer: (id: FarmerId | null) => void;

  filter: FilterKind;
  setFilter: (f: FilterKind) => void;
  query: string;
  setQuery: (q: string) => void;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  setQuantity: (productId: ProductId, quantity: number) => void;
  clearCart: () => void;

  /** Cards to reveal after a purchase, in order. */
  revealQueue: RevealItem[];
  enqueueReveal: (items: RevealItem[]) => void;
  shiftReveal: () => void;
  clearReveal: () => void;

  toast: string | null;
  showToast: (msg: string) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<AppState>((set) => ({
  selectedFarmerId: null,
  selectFarmer: (id) => set({ selectedFarmerId: id }),

  filter: "all",
  setFilter: (filter) => set({ filter }),
  query: "",
  setQuery: (query) => set({ query }),

  cart: [],
  addToCart: (item) =>
    set((s) => {
      const existing = s.cart.find((c) => c.productId === item.productId);
      if (existing) {
        return {
          cart: s.cart.map((c) =>
            c.productId === item.productId ? { ...c, quantity: c.quantity + item.quantity } : c,
          ),
        };
      }
      return { cart: [...s.cart, item] };
    }),
  setQuantity: (productId, quantity) =>
    set((s) => ({
      cart:
        quantity <= 0
          ? s.cart.filter((c) => c.productId !== productId)
          : s.cart.map((c) => (c.productId === productId ? { ...c, quantity } : c)),
    })),
  clearCart: () => set({ cart: [] }),

  revealQueue: [],
  enqueueReveal: (items) => set((s) => ({ revealQueue: [...s.revealQueue, ...items] })),
  shiftReveal: () => set((s) => ({ revealQueue: s.revealQueue.slice(1) })),
  clearReveal: () => set({ revealQueue: [] }),

  toast: null,
  showToast: (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: null }), 1600);
  },
}));

export const cartCount = (cart: CartItem[]) => cart.reduce((a, c) => a + c.quantity, 0);
