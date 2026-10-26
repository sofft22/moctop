"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. On first load, read from localStorage ONLY after the browser is ready
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem("mocktopia_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // 2. Whenever the cart changes, save it to localStorage (but ONLY if we are mounted)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("mocktopia_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: any, size: string, qty: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          cartId: `${product.id}-${size}-${Date.now()}`,
          size,
          qty,
        },
      ];
    });
    setIsCartOpen(true); 
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
