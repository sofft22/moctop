"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/CartContext";
import Link from "next/link";
import Image from "next/image";

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

  const shipping = selectedZone ? selectedZone.price : 0;
  const total = cartTotal + shipping;
  
  const canSubmit = Boolean(firstName.trim() && lastName.trim() && phone.trim() && address.trim() && city.trim() && selectedZone);

  const handlePlaceOrder = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    
    if (saveDetails) {
      localStorage.setItem("mocktopia_customer_details", JSON.stringify({
        firstName, lastName, phone, email, address, city
      }));
    }

    const orderId = `MCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = cart.map((item: any) => ({
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
        paymentMethod: "Paystack", 
        deliveryZone: selectedZone.name,
      }),
    });

    // SAVE TO LOCAL STORAGE FOR THE "MY ORDERS" PAGE
    const savedOrders = JSON.parse(localStorage.getItem("mocktopia_my_orders") || "[]");
    if (!savedOrders.includes(orderId)) {
      savedOrders.push(orderId);
      localStorage.setItem("mocktopia_my_orders", JSON.stringify(savedOrders));
    }

    setPlacedOrderId(orderId);
    setIsSubmitting(false);
    clearCart();
  };

  // ===== SUCCESS SCREEN =====
  if (placedOrderId) {
    const whatsappMessage = `Hi Mocktopia! I just placed order ${placedOrderId} (Total: £${total.toFixed(2)}). I'd like to speed up the delivery for this order. Can we arrange this?`;
    const whatsappUrl = `https://wa.me/2348178910628?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col">
        
        {/* CHOCOLATE HEADER SECTION FOR SUCCESS PAGE */}
        <section id="hero" className="bg-[#2C1A1D] pt-[88px] pb-16 px-6 md:pt-[104px] md:pb-24 md:px-12">
          <div className="mx-auto max-w-[600px]">
            <h1 className="text-[36px] md:text-[48px] text-[#FBF9F5]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              Order Confirmed
            </h1>
            <p className="mt-2 text-[14px] text-[#FBF9F5]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Thank you for shopping with Mocktopia.
            </p>
          </div>
        </section>

        <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-8 md:-mt-12 relative z-10 pb-12">
          
          <div className="bg-white rounded-xl border border-[#2C1A1D]/10 p-8 shadow-sm flex flex-col items-center max-w-[400px] w-full text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-10 w-10"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h2 className="text-[28px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Order Received</h2>
            
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Thank you, {firstName}. We've received your order <strong>{placedOrderId}</strong>.
            </p>
            
            <div className="mt-8 flex flex-col gap-3 w-full">
              {/* PRIMARY CTA: Speed Up Delivery */}
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full rounded-md bg-[#2C1A1D] py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] flex items-center justify-center gap-2" 
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Speed Up Delivery
              </a>

              {/* SECONDARY CTA: Track Order */}
              <Link 
                href="/my-orders" 
                className="w-full rounded-md border border-[#2C1A1D]/20 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#2C1A1D]/5" 
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== CHECKOUT FORM =====
  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col">
      
      {/* CHOCOLATE HEADER SECTION (id="hero" stops transparency) */}
      <section id="hero" className="bg-[#2C1A1D] pt-[88px] pb-16 px-6 md:pt-[104px] md:pb-24 md:px-12">
        <div className="mx-auto max-w-[600px]">
          <h1 className="text-[36px] md:text-[48px] text-[#FBF9F5]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            Checkout
          </h1>
          <p className="mt-2 text-[14px] text-[#FBF9F5]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Complete your details below to place your order.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[600px] px-6 -mt-8 md:-mt-12 pb-24 relative z-10">
        
        {/* ORDER SUMMARY WITH IMAGES */}
        <div className="mb-8 rounded-lg border border-[#2C1A1D]/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Your Order</h2>
          <div className="flex flex-col gap-4 mb-4 border-b border-[#2C1A1D]/10 pb-4">
            {cart.map((item: any) => {
              const itemPrice = typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""), 10);
              return (
                <div key={item.cartId} className="flex items-center gap-4">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3]">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{item.title}</p>
                    <p className="text-[11px] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item.size} • Qty {item.qty}</p>
                  </div>
                  <p className="text-[13px] font-semibold text-[#2C1A1D]">£{(itemPrice * item.qty).toLocaleString()}</p>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2"><span>Subtotal</span><span>£{cartTotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2"><span>Delivery</span><span>£{shipping.toFixed(2)}</span></div>
          <div className="flex justify-between border-t border-[#2C1A1D]/10 pt-3 text-[16px] font-bold text-[#2C1A1D]"><span>Total</span><span>£{total.toFixed(2)}</span></div>
        </div>

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
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="First Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Last Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Street Address" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
          </div>
          
          <div className="mt-2">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Delivery Location</label>
            <select 
              value={selectedZone?.name || ""} 
              onChange={(e) => {
                const zone = zones.find(z => z.name === e.target.value);
                setSelectedZone(zone);
              }}
              className="w-full appearance-none rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]"
            >
              {zones.length === 0 && <option value="">Loading locations...</option>}
              {zones.map((z) => (
                <option key={z.name} value={z.name}>{z.name} — £{z.price.toFixed(2)}</option>
              ))}
            </select>
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

        <button onClick={handlePlaceOrder} disabled={!canSubmit || isSubmitting} className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] disabled:opacity-50 hover:bg-[#1F1315] transition-colors">
          {isSubmitting ? "Processing..." : `Place Order — £${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
