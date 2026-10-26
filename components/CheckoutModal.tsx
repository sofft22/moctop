"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/app/CartContext";
import { useRouter } from "next/navigation";

export function CheckoutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  
  const [settings, setSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState<"paystack" | "whatsapp" | null>(null);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => setSettings(data));
  }, []);

  const shipping = settings?.deliveryFee || 0;
  const total = cartTotal + shipping;
  
  const canSubmit = Boolean(firstName.trim() && lastName.trim() && phone.trim() && address.trim() && city.trim() && payment);

  const handlePlaceOrder = async () => {
    if (!canSubmit || !payment) return;
    setIsSubmitting(true);
    
    const orderId = `MCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = cart.map(item => ({
      id: item.id,
      title: item.title,
      price: typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""), 10),
      qty: item.qty,
      size: item.size,
      image: item.image
    }));

    await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        customerName: `${firstName} ${lastName}`,
        phone,
        address,
        city,
        items,
        subtotal: cartTotal,
        deliveryFee: shipping,
        total,
        paymentMethod: payment,
      }),
    });

    setIsSubmitting(false);
    clearCart();
    onClose();
    router.push("/my-orders");
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#FBF9F5] overflow-y-auto">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5]">
        <h1 className="text-[22px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Checkout</h1>
        <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      </div>

      <div className="mx-auto max-w-[600px] w-full px-6 py-8">
        
        {/* CONTACT */}
        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Contact</h2>
          <div className="flex flex-col gap-3">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address (Optional)" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="WhatsApp Phone Number" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
          </div>
        </div>

        {/* DELIVERY */}
        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Delivery</h2>
          <div className="grid grid-cols-2 gap-3">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="First Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Last Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Street Address" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
          </div>
        </div>

        {/* PAYMENT */}
        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Payment</h2>
          <div className="flex flex-col gap-3">
            <label className={`flex cursor-pointer items-center gap-4 rounded-md border p-4 ${payment === "paystack" ? "border-[#2C1A1D] bg-[#2C1A1D]/5" : "border-[#2C1A1D]/20 bg-white"}`}>
              <input type="radio" name="payment" checked={payment === "paystack"} onChange={() => setPayment("paystack")} className="h-4 w-4 accent-[#2C1A1D]" />
              <div><p className="text-[13px] font-semibold text-[#2C1A1D]">Pay with Card</p><p className="text-[11px] text-[#2C1A1D]/50">Secure payment via Paystack</p></div>
            </label>
            <label className={`flex cursor-pointer items-center gap-4 rounded-md border p-4 ${payment === "whatsapp" ? "border-[#2C1A1D] bg-[#2C1A1D]/5" : "border-[#2C1A1D]/20 bg-white"}`}>
              <input type="radio" name="payment" checked={payment === "whatsapp"} onChange={() => setPayment("whatsapp")} className="h-4 w-4 accent-[#2C1A1D]" />
              <div><p className="text-[13px] font-semibold text-[#2C1A1D]">Order via WhatsApp</p><p className="text-[11px] text-[#2C1A1D]/50">Complete your order on chat</p></div>
            </label>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="rounded-md border border-[#2C1A1D]/10 bg-white p-4 mb-8">
          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2"><span>Subtotal</span><span>₦{cartTotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2"><span>Delivery</span><span>₦{shipping.toLocaleString()}</span></div>
          <div className="flex justify-between border-t border-[#2C1A1D]/10 pt-3 text-[16px] font-bold text-[#2C1A1D]"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
        </div>

        <button onClick={handlePlaceOrder} disabled={!canSubmit || isSubmitting} className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] disabled:opacity-50 hover:bg-[#1F1315]">
          {isSubmitting ? "Processing..." : `Place Order — ₦${total.toLocaleString()}`}
        </button>

      </div>
    </div>
  );
}