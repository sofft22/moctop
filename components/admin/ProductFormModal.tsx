"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  product: any | null;
  onClose: () => void;
  onSave: () => void;
}

export function ProductFormModal({ product, onClose, onSave }: Props) {
  const [title, setTitle] = useState(product?.title || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "banana-bread");
  const [inStock, setInStock] = useState(product?.inStock === 1);
  const [featured, setFeatured] = useState(product?.featured === 1); // NEW
  const [isBulk, setIsBulk] = useState(product?.isBulk === 1);       // NEW
  
  const [sizes, setSizes] = useState<string[]>(product?.sizes ? JSON.parse(product.sizes) : [""]);
  const [imageUrl, setImageUrl] = useState(product?.image || "");
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setImageUrl(dataUrl);
        setUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim() || !price) return alert("Title and price are required.");

    setSaving(true);
    const payload = {
      id: product?.id,
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      inStock,
      featured, // NEW
      isBulk,   // NEW
      image: imageUrl,
      sizes: sizes.filter((s) => s.trim() !== ""),
    };

    const method = product ? "PUT" : "POST";
    await fetch("/api/products", { method, body: JSON.stringify(payload) });

    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative flex h-[90vh] sm:h-auto sm:max-h-[90vh] w-full max-w-[600px] flex-col bg-[#FBF9F5] shadow-2xl rounded-t-2xl sm:rounded-lg overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5]">
          <h2 className="text-[22px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* IMAGE UPLOAD */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Product Image</label>
            <div className="flex items-center gap-4">
              {imageUrl ? (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3]">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  <button onClick={() => setImageUrl("")} className="absolute top-1 right-1 bg-white rounded-full h-6 w-6 flex items-center justify-center text-red-500 text-xs shadow-md">✕</button>
                </div>
              ) : (
                <label className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-[#2C1A1D]/20 bg-white text-[#2C1A1D]/50 hover:border-[#2C1A1D]">
                  {uploading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /> : <span className="text-2xl">+</span>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
              <p className="text-[12px] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Upload a high-quality image.</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Choc Chip Banana Bread" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Price (₦)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="6500" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                <option value="banana-bread">Banana Bread</option>
                <option value="puff-puffs">Puff Puffs</option>
                <option value="mocktails">Mocktails</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Tell the customer why they need this..." className="w-full resize-none rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
          </div>

          {/* SIZES */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Sizes / Options</label>
            <div className="flex flex-col gap-2">
              {sizes.map((size, i) => (
                <div key={i} className="flex gap-2">
                  <input value={size} onChange={e => { const n = [...sizes]; n[i] = e.target.value; setSizes(n); }} type="text" placeholder="e.g. Box of 6" className="flex-1 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-2 text-[13px] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
                  <button onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))} className="text-[#2C1A1D]/40 hover:text-red-500 px-2">✕</button>
                </div>
              ))}
              <button onClick={() => setSizes([...sizes, ""])} className="text-[12px] font-bold uppercase tracking-wider text-[#2C1A1D] text-left mt-2 hover:underline">+ Add Size</button>
            </div>
          </div>

          {/* NEW BULK ORDER TOGGLE */}
          <div className="flex items-center justify-between border-y border-[#2C1A1D]/10 py-4">
            <div>
              <p className="text-[14px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Bulk Order Item</p>
              <p className="text-[12px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Replace "Add to Bag" with a "Request Quote" form.</p>
            </div>
            <button onClick={() => setIsBulk(!isBulk)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${isBulk ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isBulk ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* IN STOCK TOGGLE */}
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-[14px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>In Stock</p>
              <p className="text-[12px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Toggle off to mark as sold out.</p>
            </div>
            <button onClick={() => setInStock(!inStock)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${inStock ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${inStock ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* NEW FEATURED TOGGLE */}
          <div className="flex items-center justify-between border-y border-[#2C1A1D]/10 py-4">
            <div>
              <p className="text-[14px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Show on Homepage</p>
              <p className="text-[12px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Display this item in the "Signature Treats" section.</p>
            </div>
            <button onClick={() => setFeatured(!featured)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${featured ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${featured ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>

        </div>

        <div className="shrink-0 border-t border-[#2C1A1D]/10 bg-[#FBF9F5] p-6">
          <button onClick={handleSave} disabled={saving || uploading} className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] disabled:opacity-50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
          </button>
        </div>

      </div>
    </div>
  );
}