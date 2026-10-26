"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ProductModal } from "@/components/ProductModal";

const CATEGORIES = [
  { id: "all", label: "All Treats" },
  { id: "banana-bread", label: "Banana Bread" },
  { id: "puff-puffs", label: "Puff Puffs" },
  { id: "mocktails", label: "Mocktails" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(data => {
      // Only show items that are in stock
      setProducts(data.filter((p: any) => p.inStock === 1));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const currentCategoryLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label || "All Treats";

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C1A1D] flex flex-col">
      <section id="hero" className="bg-[#2C1A1D] pt-[88px] pb-8 px-6 md:pt-[104px] md:pb-10 md:px-12 border-b border-[#FBF9F5]/10">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="relative">
              <button onClick={() => setIsCatOpen(!isCatOpen)} className="flex items-center gap-3 group">
                <h1 className="text-[32px] md:text-[48px] leading-none text-[#FBF9F5]" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>{currentCategoryLabel}</h1>
                <svg className={`w-5 h-5 md:w-6 md:h-6 text-[#FBF9F5]/50 transition-transform ${isCatOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isCatOpen && (
                <div className="absolute left-0 top-full mt-4 w-56 bg-[#FBF9F5] text-[#2C1A1D] shadow-xl z-50 border border-[#2C1A1D]/10">
                  {CATEGORIES.map((c) => (
                    <button key={c.id} onClick={() => { setActiveCategory(c.id); setIsCatOpen(false); }} className={`block w-full text-left px-5 py-3 text-[12px] ${activeCategory === c.id ? 'font-bold bg-[#2C1A1D]/5' : ''}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{c.label}</button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[10px] font-medium text-[#FBF9F5]/50 uppercase tracking-[0.1em] pb-1">{filtered.length} Items</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-12 md:px-12 md:py-16">
        {loading ? (
          <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[14px] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            No treats available right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {filtered.map((product) => (
              <div key={product.id} onClick={() => setSelectedProduct(product)} className="group flex flex-col cursor-pointer">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#EBE0D3] mb-3">
                  <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-[13px] md:text-[14px] font-medium truncate text-[#2C1A1D]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{product.title}</h3>
                <p className="mt-1 text-[11px] md:text-[12px] text-[#2C1A1D]/60" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>₦{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INLINE COPYRIGHT FOOTER */}
      <div className="w-full border-t border-[#2C1A1D]/10 pt-8 pb-12 mt-auto">
        <p className="text-center text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#2C1A1D]/50" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          © {new Date().getFullYear()} Mocktopia Treats. All rights reserved.
        </p>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}