"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useSyncExternalStore } from "react";

export interface CartItem {
  cartId: string;
  id: string;
  title: string;
  price: number;
  image: string;
  size: string;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, size: string, qty: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom event to trigger updates across the app
const dispatchCartUpdate = () => {
  window.dispatchEvent(new Event("cart-update"));
};

const subscribe = (callback: () => void) => {
  window.addEventListener("cart-update", callback);
  window.addEventListener("storage", callback); // Syncs across tabs
  return () => {
    window.removeEventListener("cart-update", callback);
    window.removeEventListener("storage", callback);
  };
};

const getSnapshot = () => {
  return localStorage.getItem("mocktopia_cart") || "[]";
};

const getServerSnapshot = () => {
  return "[]"; // Always empty on the server
};

export function CartProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore guarantees the server and client stay in sync
  const cartString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  // Parse the string from localStorage into an array
  let cart: CartItem[] = [];
  try {
    const parsed = JSON.parse(cartString);
    if (Array.isArray(parsed)) cart = parsed;
  } catch (e) {}

  const [isCartOpen, setIsCartOpen] = useState(false);

  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem("mocktopia_cart", JSON.stringify(newCart));
    dispatchCartUpdate(); // Tell React to re-render with the new data
  };

  const addToCart = (product: any, size: string, qty: number) => {
    const existingItem = cart.find(
      (item) => item.id === product.id && item.size === size
    );

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id && item.size === size
          ? { ...item, qty: item.qty + qty }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          ...product,
          cartId: `${product.id}-${size}-${Date.now()}`,
          size,
          qty,
        },
      ];
    }
    
    saveCart(newCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    const newCart = cart.filter((item) => item.cartId !== cartId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
