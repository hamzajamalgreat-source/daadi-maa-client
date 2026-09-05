import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart store — persisted to localStorage under 'daadi-cart'.
 *
 * Each cart item shape:
 * {
 *   id: number,        product id
 *   slug: string,
 *   name: string,
 *   price: number,
 *   image_url: string,
 *   category_name: string,
 *   quantity: number,
 * }
 */

const MAX_QUANTITY_PER_ITEM = 99;
const MIN_QUANTITY = 1;

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      // ── Drawer control ────────────────────────────────────────────────────
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

      // ── Add item ──────────────────────────────────────────────────────────
      addItem: (product, quantity = 1) => {
        // Sanitise quantity input
        const qty = Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY_PER_ITEM, parseInt(quantity) || 1));

        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            // Increment, capped at max
            const newQty = Math.min(existing.quantity + qty, MAX_QUANTITY_PER_ITEM);
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: newQty } : i
              ),
            };
          }
          // New item
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                category_name: product.category_name,
                quantity: qty,
                addedAt: Date.now(),
              },
            ],
          };
        });
      },

      // ── Remove item completely ────────────────────────────────────────────
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      // ── Update quantity — clamps to [1, 99], removes if 0 ─────────────────
      updateQuantity: (productId, quantity) => {
        const qty = parseInt(quantity);

        if (isNaN(qty) || qty < MIN_QUANTITY) {
          // Remove item if quantity drops below 1
          get().removeItem(productId);
          return;
        }

        const clamped = Math.min(qty, MAX_QUANTITY_PER_ITEM);
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity: clamped } : i
          ),
        }));
      },

      // ── Clear entire cart ─────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── Computed selectors ────────────────────────────────────────────────
      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      /** Total price in PKR, precise to 2 decimal places */
      get totalPrice() {
        const total = get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return Math.round(total * 100) / 100;
      },

      get isEmpty() {
        return get().items.length === 0;
      },
    }),
    {
      name: 'daadi-cart',
      // Only persist the items array, not drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
