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
  
  // CHANGED: Sizes state now holds objects with size name and price
  const [sizes, setSizes] = useState<{ size: string; price: string }[]>(() => {
    if (!product || !product.sizes) return [{ size: "", price: "" }];
    
    let parsedSizes: any[] = [];
    if (Array.isArray(product.sizes)) {
      parsedSizes = product.sizes;
    } else {
      try {
        const parsed = JSON.parse(product.sizes);
        if (Array.isArray(parsed)) parsedSizes = parsed;
      } catch (e) {}
    }

    if (parsedSizes.length === 0) return [{ size: "", price: "" }];

    // Map old string sizes to the new object format safely
    return parsedSizes.map((s: any) => {
      if (typeof s === "string") return { size: s, price: "" };
      return { size: s.size || "", price: s.price?.toString() || "" };
    });
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
    
    // Clean sizes: Remove empty rows, ensure price is a number
    const cleanSizes = sizes
      .filter((s) => s.size.trim() !== "")
      .map((s) => ({
        size: s.size.trim(),
        price: s.price ? Number(s.price) : Number(price) // fallback to base price if left empty
      }));

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
    <div className="fixed inset-0 z-[120] flex bg-black/60 backdrop-blur-sm sm:p-4 sm:items-center justify-center">
      <div className="absolute inset-0 hidden sm:block" onClick={onClose} />
      
      <div className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-[600px] sm:rounded-lg overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5]">
          <h2 className="text-[22px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 pb-8">
          
          {/* IMAGES */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Product Images (First is Main)</label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3] border-2 transition-all ${i === 0 ? "border-[#2C1A1D]" : "border-transparent"}`}>
                  <Image src={img} alt={`Preview ${i}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button onClick={() => removeImage(i)} className="bg-white rounded-full px-2 py-1 text-red-500 text-[10px] font-bold shadow-md">Remove</button>
                    {i !== 0 && <button onClick={() => setMainImage(i)} className="bg-white rounded-full px-2 py-1 text-[#2C1A1D] text-[10px] font-bold shadow-md">Make Main</button>}
                  </div>
                  {i === 0 && <span className="absolute top-1 left-1 bg-[#2C1A1D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MAIN</span>}
                </div>
              ))}
              <label className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-[#2C1A1D]/20 bg-white text-[#2C1A1D]/50 hover:border-[#2C1A1D] transition-colors">
                {uploading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /> : <span className="text-2xl">+</span>}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Choc Chip Banana Bread" className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Base Price (£)</label>
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

          {/* SIZES / OPTIONS - WITH SEPARATE PRICES */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Sizes / Options</label>
            <div className="flex flex-col gap-3">
              {sizes.map((option, i) => (
                <div key={i} className="flex gap-2 items-center">
                  {/* Size Name */}
                  <input 
                    value={option.size} 
                    onChange={e => { const n = [...sizes]; n[i].size = e.target.value; setSizes(n); }} 
                    type="text" 
                    placeholder="e.g. Box of 6" 
                    className="flex-1 rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-2 text-[13px] outline-none focus:border-[#2C1A1D]" 
                    style={{ fontFamily: "var(--font-inter), sans-serif" }} 
                  />
                  {/* Price for this size */}
                  <div className="relative w-[100px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#2C1A1D]/50">£</span>
                    <input 
                      value={option.price} 
                      onChange={e => { const n = [...sizes]; n[i].price = e.target.value; setSizes(n); }} 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full rounded-md border border-[#2C1A1D]/20 bg-white pl-7 pr-3 py-2 text-[13px] outline-none focus:border-[#2C1A1D]" 
                      style={{ fontFamily: "var(--font-inter), sans-serif" }} 
                    />
                  </div>
                  {/* Remove Button */}
                  <button onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))} className="text-[#2C1A1D]/40 hover:text-red-500 px-2">✕</button>
                </div>
              ))}
              <button onClick={() => setSizes([...sizes, { size: "", price: "" }])} className="text-[12px] font-bold uppercase tracking-wider text-[#2C1A1D] text-left mt-2 hover:underline">+ Add Option</button>
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

        <div className="p-6 pb-8 sm:pb-6 bg-[#FBF9F5] border-t border-[#2C1A1D]/10 shrink-0">
          <button onClick={handleSave} disabled={saving || uploading} className="w-full rounded-md bg-[#2C1A1D] py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] disabled:opacity-50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
          </button>
        </div>

      </div>
    </div>
  );
}
