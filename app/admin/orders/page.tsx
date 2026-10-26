"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await fetch("/api/orders", {
      method: "PUT",
      body: JSON.stringify({ orderId, status: newStatus }),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Sales</p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>
      ) : orders.length === 0 ? (
        <p className="py-24 text-center text-[13.5px] font-medium text-[#2C1A1D]/50">No orders yet.</p>
      ) : (
        <ul className="flex flex-col border-t border-[#2C1A1D]/10">
          {orders.map((o) => (
            <li key={o.id} className="group flex flex-col md:flex-row md:items-center gap-4 border-b border-[#2C1A1D]/10 py-5 hover:bg-white px-2 transition-colors">
              
              <div className="w-full md:w-[120px] shrink-0">
                <p className="text-[13.5px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{o.id}</p>
                <p className="mt-0.5 text-[11.5px] text-[#2C1A1D]/50">{new Date(o.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p>
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-[#2C1A1D]">{o.customerName}</p>
                <p className="mt-0.5 truncate text-[12px] text-[#2C1A1D]/50">{o.phone}</p>
              </div>

              <div className="w-[120px] shrink-0">
                <select 
                  value={o.status} 
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className={`w-full rounded-md border px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none ${
                    o.status === "Delivered" ? "border-green-200 bg-green-50 text-green-700" :
                    o.status === "Out for Delivery" ? "border-blue-200 bg-blue-50 text-blue-700" :
                    o.status === "In the Oven" ? "border-amber-200 bg-amber-50 text-amber-700" :
                    "border-[#2C1A1D]/20 bg-[#EBE0D3] text-[#2C1A1D]"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In the Oven">Baking</option>
                  <option value="Out for Delivery">Shipping</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="w-[100px] shrink-0 text-right md:text-left">
                <p className="text-[14px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>₦{o.total.toLocaleString()}</p>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}