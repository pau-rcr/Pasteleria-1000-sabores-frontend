import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { CartItem, OrderSummary } from "@/models/order";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import { calculateOrderTotals } from "@/utils/discounts";

interface CartState {
  items: CartItem[];
}

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number, messageForCake?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateMessage: (productId: number, message: string) => void;
  clearCart: () => void;
  getSummary: (user: User | null) => OrderSummary & { discountDetails: import("@/models/order").DiscountDetails };
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "UPDATE_MESSAGE"; payload: { productId: number; message: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id
      );
      
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
          messageForCake: action.payload.messageForCake || newItems[existingIndex].messageForCake,
        };
        return { items: newItems };
      }
      
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.product.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "UPDATE_MESSAGE":
      return {
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, messageForCake: action.payload.message }
            : item
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const cartStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CART_ITEMS);
      if (cartStr) {
        const items = JSON.parse(cartStr) as CartItem[];
        dispatch({ type: "LOAD_CART", payload: items });
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CART_ITEMS, JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [state.items]);

  const addItem = (product: Product, quantity = 1, messageForCake?: string) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity, messageForCake },
    });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    }
  };

  const updateMessage = (productId: number, message: string) => {
    dispatch({ type: "UPDATE_MESSAGE", payload: { productId, message } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getSummary = (user: User | null) => {
    return calculateOrderTotals(state.items, user);
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        updateMessage,
        clearCart,
        getSummary,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
