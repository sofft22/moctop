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
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "banana-bread");
  
  const [inStock, setInStock] = useState(product ? product.inStock === 1 : true);
  const [featured, setFeatured] = useState(product ? product.featured === 1 : true);
  const [isBulk, setIsBulk] = useState(product ? product.isBulk === 1 : true);
  
  const [sizes, setSizes] = useState<string[]>(() => {
    if (!product || !product.sizes) return [""];
    if (Array.isArray(product.sizes)) return product.sizes;
    try {
      const parsed = JSON.parse(product.sizes);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
    } catch (e) {
      return [""];
    }
  });
  
  const [images, setImages] = useState<string[]>(() => {
    if (!product) return [];
    if (product.images) {
      if (Array.isArray(product.images)) return product.images;
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return product.image ? [product.image] : [];
  });
  
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
        
        setImages((prev) => {
          if (prev.length === 1 && prev[0] === "") return [dataUrl];
          return [...prev, dataUrl];
        });
        setUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, i) => i !== indexToRemove));
  };

  const setMainImage = (indexToMakeMain: number) => {
    if (indexToMakeMain === 0) return;
    const newImages = [...images];
    const [mainImage] = newImages.splice(indexToMakeMain, 1);
    newImages.unshift(mainImage);
    setImages(newImages);
  };

  const handleSave = async () => {
    if (!title.trim() || !price) return alert("Title and price are required.");
    if (images.length === 0 || images[0] === "") return alert("At least one image is required.");

    setSaving(true);
    
    const cleanSizes = sizes.filter((s) => typeof s === 'string' && s.trim() !== "");

    const payload = {
      id: product?.id,
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      inStock,
      featured,
      isBulk,
      image: images[0], 
      images: images,   
      sizes: cleanSizes,
    };

    const method = product ? "PUT" : "POST";
    await fetch("/api/products", { method, body: JSON.stringify(payload) });

    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex bg-black/60 backdrop-blur-sm sm:p-4 items-end sm:items-center justify-center">
      <div className="absolute inset-0 hidden sm:block" onClick={onClose} />
      
      {/* FULL SCREEN ON MOBILE */}
      <div className="relative flex h-[100dvh] sm:h-auto sm:max-h-[90vh] w-full max-w-[600px] flex-col bg-[#FBF9F5] shadow-2xl sm:rounded-lg overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5] shrink-0">
          <h2 className="text-[22px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Product Images (First is Main)</label>
            
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3] border-2 transition-all ${i === 0 ? "border-[#2C1A1D]" : "border-transparent"}`}>
                  <Image src={img} alt={`Preview ${i}`} fill className="object-cover" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button onClick={() => removeImage(i)} className="bg-white rounded-full px-2 py-1 text-red-500 text-[10px] font-bold shadow-md">Remove</button>
                    {i !== 0 && (
                      <button onClick={() => setMainImage(i)} className="bg-white rounded-full px-2 py-1 text-[#2C1A1D] text-[10px] font-bold shadow-md">Make Main</button>
                    )}
                  </div>
                  
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-[#2C1A1D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MAIN</span>
                  )}
                </div>
              ))}

              <label className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-[#2C1A1D]/20 bg-white text-[#2C1A1D]/50 hover:border-[#2C1A1D] transition-colors">
                {uploading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /> : <span className="text-2xl">+</span>}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <p className="text-[11px] text-[#2C1A1D]/50 mt-2" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Upload multiple images. The one marked MAIN shows on the grid.</p>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Choc Chip Banana Bread" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* CONVERTED TO £ */}
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Price (£)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="6.50" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
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

          <div className="flex items-center justify-between border-y border-[#2C1A1D]/10 py-4">
            <div>
              <p className="text-[14px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Bulk Order Item</p>
              <p className="text-[12px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Replace "Add to Bag" with a "Request Quote" form.</p>
            </div>
            <button onClick={() => setIsBulk(!isBulk)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${isBulk ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isBulk ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-[14px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>In Stock</p>
              <p className="text-[12px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Toggle off to mark as sold out.</p>
            </div>
            <button onClick={() => setInStock(!inStock)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${inStock ? "bg-[#2C1A1D]" : "bg-[#2C1A1D]/20"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${inStock ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>

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

        {/* SAVE BUTTON (Pinned to bottom) */}
        <div className="shrink-0 border-t border-[#2C1A1D]/10 bg-[#FBF9F5] p-6 pb-8 sm:pb-6">
          <button onClick={handleSave} disabled={saving || uploading} className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] disabled:opacity-50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
          </button>
        </div>

      </div>
    </div>
  );
}
