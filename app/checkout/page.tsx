"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);

  // Promo State
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState("");
  const [checkingPromo, setCheckingPromo] = useState(false);

  useEffect(() => {
    // Only load saved customer details from localStorage. 
    // The slow /api/settings fetch has been removed.
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

  // --- FIXED: Calculate Total Weight Safely ---
  const totalWeight = cart.reduce((total: number, item: any) => {
    let itemWeight = Number(item.weight) || 0;
    
    if (item.size && item.sizes) {
      let sizesArray: any[] = [];
      try {
        sizesArray = typeof item.sizes === "string" ? JSON.parse(item.sizes) : item.sizes;
      } catch (e) {
        sizesArray = [];
      }

      if (Array.isArray(sizesArray)) {
        const sizeObj = sizesArray.find((s: any) => s.name === item.size || s.size === item.size);
        if (sizeObj && sizeObj.weight !== undefined) {
          itemWeight = Number(sizeObj.weight);
        }
      }
    }
    
    return total + (itemWeight * item.qty);
  }, 0);

  // --- Calculate Shipping based on Weight ---
  let shipping = 0;
  if (totalWeight > 0) {
    if (totalWeight <= 2) {
      shipping = 4.80;
    } else if (totalWeight <= 20) {
      shipping = 7.50;
    } else {
      shipping = 7.50; // Fallback for over 20kg
    }
  }

  // Calculate Discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percentage") {
      discountAmount = Math.round((cartTotal * appliedPromo.value) / 100);
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const baseAmount = Math.max(0, cartTotal + shipping - discountAmount);
  const feePercentage = 0.015;
  const fixedFee = 0.20;
  const processingFee = Number((baseAmount * feePercentage + fixedFee).toFixed(2));
  const total = Number((baseAmount + processingFee).toFixed(2));
  
  const canSubmit = Boolean(firstName.trim() && lastName.trim() && phone.trim() && address.trim() && city.trim());

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setCheckingPromo(true);
    setPromoError("");

    const res = await fetch("/api/promos/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, phone: phone }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      setPromoError(data.error);
      setAppliedPromo(null);
    } else {
      setAppliedPromo(data.promo);
      setPromoError("");
    }
    setCheckingPromo(false);
  };

  const handlePlaceOrder = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    
    if (saveDetails) {
      localStorage.setItem("mocktopia_customer_details", JSON.stringify({
        firstName, lastName, phone, email, address, city
      }));
    }

    const orderId = `MCK-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Format items for local storage
    const items = cart.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""), 10),
      qty: item.qty,
      size: item.size,
      image: item.image,
      weight: item.weight
    }));

    localStorage.setItem(`pending_order_${orderId}`, JSON.stringify({
      orderId,
      customerName: `${firstName} ${lastName}`,
      phone,
      address: `${address}, ${city}`,
      city,
      items,
      subtotal: cartTotal,
      deliveryFee: shipping,
      discountAmount: discountAmount,
      promoCode: appliedPromo ? appliedPromo.code : null,
      processingFee: Math.round(processingFee * 100),
      total: Math.round(total * 100),
      paymentMethod: "Stripe",
    }));

    try {
      const stripeRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart, // SEND FULL CART
          customerDetails: { 
            email: email || "no-email@example.com", 
            customerName: `${firstName} ${lastName}`, 
            phone 
          },
          orderId: orderId,
          appliedPromoCode: appliedPromo ? appliedPromo.code : null,
        }),
      });

      const stripeData = await stripeRes.json();

      if (stripeData.url) {
        const savedOrders = JSON.parse(localStorage.getItem("mocktopia_my_orders") || "[]");
        if (!savedOrders.includes(orderId)) {
          savedOrders.push(orderId);
          localStorage.setItem("mocktopia_my_orders", JSON.stringify(savedOrders));
        }
        
        clearCart();
        window.location.href = stripeData.url; 
      } else {
        alert(`Payment setup failed: ${stripeData.error || "Unknown error"}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong connecting to Stripe.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col">
      <section id="hero" className="bg-[#2C1A1D] pt-[88px] pb-16 px-6 md:pt-[104px] md:pb-24 md:px-12">
        <div className="mx-auto max-w-[600px]">
          <h1 className="text-[36px] md:text-[48px] text-[#FBF9F5]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Checkout</h1>
          <p className="mt-2 text-[14px] text-[#FBF9F5]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Complete your details below to place your order.</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[600px] px-6 -mt-8 md:-mt-12 pb-24 relative z-10">
        
        <div className="mb-8 rounded-lg border border-[#2C1A1D]/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Your Order</h2>
          <div className="flex flex-col gap-4 mb-4 border-b border-[#2C1A1D]/10 pb-4">
            {cart.map((item: any) => {
              const itemPrice = typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""), 10);
              return (
                <div key={item.cartId} className="flex items-center gap-4">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3]">
                    {/* ADDED unoptimized={true} TO FIX SLOW LOADING */}
                    <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized={true} />
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
          
          <div className="mb-4">
            <div className="flex gap-2">
              <input 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())} 
                type="text" 
                placeholder="Promo Code" 
                className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-2 text-[13px] outline-none focus:border-[#2C1A1D]" 
              />
              <button onClick={handleApplyPromo} disabled={checkingPromo || !promoCode} className="rounded-md bg-[#EBE0D3] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D] hover:bg-[#DCD0C2] disabled:opacity-50 transition-colors">
                Apply
              </button>
            </div>
            {promoError && <p className="text-red-500 text-[11px] mt-1 font-bold">{promoError}</p>}
            {appliedPromo && <p className="text-green-600 text-[11px] mt-1 font-bold">Code {appliedPromo.code} applied!</p>}
          </div>

          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2"><span>Subtotal</span><span>£{cartTotal.toLocaleString()}</span></div>
          
          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2">
            <span>Delivery (Est. Weight: {totalWeight.toFixed(2)}kg)</span>
            <span>£{shipping.toFixed(2)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-[13px] text-green-600 font-bold mb-2"><span>Discount</span><span>-£{discountAmount.toLocaleString()}</span></div>
          )}

          <div className="flex justify-between text-[13px] text-[#2C1A1D]/60 mb-2">
            <span>Processing Fee</span>
            <span>£{processingFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-t border-[#2C1A1D]/10 pt-3 text-[16px] font-bold text-[#2C1A1D]"><span>Total</span><span>£{total.toFixed(2)}</span></div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Contact</h2>
          <div className="flex flex-col gap-3">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address (Optional)" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="Phone Number" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Delivery Address</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="First Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Last Name" required className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Street Address" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City" required className="col-span-2 w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
          </div>
        </div>

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
          {isSubmitting ? "Redirecting to Payment..." : `Place Order — £${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
