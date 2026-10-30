"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // 1. Get the full order from local storage
    const pendingOrder = localStorage.getItem(`pending_order_${orderId}`);
    
    if (pendingOrder) {
      const orderData = JSON.parse(pendingOrder);

      // 2. Save to Database NOW
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }).then(() => {
        setSaved(true);
        localStorage.removeItem(`pending_order_${orderId}`); // Clean up
      });
    } else {
      setSaved(true); 
    }
  }, [orderId, router]);

  if (!saved) return <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>;

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-10 w-10"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-[32px] md:text-[40px] text-[#2C1A1D] mb-4" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Order Confirmed!</h1>
      <p className="text-[14px] text-[#2C1A1D]/60 mb-8 max-w-md" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Thank you for your purchase. Your order <strong>{orderId}</strong> has been received and is being prepared.
      </p>
      <Link href="/my-orders" className="rounded-md bg-[#2C1A1D] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
        View My Orders
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">Loading...</div>}><SuccessContent /></Suspense>;
}
