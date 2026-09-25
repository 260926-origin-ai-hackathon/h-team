import { create } from "zustand";
import type { FarmerId, ProductId } from "./types";

export type CartItem = { productId: ProductId; farmerId: FarmerId; quantity: number };

type MapFilters = { query: string; crop: string | null; unlockedOnly: boolean };

type AppState = {
  selectedFarmerId: FarmerId | null;
  selectFarmer: (id: FarmerId | null) => void;

  filters: MapFilters;
  setFilters: (patch: Partial<MapFilters>) => void;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  setQuantity: (productId: ProductId, quantity: number) => void;
  clearCart: () => void;

  /** Farmers whose card reveal animation is pending (queued after purchase). */
  revealQueue: FarmerId[];
  enqueueReveal: (ids: FarmerId[]) => void;
  shiftReveal: () => void;
};

export const useStore = create<AppState>((set) => ({
  selectedFarmerId: null,
  selectFarmer: (id) => set({ selectedFarmerId: id }),

  filters: { query: "", crop: null, unlockedOnly: false },
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),

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
  enqueueReveal: (ids) => set((s) => ({ revealQueue: [...s.revealQueue, ...ids] })),
  shiftReveal: () => set((s) => ({ revealQueue: s.revealQueue.slice(1) })),
}));
