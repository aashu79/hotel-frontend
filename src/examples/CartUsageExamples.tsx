/**
 * Example Usage of New Cart System
 *
 * This file demonstrates how to use the updated cart with Zustand and session storage
 */

import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/contexts/CartContext";

// ============================================
// OPTION 1: Using Context API (Backward Compatible)
// ============================================
export function CartExample_ContextAPI() {
  const { state, dispatch } = useCart();

  const addMomoToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: "1",
        name: "Chicken Momo",
        description: "Steamed chicken dumplings",
        price: 12.99,
        category: "Appetizers",
        image: "https://example.com/momo.jpg", // ✅ Image included
        vegetarian: false,
      },
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  return (
    <div>
      <h2>Cart Items ({state.items.length})</h2>
      {state.items.map((item) => (
        <div key={item.id}>
          {/* ✅ Image is available */}
          {item.image && <img src={item.image} alt={item.name} />}
          <h3>{item.name}</h3>
          <p>${item.price}</p>
          <p>Qty: {item.quantity}</p>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${state.total.toFixed(2)}</p>
      <button onClick={addMomoToCart}>Add Momo</button>
    </div>
  );
}

// ============================================
// OPTION 2: Direct Zustand Usage (Recommended for new code)
// ============================================
export function CartExample_Zustand() {
  // Select only what you need for better performance
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const addMomoToCart = () => {
    addItem({
      id: "1",
      name: "Chicken Momo",
      description: "Steamed chicken dumplings",
      price: 12.99,
      category: "Appetizers",
      image: "https://example.com/momo.jpg", // ✅ Image included
      vegetarian: false,
    });
  };

  return (
    <div>
      <h2>Cart Items ({items.length})</h2>
      {items.map((item) => (
        <div key={item.id}>
          {/* ✅ Image is available */}
          {item.image && <img src={item.image} alt={item.name} />}
          <h3>{item.name}</h3>
          <p>${item.price}</p>
          <p>Qty: {item.quantity}</p>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={addMomoToCart}>Add Momo</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

// ============================================
// TESTING SESSION STORAGE
// ============================================
export function TestSessionStorage() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const addTestItem = () => {
    addItem({
      id: Date.now().toString(),
      name: "Test Item",
      description: "Testing persistence",
      price: 9.99,
      category: "Test",
      image: "https://via.placeholder.com/150",
      vegetarian: true,
    });
  };

  const checkStorage = () => {
    const stored = sessionStorage.getItem("cart-storage");
    console.log("Session Storage Data:", JSON.parse(stored || "{}"));
  };

  return (
    <div>
      <h2>Session Storage Test</h2>
      <p>Items in cart: {items.length}</p>
      <button onClick={addTestItem}>Add Test Item</button>
      <button onClick={checkStorage}>Check Storage (Console)</button>
      <button onClick={clearCart}>Clear Cart</button>
      <p>Try: Add items → Refresh page → Items should persist!</p>
    </div>
  );
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
export function OptimizedCartCounter() {
  // Only subscribe to items length, not the entire state
  const itemCount = useCartStore((state) => state.items.length);

  // This component only re-renders when items.length changes
  // Not when quantities or other properties change
  return <div>Cart ({itemCount})</div>;
}

export function OptimizedCartTotal() {
  // Only subscribe to total
  const total = useCartStore((state) => state.total);

  // This component only re-renders when total changes
  return <div>Total: ${total.toFixed(2)}</div>;
}

// ============================================
// ACCESSING STORE OUTSIDE COMPONENTS
// ============================================

// Get current cart state anywhere in your app
export function getCartSummary() {
  const state = useCartStore.getState();
  return {
    itemCount: state.items.length,
    total: state.total,
    items: state.items,
  };
}

// Add item from outside a component (e.g., in a service)
export function addItemFromService(item: any) {
  useCartStore.getState().addItem(item);
}

// Clear cart from outside a component
export function clearCartFromService() {
  useCartStore.getState().clearCart();
}

// ============================================
// REAL WORLD EXAMPLE: Menu Component
// ============================================
export function MenuItemCard({ item }: { item: any }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.categoryName || "Uncategorized",
      image: item.imageUrl, // ✅ From API
      vegetarian: item.isVegetarian,
    });

    // Show success message (Ant Design)
    // message.success({ content: `${item.name} added to cart` });
  };

  return (
    <div>
      {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>${item.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
