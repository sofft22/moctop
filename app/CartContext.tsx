"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: any, size: string, qty: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          qty: newCart[existingItemIndex].qty + qty,
        };
        return newCart;
      }

      return [
        ...prevCart,
        { 
          ...product, 
          size, 
          qty, 
          cartId: `${product.id}-${size}-${Date.now()}`
        }
      ];
    });
  };

  const updateQty = (cartId: string, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, qty: newQty } : item))
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // ADDED CLEAR CART FUNCTION
  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const cartTotal = cart.reduce((total, item) => {
    const price = typeof item.price === "number" 
      ? item.price 
      : parseInt(String(item.price).replace(/[^0-9]/g, ""), 10);
    return total + (price * item.qty);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQty, 
      clearCart, // <-- ADDED HERE
      cartCount, 
      cartTotal, 
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);