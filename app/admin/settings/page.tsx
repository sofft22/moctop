"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Zone {
  name: string;
  price: number;
}

interface Topping {
  id: string;
  name: string;
  image: string;
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

  // BOX BUILDER STATE
  const [boxConfig, setBoxConfig] = useState({
    isActive: false,
    title: "Build Your Own Box",
    price: 20,
    slots: 6,
    toppings: [] as Topping[]
  });
  const [newToppingName, setNewToppingName] = useState("");
  const [uploadingTopping, setUploadingTopping] = useState(false);

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
          
          if (data.boxBuilderConfig) {
            try {
              setBoxConfig(JSON.parse(data.boxBuilderConfig));
            } catch (e) {}
          }
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

  // TOPPING UPLOAD LOGIC
  const handleToppingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newToppingName) return alert("Enter topping name first");

    setUploadingTopping(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        
        const newTopping = { id: Date.now().toString(), name: newToppingName, image: dataUrl };
        setBoxConfig({ ...boxConfig, toppings: [...boxConfig.toppings, newTopping] });
        setNewToppingName("");
        setUploadingTopping(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeTopping = (id: string) => {
    setBoxConfig({ ...boxConfig, toppings: boxConfig.toppings.filter(t => t.id !== id) });
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
        boxBuilderConfig: JSON.stringify(boxConfig), // SAVE BOX CONFIG
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
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Settings</h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* BOX BUILDER */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Build Your Own Box</h2>
            <button type="button" onClick={() => setBoxConfig({ ...boxConfig, isActive: !boxConfig.isActive })} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${boxConfig.isActive ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${boxConfig.isActive ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Price (£)</label>
              <input value={boxConfig.price} onChange={(e) => setBoxConfig({ ...boxConfig, price: Number(e.target.value) })} type="number" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Number of Slots</label>
              <input value={boxConfig.slots} onChange={(e) => setBoxConfig({ ...boxConfig, slots: Number(e.target.value) })} type="number" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
            </div>
          </div>

          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Toppings List</label>
          <div className="flex flex-wrap gap-3 mb-6">
            {boxConfig.toppings.map((topping) => (
              <div key={topping.id} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3] border border-[#2C1A1D]/10 group">
                <Image src={topping.image} alt={topping.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-white mb-1">{topping.name}</span>
                  <button type="button" onClick={() => removeTopping(topping.id)} className="bg-white text-red-500 rounded-full px-2 py-1 text-[9px] font-bold">Remove</button>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <input value={newToppingName} onChange={(e) => setNewToppingName(e.target.value)} type="text" placeholder="Topping Name" className="rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-3 py-2 text-[12px] outline-none focus:border-[#2C1A1D]" />
              <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#2C1A1D]/20 bg-white text-[11px] font-bold uppercase text-[#2C1A1D]/50 hover:border-[#2C1A1D] transition-colors">
                {uploadingTopping ? "..." : "+ Add Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleToppingUpload} disabled={uploadingTopping} />
              </label>
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENT BANNER */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Announcement Banner</h2>
            <button type="button" onClick={() => setBannerActive(!bannerActive)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${bannerActive ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${bannerActive ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>
          <input value={bannerText} onChange={(e) => setBannerText(e.target.value)} type="text" placeholder="Announcement text..." className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
        </div>

        {/* DELIVERY ZONES */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Delivery Locations</h2>
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border-t border-[#2C1A1D]/10 pt-5">
            <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Location</label><input value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} type="text" placeholder="London" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" /></div>
            <div><label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Price (£)</label><input value={newZonePrice} onChange={(e) => setNewZonePrice(e.target.value)} type="number" step="0.01" placeholder="5.00" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" /></div>
            <button type="button" onClick={addZone} className="w-full rounded-md bg-[#EBE0D3] py-3 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D] hover:bg-[#DCD0C2]">Add Zone</button>
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
