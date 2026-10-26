// Paste your CartContext here
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Load cart from LocalStorage when the app starts
  useEffect(() => {
    const savedCart = localStorage.getItem("mocktopia_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsMounted(true);
  }, []);

  // 2. Save cart to LocalStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("mocktopia_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: any, size: string, qty: number) => {
    setCart((prevCart) => {
      // Check if item with same ID and size already exists
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItem) {
        // Update quantity if it exists
        return prevCart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      // Add new item
      return [
        ...prevCart,
        {
          ...product,
          cartId: `${product.id}-${size}-${Date.now()}`, // Unique ID for cart
          size,
          qty,
        },
      ];
    });
    setIsCartOpen(true); // Auto-open cart when adding
  };

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("mocktopia_cart");
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
