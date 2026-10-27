"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  const [newStatus, setNewStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadOrders = async () => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    
    const normalizedData = data.map((o: any) => {
      let s = o.status || "Pending";
      if (s === "Out for Delivery" || s === "Packaged") s = "Shipping";
      return { ...o, status: s };
    });
    
    setOrders(normalizedData);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [router]);

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Pending");
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    
    await fetch("/api/orders", {
      method: "PUT",
      body: JSON.stringify({ orderId: selectedOrder.id, status: newStatus }),
    });
    
    setIsSaving(false);
    setSelectedOrder(null);
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const shippingCount = orders.filter(o => o.status === "Shipping").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;

  const getStepStatus = (currentStatus: string, stepName: string) => {
    const statusMap: any = { "Pending": 0, "Shipping": 1, "Delivered": 2 };
    const currentLevel = statusMap[currentStatus] || 0;
    const stepLevel = ["Pending", "Shipping", "Delivered"].indexOf(stepName);
    
    if (stepLevel < currentLevel) return "completed";
    if (stepLevel === currentLevel) return "active";
    return "inactive";
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5] relative">
      
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Sales</p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Orders</h1>
      </div>

      {/* CATEGORY TABS */}
      <div className="mb-6 border-b border-[#2C1A1D]/10 pb-3 flex items-center gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "All Orders", count: orders.length },
          { id: "Pending", label: "Pending", count: pendingCount },
          { id: "Shipping", label: "Shipping", count: shippingCount },
          { id: "Delivered", label: "Delivered", count: deliveredCount },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative shrink-0 pb-3 text-[12px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab.id ? "text-[#2C1A1D]" : "text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`}
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {tab.label} <span className={`ml-1 text-[10px] ${activeTab === tab.id ? "text-[#2C1A1D]" : "text-[#2C1A1D]/30"}`}>{tab.count}</span>
            {activeTab === tab.id && <span className="absolute -bottom-[13px] left-0 h-[2px] w-full bg-[#2C1A1D]" />}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>
      ) : filteredOrders.length === 0 ? (
        <p className="py-24 text-center text-[13.5px] font-medium text-[#2C1A1D]/50">No orders found.</p>
      ) : (
        <ul className="flex flex-col border-t border-[#2C1A1D]/10">
          {filteredOrders.map((o) => (
            <li key={o.id} className="border-b border-[#2C1A1D]/10 transition-colors">
              
              <button 
                onClick={() => handleOpenModal(o)}
                className="w-full flex items-center justify-between md:justify-start gap-4 py-4 px-2 hover:bg-white text-left transition-colors"
              >
                <div className="w-[100px] md:w-[120px] shrink-0">
                  <p className="text-[13px] md:text-[13.5px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{o.id}</p>
                  <p className="mt-0.5 text-[11px] md:text-[11.5px] text-[#2C1A1D]/50">{new Date(o.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p>
                </div>

                <div className="hidden md:block flex-1 min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[#2C1A1D]">{o.customerName}</p>
                  <p className="mt-0.5 truncate text-[12px] text-[#2C1A1D]/50">{o.phone}</p>
                </div>

                <div className="w-[90px] md:w-[120px] shrink-0 text-center md:text-left">
                  <span className={`inline-block w-full text-center rounded-md border px-2 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                    o.status === "Delivered" ? "border-green-200 bg-green-50 text-green-700" :
                    o.status === "Shipping" ? "border-blue-200 bg-blue-50 text-blue-700" :
                    "border-[#2C1A1D]/20 bg-[#EBE0D3] text-[#2C1A1D]"
                  }`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {o.status || "Pending"}
                  </span>
                </div>

                <div className="w-[70px] md:w-[100px] shrink-0 text-right">
                  <p className="text-[13px] md:text-[14px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>£{o.total?.toLocaleString()}</p>
                </div>
              </button>

            </li>
          ))}
        </ul>
      )}

      {/* ===== FULL-SCREEN MOBILE MODAL (FIXED CUT OFF) ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex bg-black/50 backdrop-blur-sm sm:p-6 items-end sm:items-center justify-center" onClick={() => setSelectedOrder(null)}>
          
          {/* Using fixed inset-0 on mobile with pb-safe to prevent cutting off */}
          <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-[700px] sm:rounded-xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-200">
            
            {/* Modal Header (Sticky so it never cuts off) */}
            <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 bg-white px-6 py-4 shrink-0">
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Order {selectedOrder.id}</h2>
                <p className="text-[11px] md:text-[12px] text-[#2C1A1D]/50 mt-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  {new Date(selectedOrder.date).toLocaleDateString("en-NG", { weekday: 'long', day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBF9F5] text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8">
              
              <div className="mb-10 px-2 md:px-0">
                <div className="relative flex justify-between">
                  <div className="absolute top-[14px] left-4 right-4 h-[2px] bg-[#EBE0D3] -translate-y-1/2 z-0" />
                  
                  {["Pending", "Shipping", "Delivered"].map((step) => {
                    const status = getStepStatus(newStatus || selectedOrder.status || "Pending", step);
                    const isActive = status === "active" || status === "completed";
                    
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border-[2px] transition-all duration-300 ${
                          isActive ? "bg-[#2C1A1D] border-[#2C1A1D] text-[#FBF9F5]" : "bg-[#FBF9F5] border-[#EBE0D3] text-transparent"
                        }`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3.5 w-3.5 md:h-4 md:w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-[#2C1A1D]" : "text-[#2C1A1D]/30"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/50 mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Customer Details</h4>
                  <div className="bg-white p-4 rounded-lg border border-[#2C1A1D]/10 text-[13px] text-[#2C1A1D]/70 shadow-sm" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    <p className="font-bold text-[#2C1A1D] text-[14px] mb-1">{selectedOrder.customerName}</p>
                    <p>{selectedOrder.phone}</p>
                    <p>{selectedOrder.address}</p>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/50 mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Update Status</h4>
                    <select 
                      value={newStatus} 
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[13px] font-bold uppercase tracking-wider outline-none focus:border-[#2C1A1D] transition-colors"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/50 mb-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Items Ordered</h4>
                  <div className="bg-white rounded-lg border border-[#2C1A1D]/10 overflow-hidden shadow-sm">
                    {JSON.parse(selectedOrder.items).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-4 border-b border-[#2C1A1D]/5 last:border-0">
                        {item.image && (
                          <div className="relative h-12 w-12 shrink-0 rounded bg-[#EBE0D3] overflow-hidden">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-[13px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item.title}</p>
                          <p className="text-[11px] text-[#2C1A1D]/50">Size: {item.size} | Qty: {item.qty}</p>
                        </div>
                        <p className="text-[13px] font-bold text-[#2C1A1D]">£{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    ))}
                    
                    <div className="p-4 bg-[#FBF9F5] border-t border-[#2C1A1D]/10 flex flex-col gap-2">
                      <div className="flex justify-between text-[12px] text-[#2C1A1D]/60">
                        <span>Subtotal</span><span>£{selectedOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[12px] text-[#2C1A1D]/60">
                        <span>Delivery</span><span>£{selectedOrder.deliveryFee?.toLocaleString()}</span>
                      </div>
                      {selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between text-[12px] text-green-600 font-bold">
                          <span>Discount</span><span>-£{selectedOrder.discountAmount?.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[15px] font-bold text-[#2C1A1D] border-t border-[#2C1A1D]/10 pt-2 mt-1">
                        <span>Total Paid</span><span>£{selectedOrder.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SAVE BUTTON (Pinned to bottom, padded for mobile safe area) */}
            <div className="p-4 md:p-6 pb-8 md:pb-6 bg-white border-t border-[#2C1A1D]/10 shrink-0">
              <button 
                onClick={handleSaveStatus} 
                disabled={isSaving || newStatus === selectedOrder.status}
                className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
