"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Zone {
  name: string;
  price: number;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Delivery Zones State
  const [zones, setZones] = useState<Zone[]>([]);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZonePrice, setNewZonePrice] = useState("");

  // Banner State
  const [bannerText, setBannerText] = useState("");
  const [bannerActive, setBannerActive] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.deliveryZones) {
            try {
              const parsed = JSON.parse(data.deliveryZones);
              if (Array.isArray(parsed)) setZones(parsed);
            } catch (e) {}
          }
          setBannerText(data.bannerText || "");
          setBannerActive(data.bannerActive === 1);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const addZone = () => {
    if (!newZoneName || !newZonePrice) return;
    setZones([...zones, { name: newZoneName, price: Number(newZonePrice) }]);
    setNewZoneName("");
    setNewZonePrice("");
  };

  const removeZone = (index: number) => {
    setZones(zones.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deliveryZones: JSON.stringify(zones),
        bannerText,
        bannerActive: bannerActive ? 1 : 0,
      }),
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading)
    return (
      <div className="flex justify-center py-24 min-h-screen bg-[#FBF9F5]">
        <div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" />
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Configuration
        </p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
          Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* ANNOUNCEMENT BANNER */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Announcement Banner
            </h2>
            <button 
              type="button" 
              onClick={() => setBannerActive(!bannerActive)} 
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${bannerActive ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${bannerActive ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>
          
          <p className="text-[12px] text-[#2C1A1D]/60 mb-4">This text will scroll across the top of the home page.</p>
          
          <input
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            type="text"
            placeholder="e.g. FLASH SALE: Use code MOCK10 for 10% off!"
            className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]"
          />
        </div>

        {/* DELIVERY ZONES */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Delivery Locations
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            {zones.map((zone, i) => (
              <div key={i} className="flex items-center justify-between bg-[#FBF9F5] p-3 rounded-md border border-[#2C1A1D]/10">
                <span className="text-[14px] font-medium text-[#2C1A1D]">{zone.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-bold text-[#2C1A1D]">£{zone.price.toFixed(2)}</span>
                  <button type="button" onClick={() => removeZone(i)} className="text-red-500 text-sm hover:text-red-700 transition-colors">✕</button>
                </div>
              </div>
            ))}
            {zones.length === 0 && <p className="text-[13px] text-[#2C1A1D]/50">No delivery zones added yet.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border-t border-[#2C1A1D]/10 pt-5">
            <div className="md:col-span-1">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Location Name</label>
              <input value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} type="text" placeholder="e.g. London" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Price (£)</label>
              <input value={newZonePrice} onChange={(e) => setNewZonePrice(e.target.value)} type="number" step="0.01" placeholder="5.00" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <button type="button" onClick={addZone} className="w-full rounded-md bg-[#EBE0D3] py-3 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D] hover:bg-[#DCD0C2] transition-colors">Add Zone</button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-[#2C1A1D]/10 pt-6">
          {saved && <span className="text-[13px] font-bold text-green-600 animate-pulse" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Settings saved! ✓</span>}
          <button type="submit" className="rounded-md bg-[#2C1A1D] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Save Settings</button>
        </div>
      </form>
    </div>
  );
}
