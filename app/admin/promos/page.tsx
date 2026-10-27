"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPromosPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const loadPromos = () => {
    fetch("/api/promos")
      .then((res) => res.json())
      .then((data) => {
        setPromos(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    loadPromos();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) return alert("Code and Value are required");

    const res = await fetch("/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        type,
        value: Number(value),
        minSpend: minSpend ? Number(minSpend) * 100 : 0, // Convert to pence
        maxUses: maxUses ? Number(maxUses) : 0,
        expiresAt: expiresAt || null,
      }),
    });

    if (res.ok) {
      setCode(""); setValue(""); setMinSpend(""); setMaxUses(""); setExpiresAt("");
      setIsModalOpen(false);
      loadPromos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    await fetch(`/api/promos?id=${id}`, { method: "DELETE" });
    loadPromos();
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5] relative">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Marketing</p>
          <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Promo Codes</h1>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-[#2C1A1D] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#FBF9F5] transition-colors hover:bg-[#1F1315]" 
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
          Create Promo
        </button>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-3">
        {promos.length === 0 && <p className="text-[#2C1A1D]/50 py-12 text-center text-[13px]">No promo codes created yet.</p>}
        {promos.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-lg border border-[#2C1A1D]/10 flex justify-between items-center shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="font-bold text-[#2C1A1D] text-[16px]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{p.code}</p>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${p.isActive === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {p.isActive === 1 ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-[13px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                {p.type === "percentage" ? `${p.value}% OFF` : `£${(p.value / 100).toFixed(2)} OFF`}
                {p.minSpend > 0 && ` • Min Spend: £${(p.minSpend / 100).toFixed(2)}`}
              </p>
              <p className="text-[11px] text-[#2C1A1D]/40 mt-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Used: {p.currentUses} {p.maxUses > 0 ? `/ ${p.maxUses}` : "times"} 
                {p.expiresAt && ` • Expires: ${p.expiresAt}`}
              </p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-red-500 text-[11px] font-bold uppercase tracking-wider hover:underline px-4 py-2">
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex bg-black/60 backdrop-blur-sm sm:p-4 items-end sm:items-center justify-center">
          <div className="absolute inset-0 hidden sm:block" onClick={() => setIsModalOpen(false)} />
          
          {/* Full screen on mobile, scrollable */}
          <div className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-[500px] sm:rounded-lg overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5]">
              <h2 className="text-[22px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Create Promo Code</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5 pb-8">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/60">Code (e.g. MOCK10)</label>
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className="w-full mt-1.5 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] font-bold outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/60">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1.5 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (£)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/60">Value ({type === "percentage" ? "%" : "£"})</label>
                  <input value={value} onChange={(e) => setValue(e.target.value)} type="number" placeholder={type === "percentage" ? "10" : "5.00"} className="w-full mt-1.5 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/60">Min Spend (£)</label>
                  <input value={minSpend} onChange={(e) => setMinSpend(e.target.value)} type="number" placeholder="Optional" className="w-full mt-1.5 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/60">Max Uses</label>
                  <input value={maxUses} onChange={(e) => setMaxUses(e.target.value)} type="number" placeholder="0 = Unlimited" className="w-full mt-1.5 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/60">Expiry Date</label>
                <input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" className="w-full mt-1.5 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  Create Promo Code
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
