"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPromosPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

    await fetch("/api/promos", {
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

    setCode(""); setValue(""); setMinSpend(""); setMaxUses(""); setExpiresAt("");
    loadPromos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    await fetch(`/api/promos?id=${id}`, { method: "DELETE" });
    loadPromos();
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Marketing</p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Promo Codes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CREATE FORM */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg border border-[#2C1A1D]/10 h-fit shadow-sm">
          <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D] mb-5" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Create Code</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#2C1A1D]/60 uppercase">Code (e.g. MOCK10)</label>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full mt-1 rounded border p-2 text-[13px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2C1A1D]/60 uppercase">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1 rounded border p-2 text-[13px] outline-none focus:border-[#2C1A1D]">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (£)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2C1A1D]/60 uppercase">Value ({type === "percentage" ? "%" : "£"})</label>
              <input value={value} onChange={(e) => setValue(e.target.value)} type="number" className="w-full mt-1 rounded border p-2 text-[13px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2C1A1D]/60 uppercase">Min Spend (£)</label>
              <input value={minSpend} onChange={(e) => setMinSpend(e.target.value)} type="number" placeholder="Optional" className="w-full mt-1 rounded border p-2 text-[13px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2C1A1D]/60 uppercase">Max Uses</label>
              <input value={maxUses} onChange={(e) => setMaxUses(e.target.value)} type="number" placeholder="0 = Unlimited" className="w-full mt-1 rounded border p-2 text-[13px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2C1A1D]/60 uppercase">Expiry Date</label>
              <input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" className="w-full mt-1 rounded border p-2 text-[13px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <button type="submit" className="mt-2 w-full rounded bg-[#2C1A1D] py-3 text-[11px] font-bold uppercase text-[#FBF9F5] hover:bg-[#1F1315]">Create Promo</button>
          </form>
        </div>

        {/* LIST */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {promos.length === 0 && <p className="text-[#2C1A1D]/50">No promos created yet.</p>}
          {promos.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border border-[#2C1A1D]/10 flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-[#2C1A1D]">{p.code}</p>
                <p className="text-[12px] text-[#2C1A1D]/60">
                  {p.type === "percentage" ? `${p.value}% OFF` : `£${(p.value / 100).toFixed(2)} OFF`}
                  {p.minSpend > 0 && ` • Min Spend: £${(p.minSpend / 100).toFixed(2)}`}
                </p>
                <p className="text-[11px] text-[#2C1A1D]/40 mt-1">
                  Used: {p.currentUses} {p.maxUses > 0 ? `/ ${p.maxUses}` : "times"} 
                  {p.expiresAt && ` • Expires: ${p.expiresAt}`}
                </p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 text-[12px] font-bold uppercase hover:underline">Delete</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
