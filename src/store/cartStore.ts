import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  vegetarian?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartActions {
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      total: 0,

      // Actions
      addItem: (item: MenuItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            const updatedItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            return {
              items: updatedItems,
              total: calculateTotal(updatedItems),
            };
          } else {
            const newItems = [
              ...state.items,
              {
                ...item,
                quantity: 1,
                // Ensure image is included
                image: item.image || undefined,
              },
            ];
            return {
              items: newItems,
              total: calculateTotal(newItems),
            };
          }
        });
      },

      removeItem: (id: string) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        });
      },

      updateQuantity: (id: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((item) => item.id !== id);
            return {
              items: newItems,
              total: calculateTotal(newItems),
            };
          }

          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          return {
            items: updatedItems,
            total: calculateTotal(updatedItems),
          };
        });
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },

      getItemQuantity: (id: string) => {
        const item = get().items.find((i) => i.id === id);
        return item?.quantity || 0;
      },
    }),
    {
      name: "cart-storage", // name of the item in session storage
      storage: createJSONStorage(() => sessionStorage), // use session storage
    }
  )
);
