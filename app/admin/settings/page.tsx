"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Topping {
  id: string;
  name: string;
  image: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [savedBanner, setSavedBanner] = useState(false);
  const [savedBox, setSavedBox] = useState(false);

  const [bannerText, setBannerText] = useState("");
  const [bannerActive, setBannerActive] = useState(false);

  // Box Builder State
  const [boxConfig, setBoxConfig] = useState({
    isActive: false,
    title: "Build Your Own Box",
    price6: 20,
    weight6: 0.5,
    price8: 25,
    weight8: 0.7,
    toppings: [] as Topping[]
  });
  
  // Topping Form State
  const [newToppingName, setNewToppingName] = useState("");
  const [uploadingTopping, setUploadingTopping] = useState(false);
  
  // NEW: State for editing toppings
  const [editingToppingId, setEditingToppingId] = useState<string | null>(null);
  const [editingToppingImage, setEditingToppingImage] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setBannerText(data.bannerText || "");
          setBannerActive(data.bannerActive === 1);
          
          if (data.boxBuilderConfig) {
            try { 
              const parsed = JSON.parse(data.boxBuilderConfig);
              setBoxConfig({
                isActive: parsed.isActive ?? false,
                title: parsed.title || "Build Your Own Box",
                price6: parsed.price6 || 20,
                weight6: parsed.weight6 || 0.5,
                price8: parsed.price8 || 25,
                weight8: parsed.weight8 || 0.7,
                toppings: parsed.toppings || []
              }); 
            } catch (e) {}
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleToppingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!newToppingName && !editingToppingId) return alert("Enter topping name first");

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
        
        // If editing, update the editing image state. If creating, add to list
        if (editingToppingId) {
          setEditingToppingImage(dataUrl);
        } else {
          const newTopping = { id: Date.now().toString(), name: newToppingName, image: dataUrl };
          setBoxConfig({ ...boxConfig, toppings: [...boxConfig.toppings, newTopping] });
          setNewToppingName("");
        }
        
        setUploadingTopping(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeTopping = (id: string) => {
    setBoxConfig({ ...boxConfig, toppings: boxConfig.toppings.filter(t => t.id !== id) });
    if (editingToppingId === id) {
      cancelEdit();
    }
  };

  // NEW: Start editing a topping
  const startEditTopping = (topping: Topping) => {
    setEditingToppingId(topping.id);
    setNewToppingName(topping.name);
    setEditingToppingImage(topping.image);
  };

  // NEW: Cancel editing
  const cancelEdit = () => {
    setEditingToppingId(null);
    setNewToppingName("");
    setEditingToppingImage("");
  };

  // NEW: Save edited topping
  const saveEditedTopping = () => {
    if (!newToppingName.trim()) return alert("Topping name cannot be empty");
    
    const updatedToppings = boxConfig.toppings.map(t => 
      t.id === editingToppingId 
        ? { ...t, name: newToppingName, image: editingToppingImage || t.image } 
        : t
    );
    
    setBoxConfig({ ...boxConfig, toppings: updatedToppings });
    cancelEdit();
  };

  const saveBanner = async () => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerText, bannerActive: bannerActive ? 1 : 0 }),
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const saveBox = async () => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boxBuilderConfig: JSON.stringify(boxConfig) }),
    });
    setSavedBox(true);
    setTimeout(() => setSavedBox(false), 3000);
  };

  if (loading) return <div className="flex justify-center py-24 min-h-screen bg-[#FBF9F5]"><div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Configuration</p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Settings</h1>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* BOX BUILDER */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Build Your Own Box</h2>
            <button type="button" onClick={() => setBoxConfig({ ...boxConfig, isActive: !boxConfig.isActive })} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${boxConfig.isActive ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${boxConfig.isActive ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-3 p-4 bg-[#FBF9F5] rounded-md border border-[#2C1A1D]/10">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Box of 6</label>
              <div>
                <label className="mb-1 block text-[10px] text-[#2C1A1D]/60">Price (£)</label>
                <input value={boxConfig.price6} onChange={(e) => setBoxConfig({ ...boxConfig, price6: Number(e.target.value) })} type="number" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-2 text-[14px] outline-none focus:border-[#2C1A1D]" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-[#2C1A1D]/60">Weight (kg)</label>
                <input value={boxConfig.weight6} onChange={(e) => setBoxConfig({ ...boxConfig, weight6: Number(e.target.value) })} type="number" step="0.01" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-2 text-[14px] outline-none focus:border-[#2C1A1D]" />
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-[#FBF9F5] rounded-md border border-[#2C1A1D]/10">
              <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Box of 8</label>
              <div>
                <label className="mb-1 block text-[10px] text-[#2C1A1D]/60">Price (£)</label>
                <input value={boxConfig.price8} onChange={(e) => setBoxConfig({ ...boxConfig, price8: Number(e.target.value) })} type="number" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-2 text-[14px] outline-none focus:border-[#2C1A1D]" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-[#2C1A1D]/60">Weight (kg)</label>
                <input value={boxConfig.weight8} onChange={(e) => setBoxConfig({ ...boxConfig, weight8: Number(e.target.value) })} type="number" step="0.01" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-2 text-[14px] outline-none focus:border-[#2C1A1D]" />
              </div>
            </div>
          </div>

          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">Toppings List</label>
          {/* Toppings Grid */}
          <div className="flex flex-wrap gap-4 mb-6">
            {boxConfig.toppings.map((topping) => (
              <div key={topping.id} className={`relative flex flex-col w-24 p-1 rounded-md transition-all ${editingToppingId === topping.id ? "ring-2 ring-[#2C1A1D] bg-[#FBF9F5]" : ""}`}>
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3] border border-[#2C1A1D]/10 group">
                  <Image src={topping.image} alt={topping.name} fill className="object-cover" />
                  
                  {/* EDIT & DELETE BUTTONS OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button type="button" onClick={() => startEditTopping(topping)} className="bg-white text-[#2C1A1D] rounded-full h-6 w-6 flex items-center justify-center text-[10px] font-bold shadow-sm hover:scale-110 transition-transform" title="Edit">
                      ✎
                    </button>
                    <button type="button" onClick={() => removeTopping(topping.id)} className="bg-white text-red-500 rounded-full h-6 w-6 flex items-center justify-center text-[10px] font-bold shadow-sm hover:scale-110 transition-transform" title="Delete">
                      ✕
                    </button>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#2C1A1D] mt-1 text-center truncate px-1">{topping.name}</span>
              </div>
            ))}
          </div>

          {/* ADD / EDIT FORM */}
          <div className={`flex flex-col gap-3 p-4 rounded-md border transition-colors ${editingToppingId ? "border-[#2C1A1D] bg-[#FBF9F5]" : "border-dashed border-[#2C1A1D]/20 bg-white"}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60">
                {editingToppingId ? "Edit Topping" : "Add New Topping"}
              </h3>
              {editingToppingId && (
                <button onClick={cancelEdit} className="text-[10px] text-red-500 hover:underline">Cancel Edit</button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                value={newToppingName} 
                onChange={(e) => setNewToppingName(e.target.value)} 
                type="text" 
                placeholder="Topping Name (e.g. Oreo)" 
                className="flex-1 rounded-md border border-[#2C1A1D]/20 bg-white px-3 py-2 text-[13px] outline-none focus:border-[#2C1A1D]" 
              />
              
              <label className="flex h-[38px] cursor-pointer items-center justify-center rounded-md border border-[#2C1A1D]/20 bg-white px-4 text-[11px] font-bold uppercase text-[#2C1A1D] hover:border-[#2C1A1D] transition-colors">
                {uploadingTopping ? "Uploading..." : (editingToppingImage || editingToppingId) ? "Change Image" : "+ Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleToppingUpload} disabled={uploadingTopping} />
              </label>
              
              {editingToppingId ? (
                <button onClick={saveEditedTopping} className="h-[38px] rounded-md bg-[#2C1A1D] px-6 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#1F1315] transition-colors">
                  Update
                </button>
              ) : (
                <div className="h-[38px] flex items-center px-4 text-[11px] text-[#2C1A1D]/50 italic">
                  Select image to add
                </div>
              )}
            </div>
            {editingToppingImage && (
              <div className="text-[11px] text-green-600 font-bold">
                New image ready to save.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-[#2C1A1D]/10">
            <button onClick={saveBox} className="rounded-md bg-[#2C1A1D] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#FBF9F5] hover:bg-[#1F1315]">
              {savedBox ? "Saved ✓" : "Save Box Settings"}
            </button>
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
          
          <div className="flex justify-end pt-4 mt-4 border-t border-[#2C1A1D]/10">
            <button onClick={saveBanner} className="rounded-md bg-[#2C1A1D] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#FBF9F5] hover:bg-[#1F1315]">
              {savedBanner ? "Saved ✓" : "Save Banner"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
