"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  
  const [settings, setSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState<"paystack" | "whatsapp" | null>(null);
  const [saveDetails, setSaveDetails] = useState(false);

  // Delivery Zone State
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      setSettings(data);
      if (data.deliveryZones) {
        const parsedZones = JSON.parse(data.deliveryZones);
        setZones(parsedZones);
        if (parsedZones.length > 0) setSelectedZone(parsedZones[0]);
      }
    });

    // Load saved details from LocalStorage
    const saved = localStorage.getItem("mocktopia_customer_details");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFirstName(parsed.firstName || "");
      setLastName(parsed.lastName || "");
      setPhone(parsed.phone || "");
      setEmail(parsed.email || "");
      setAddress(parsed.address || "");
      setCity(parsed.city || "");
    }
  }, []);

  // Calculate shipping based on selected zone
  const shipping = selectedZone ? selectedZone.price : 0;
  const total = cartTotal + shipping;
  
  const canSubmit = Boolean(firstName.trim() && lastName.trim() && phone.trim() && address.trim() && city.trim() && payment && selectedZone);

  const handlePlaceOrder = async () => {
    if (!canSubmit || !payment) return;
    setIsSubmitting(true);
    
    // Save details if checkbox is ticked
    if (saveDetails) {
      localStorage.setItem("mocktopia_customer_details", JSON.stringify({
        firstName, lastName, phone, email, address, city
      }));
    }

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
        address: `${address}, ${city}`,
        city,
        items,
        subtotal: cartTotal,
        deliveryFee: shipping,
        total,
        paymentMethod: payment,
        deliveryZone: selectedZone.name, // Save the zone name too
      }),
    });

    setPlacedOrderId(orderId);
    setIsSubmitting(false);
    clearCart();
  };

  // ===== SUCCESS SCREEN =====
  if (placedOrderId) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col">
        <header className="flex h-[72px] items-center justify-center border-b border-[#2C1A1D]/10">
          <Link href="/" className="text-[20px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>Mocktopia</Link>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-10 w-10"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-[32px] text-[#2C1A1D] md:text-[40px]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Order Received</h1>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Thank you, {firstName}. We've received your order <strong>{placedOrderId}</strong>.
          </p>
          
          <div className="mt-8 flex flex-col gap-3 w-full max-w-[300px]">
            <Link href="/my-orders" className="w-full rounded-md bg-[#2C1A1D] py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Track Order</Link>
            <Link href="/" className="w-full rounded-md border border-[#2C1A1D]/20 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#2C1A1D]/5" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== CHECKOUT FORM =====
  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col">
      <header className="flex h-[72px] items-center justify-between px-6 border-b border-[#2C1A1D]/10 max-w-[800px] mx-auto w-full">
        <Link href="/" className="text-[20px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>Mocktopia</Link>
        <Link href="/shop" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/50 hover:text-[#2C1A1D]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>Cancel</Link>
      </header>

      <div className="mx-auto w-full max-w-[600px] px-6 py-10">
        <h1 className="text-[32px] text-[#2C1A1D] mb-8" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Checkout</h1>

        {/* CONTACT */}
        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Contact</h2>
          <div className="flex flex-col gap-3">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address (Optional)" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="Phone Number" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
          </div>
        </div>

        {/* DELIVERY */}
        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Delivery</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="First Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Last Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Street Address" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
          </div>
          
          {/* LOCATION SELECTOR */}
          <select 
            value={selectedZone?.name || ""} 
            onChange={(e) => {
              const zone = zones.find(z => z.name === e.target.value);
              setSelectedZone(zone);
            }}
            className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]"
          >
            {zones.map((z) => (
              <option key={z.name} value={z.name}>{z.name} — £{z.price.toFixed(2)}</option>
            ))}
          </select>
        </div>

        {/* PAYMENT */}
        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Payment</h2>
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

        {/* SAVE DETAILS TOGGLE */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[#2C1A1D]">Save my details for next time</p>
            <p className="text-[11px] text-[#2C1A1D]/60">We'll remember your address and contact info.</p>
          </div>
          <button onClick={() => setSaveDetails(!saveDetails)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${saveDetails ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${saveDetails ? "translate-x-[22px]" : "translate-x-0.5"}`} />
          </button>
        </div>

        {/* SUMMARY */}
        <div className="rounded-md border border-[#2C1A1D]/10 bg-white p-4 mb-8">
          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2"><span>Subtotal</span><span>£{cartTotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2"><span>Delivery ({selectedZone?.name})</span><span>£{shipping.toFixed(2)}</span></div>
          <div className="flex justify-between border-t border-[#2C1A1D]/10 pt-3 text-[16px] font-bold text-[#2C1A1D]"><span>Total</span><span>£{total.toFixed(2)}</span></div>
        </div>

        <button onClick={handlePlaceOrder} disabled={!canSubmit || isSubmitting} className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] disabled:opacity-50 hover:bg-[#1F1315]">
          {isSubmitting ? "Processing..." : `Place Order — £${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}