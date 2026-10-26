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

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  
  // Delivery Zones State
  const [zones, setZones] = useState<Zone[]>([]);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZonePrice, setNewZonePrice] = useState("");

  useEffect(() => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data) {
        setWhatsappNumber(data.whatsappNumber || "");
        setBankName(data.bankName || "");
        setAccountName(data.accountName || "");
        setAccountNumber(data.accountNumber || "");
        
        if (data.deliveryZones) {
          setZones(JSON.parse(data.deliveryZones));
        }
      }
      setLoading(false);
    });
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
      body: JSON.stringify({
        whatsappNumber,
        bankName,
        accountName,
        accountNumber,
        deliveryZones: JSON.stringify(zones), // Save the zones array
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex justify-center py-24 min-h-screen bg-[#FBF9F5]"><div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Configuration</p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Store Settings</h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* DELIVERY ZONES */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Delivery Locations</h2>
          
          <div className="flex flex-col gap-3 mb-6">
            {zones.map((zone, i) => (
              <div key={i} className="flex items-center justify-between bg-[#FBF9F5] p-3 rounded-md border border-[#2C1A1D]/10">
                <span className="text-[14px] font-medium text-[#2C1A1D]">{zone.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-bold text-[#2C1A1D]">£{zone.price.toFixed(2)}</span>
                  <button type="button" onClick={() => removeZone(i)} className="text-red-500 text-sm">✕</button>
                </div>
              </div>
            ))}
            {zones.length === 0 && <p className="text-[13px] text-[#2C1A1D]/50">No delivery zones added yet.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border-t border-[#2C1A1D]/10 pt-5">
            <div className="md:col-span-1">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Location Name</label>
              <input value={newZoneName} onChange={e => setNewZoneName(e.target.value)} type="text" placeholder="e.g. London" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Price (£)</label>
              <input value={newZonePrice} onChange={e => setNewZonePrice(e.target.value)} type="number" placeholder="5.00" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <button type="button" onClick={addZone} className="w-full rounded-md bg-[#EBE0D3] py-3 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D] hover:bg-[#DCD0C2]">
              Add Zone
            </button>
          </div>
        </div>

        {/* CONTACT & BANK (Kept from before) */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Contact & Bank Details</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">WhatsApp Number</label>
              <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} type="text" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Bank Name</label>
              <input value={bankName} onChange={e => setBankName(e.target.value)} type="text" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Account Name</label>
              <input value={accountName} onChange={e => setAccountName(e.target.value)} type="text" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Account Number</label>
              <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} type="text" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
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