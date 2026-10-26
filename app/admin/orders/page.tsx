"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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
  }, [router]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    await fetch("/api/orders", {
      method: "PUT",
      body: JSON.stringify({ orderId, status: newStatus }),
    });
  };

  const getStepStatus = (currentStatus: string, stepName: string) => {
    // Map your database statuses to the 3 visual steps
    const statusMap: any = {
      "Pending": 0,
      "In the Oven": 1,
      "Packaged": 1,
      "Out for Delivery": 1,
      "Delivered": 2
    };
    
    const currentLevel = statusMap[currentStatus] || 0;
    const stepLevel = ["Pending", "Packaged", "Delivered"].indexOf(stepName);
    
    if (stepLevel < currentLevel) return "completed";
    if (stepLevel === currentLevel) return "active";
    return "inactive";
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
          {orders.map((o) => {
            const isExpanded = expandedOrder === o.id;
            let items: any[] = [];
            try { items = JSON.parse(o.items); } catch (e) {}

            return (
              <li key={o.id} className="group border-b border-[#2C1A1D]/10 transition-colors">
                
                {/* COMPACT TABLE ROW */}
                <button 
                  onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                  className="w-full flex items-center gap-4 py-4 px-2 hover:bg-white text-left transition-colors"
                >
                  <div className="w-full md:w-[120px] shrink-0">
                    <p className="text-[13.5px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{o.id}</p>
                    <p className="mt-0.5 text-[11.5px] text-[#2C1A1D]/50">{new Date(o.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-[#2C1A1D]">{o.customerName}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[#2C1A1D]/50">{o.phone}</p>
                  </div>

                  <div className="w-[120px] shrink-0">
                    <span className={`inline-block w-full text-center rounded-md border px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                      o.status === "Delivered" ? "border-green-200 bg-green-50 text-green-700" :
                      o.status === "Out for Delivery" ? "border-blue-200 bg-blue-50 text-blue-700" :
                      o.status === "In the Oven" ? "border-amber-200 bg-amber-50 text-amber-700" :
                      "border-[#2C1A1D]/20 bg-[#EBE0D3] text-[#2C1A1D]"
                    }`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      {o.status === "In the Oven" ? "Baking" : o.status === "Out for Delivery" ? "Shipping" : o.status}
                    </span>
                  </div>

                  <div className="w-[100px] shrink-0 text-right md:text-left">
                    {/* POUNDS CONVERSION */}
                    <p className="text-[14px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>£{o.total?.toLocaleString()}</p>
                  </div>

                  <div className="w-8 shrink-0 flex justify-end">
                    <svg className={`w-4 h-4 text-[#2C1A1D]/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div className="bg-[#FBF9F5] p-6 md:p-8 border-t border-[#2C1A1D]/5">
                    
                    {/* 3-STEP PROGRESS BAR */}
                    <div className="mb-10 max-w-lg">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/50 mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Order Status</p>
                      <div className="relative flex justify-between">
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#EBE0D3] -translate-y-1/2 z-0" />
                        
                        {["Pending", "Packaged", "Delivered"].map((step) => {
                          const status = getStepStatus(o.status || "Pending", step);
                          const isActive = status === "active" || status === "completed";
                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                              <div className={`flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] transition-all bg-[#FBF9F5] ${
                                isActive ? "bg-[#2C1A1D] border-[#2C1A1D] text-[#FBF9F5]" : "border-[#EBE0D3] text-transparent"
                              }`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-[#2C1A1D]" : "text-[#2C1A1D]/30"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* CUSTOMER INFO */}
                      <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#2C1A1D] mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Customer Details</h4>
                        <div className="bg-white p-4 rounded-lg border border-[#2C1A1D]/10 text-[13px] text-[#2C1A1D]/70 space-y-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          <p className="font-bold text-[#2C1A1D]">{o.customerName}</p>
                          <p>{o.phone}</p>
                          <p>{o.address}</p>
                        </div>

                        {/* UPDATE STATUS DROPDOWN */}
                        <div className="mt-4">
                          <label className="text-[11px] font-bold text-[#2C1A1D]/60 uppercase" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Update Status</label>
                          <select 
                            value={o.status} 
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            className="w-full mt-1 rounded-md border border-[#2C1A1D]/20 bg-white px-3 py-2 text-[12px] outline-none focus:border-[#2C1A1D]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In the Oven">Baking</option>
                            <option value="Out for Delivery">Shipping</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      {/* ORDER ITEMS */}
                      <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#2C1A1D] mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Items Ordered</h4>
                        <div className="bg-white rounded-lg border border-[#2C1A1D]/10 overflow-hidden">
                          {items.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 border-b border-[#2C1A1D]/5 last:border-0">
                              {item.image && (
                                <div className="relative h-10 w-10 shrink-0 rounded bg-[#EBE0D3] overflow-hidden">
                                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-[12px] font-bold text-[#2C1A1D]">{item.title}</p>
                                <p className="text-[11px] text-[#2C1A1D]/50">Size: {item.size} | Qty: {item.qty}</p>
                              </div>
                              <p className="text-[12px] font-bold text-[#2C1A1D]">£{(item.price * item.qty).toLocaleString()}</p>
                            </div>
                          ))}
                          <div className="p-3 bg-[#FBF9F5] border-t border-[#2C1A1D]/10 flex justify-between items-center">
                            <span className="text-[11px] font-bold uppercase text-[#2C1A1D]/50">Total Paid</span>
                            <span className="text-[14px] font-bold text-[#2C1A1D]">£{o.total?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
