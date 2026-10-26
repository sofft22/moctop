"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders").then(res => res.json()).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>;

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-16 px-6">
      <div className="mx-auto max-w-[800px]">
        <h1 className="text-[32px] text-[#2C1A1D] mb-8" style={{ fontFamily: "var(--font-dm-serif), serif" }}>My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-[14px] text-[#2C1A1D]/50">You haven't placed any orders yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border border-[#2C1A1D]/10 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-[#2C1A1D]/5 pb-3">
                  <div>
                    <p className="text-[14px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{order.id}</p>
                    <p className="text-[11px] text-[#2C1A1D]/50">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#EBE0D3] text-[#2C1A1D]">{order.status}</span>
                </div>
                
                <div className="flex flex-col gap-2 mb-4">
                  {JSON.parse(order.items).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-[13px] text-[#2C1A1D]/70">
                      <span>{item.qty}x {item.title} ({item.size})</span>
                      <span>₦{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center border-t border-[#2C1A1D]/5 pt-3">
                  <span className="text-[13px] font-bold text-[#2C1A1D]">Total</span>
                  <span className="text-[15px] font-bold text-[#2C1A1D]">₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}