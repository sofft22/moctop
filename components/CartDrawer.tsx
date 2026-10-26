"use client";

import { useCart } from "@/app/CartContext";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col bg-[#FBF9F5] shadow-2xl transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5">
          <h2 className="text-[20px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Your Bag</h2>
          <button onClick={() => setIsCartOpen(false)} className="flex h-8 w-8 items-center justify-center text-[#2C1A1D]/60 hover:text-[#2C1A1D]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[14px] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Your bag is empty.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map((item: any) => {
                const itemPrice = typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""), 10);
                return (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3]">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-[13px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{item.title}</h3>
                          <button onClick={() => removeFromCart(item.cartId)} className="text-[#2C1A1D]/40 hover:text-[#2C1A1D]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4"><path d="M6 6l12 12M18 6L6 18" /></svg>
                          </button>
                        </div>
                        <p className="text-[11px] text-[#2C1A1D]/50 mt-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item.size}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-stretch overflow-hidden rounded-md border border-[#2C1A1D]/20 bg-white">
                          <button onClick={() => updateQty(item.cartId, item.qty - 1)} className="flex h-8 w-8 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-[#FBF9F5]">−</button>
                          <span className="flex h-8 w-10 items-center justify-center text-[12px] font-bold text-[#2C1A1D]">{item.qty}</span>
                          <button onClick={() => updateQty(item.cartId, item.qty + 1)} className="flex h-8 w-8 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-[#FBF9F5]">+</button>
                        </div>
                        {/* CURRENCY CONVERTED TO £ */}
                        <p className="text-[13px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>£{(itemPrice * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#2C1A1D]/10 px-6 py-6 flex flex-col gap-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Subtotal</span>
              {/* CURRENCY CONVERTED TO £ */}
              <span className="text-[18px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>£{cartTotal.toLocaleString()}</span>
            </div>
            
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full rounded-md bg-[#2C1A1D] py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Checkout
            </Link>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="block w-full rounded-md border border-[#2C1A1D]/20 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#2C1A1D]/5"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
