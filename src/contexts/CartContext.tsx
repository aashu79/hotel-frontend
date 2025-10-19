import React, { createContext, useContext, ReactNode } from "react";
import { useCartStore } from "../store/cartStore";

// Re-export types and store for convenience
export { useCartStore } from "../store/cartStore";
export type { MenuItem, CartItem } from "../store/cartStore";

interface CartState {
  items: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    vegetarian?: boolean;
    quantity: number;
  }>;
  total: number;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        image?: string;
        vegetarian?: boolean;
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const cartStore = useCartStore();

  // Create a dispatch function that maps old actions to new Zustand actions
  const dispatch = (action: CartAction) => {
    switch (action.type) {
      case "ADD_ITEM":
        cartStore.addItem(action.payload);
        break;
      case "REMOVE_ITEM":
        cartStore.removeItem(action.payload);
        break;
      case "UPDATE_QUANTITY":
        cartStore.updateQuantity(action.payload.id, action.payload.quantity);
        break;
      case "CLEAR_CART":
        cartStore.clearCart();
        break;
    }
  };

  const state: CartState = {
    items: cartStore.items,
    total: cartStore.total,
  };

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
