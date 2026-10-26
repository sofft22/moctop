"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Reference to the receipt we want to print
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/orders").then(res => res.json()).then(data => {
      setOrders(data);
      setLoading(false);
      // Auto-expand the most recent order
      if (data.length > 0) {
        setExpandedOrder(data[0].id);
      }
    });
  }, []);

  const handleDownloadReceipt = async (order: any) => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // High resolution
        backgroundColor: "#FBF9F5",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Mocktopia_Receipt_${order.id}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("There was an error downloading your receipt.");
    }
  };

  const getStepStatus = (orderStatus: string, stepName: string) => {
    const steps = ["Pending", "Packaged", "Delivered"];
    const currentIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(stepName);

    if (stepIndex <= currentIndex) return "active";
    return "inactive";
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      
      {/* CHOCOLATE HEADER SECTION WITH ID="HERO" TO TRIGGER TRANSPARENCY */}
      <section id="hero" className="bg-[#2C1A1D] pt-[88px] pb-16 px-6 md:pt-[104px] md:pb-24 md:px-12">
        <div className="mx-auto max-w-[800px]">
          <h1 className="text-[36px] md:text-[48px] text-[#FBF9F5]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            My Orders
          </h1>
          <p className="mt-2 text-[14px] text-[#FBF9F5]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Track your order or download your receipt.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[800px] px-6 -mt-8 md:px-12 md:-mt-12 pb-24 relative z-10">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#2C1A1D]/10 p-12 text-center shadow-sm">
            <p className="text-[15px] text-[#2C1A1D]/60 mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>You haven't placed any orders yet.</p>
            <Link href="/shop" className="bg-[#2C1A1D] text-[#FBF9F5] px-8 py-3.5 rounded-md text-[11px] font-bold uppercase tracking-widest inline-block transition-all hover:bg-[#1F1315]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const items = JSON.parse(order.items);
              
              return (
                <div key={order.id} className="bg-white rounded-xl border border-[#2C1A1D]/10 shadow-sm overflow-hidden">
                  
                  {/* Order Header (Click to Expand) */}
                  <button 
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FBF9F5] transition-colors"
                  >
                    <div>
                      <p className="text-[16px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{order.id}</p>
                      <p className="text-[12px] text-[#2C1A1D]/60 mt-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                        {new Date(order.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-[14px] font-bold text-[#2C1A1D] mt-2">£{order.total.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-[#EBE0D3] text-[#2C1A1D]"
                      }`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        {order.status}
                      </span>
                      <svg className={`w-5 h-5 text-[#2C1A1D]/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[#2C1A1D]/10 p-6 md:p-8 bg-[#FBF9F5]">
                      
                      {/* Tracking Bar */}
                      <div className="mb-10">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/50 mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Order Status</p>
                        <div className="relative flex justify-between">
                          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#EBE0D3] -translate-y-1/2 z-0" />
                          
                          {["Pending", "Packaged", "Delivered"].map((step, index) => {
                            const status = getStepStatus(order.status, step);
                            const isActive = status === "active";
                            return (
                              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${isActive ? "bg-[#2C1A1D] border-[#2C1A1D] text-[#FBF9F5]" : "bg-white border-[#EBE0D3] text-transparent"}`}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-4 w-4">
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

                      {/* Items List & Receipt Area */}
                      <div ref={expandedOrder === order.id ? receiptRef : null} className="bg-white rounded-lg p-6 border border-[#2C1A1D]/10">
                        
                        {/* Receipt Branding */}
                        <div className="text-center border-b border-[#2C1A1D]/10 pb-6 mb-6">
                          <h2 className="text-[28px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>MOCKTOPIA</h2>
                          <p className="text-[12px] text-[#2C1A1D]/50 mt-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Order Receipt</p>
                        </div>

                        <div className="flex justify-between text-[12px] text-[#2C1A1D]/70 mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          <div>
                            <p>Receipt No: {order.id}</p>
                            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#2C1A1D]">{order.customerName}</p>
                            <p>{order.phone}</p>
                            <p>{order.address}</p>
                          </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full mb-6">
                          <thead>
                            <tr className="border-b border-[#2C1A1D]/10">
                              <th className="text-left py-2 text-[10px] font-bold uppercase tracking-wider text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Item</th>
                              <th className="text-center py-2 text-[10px] font-bold uppercase tracking-wider text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Qty</th>
                              <th className="text-right py-2 text-[10px] font-bold uppercase tracking-wider text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item: any, i: number) => (
                              <tr key={i} className="border-b border-[#2C1A1D]/5">
                                <td className="py-3 text-[13px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                  {item.title} <span className="text-[11px] text-[#2C1A1D]/50">({item.size})</span>
                                </td>
                                <td className="text-center py-3 text-[13px] text-[#2C1A1D]">{item.qty}</td>
                                <td className="text-right py-3 text-[13px] text-[#2C1A1D]">£{(item.price * item.qty).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex flex-col items-end gap-2 border-t border-[#2C1A1D]/10 pt-4 mb-6">
                          <div className="flex justify-between w-full max-w-[200px] text-[12px] text-[#2C1A1D]/60">
                            <span>Subtotal:</span><span>£{order.subtotal?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between w-full max-w-[200px] text-[12px] text-[#2C1A1D]/60">
                            <span>Delivery:</span><span>£{order.deliveryFee?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between w-full max-w-[200px] text-[16px] font-bold text-[#2C1A1D] mt-2">
                            <span>Total:</span><span>£{order.total?.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-[11px] text-[#2C1A1D]/50 border-t border-[#2C1A1D]/10 pt-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          Thank you for shopping with Mocktopia.<br/>Baked with love.
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-end gap-3">
                        <button 
                          onClick={() => handleDownloadReceipt(order)}
                          className="rounded-md border border-[#2C1A1D] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors"
                          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                          Download Receipt
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
