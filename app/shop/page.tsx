"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductModal } from "@/components/ProductModal";
import { ProductCard } from "@/components/ProductCard";
import { BoxBuilderModal } from "@/components/BoxBuilderModal";

const CATEGORIES = [
  { id: "all", label: "All Treats" },
  { id: "banana-bread", label: "Banana Bread" },
  { id: "puff-puffs", label: "Puff Puffs" },
  { id: "mocktails", label: "Mocktails" },
];

// THE HARDCODED MINI BOX PRODUCT
const MINI_BOX_PRODUCT = {
  id: "custom-mini-boxes",
  title: "Mini Boxes",
  price: "20",
  image: "/box-builder-home.PNG", // Make sure you have this image
  category: "banana-bread",
  inStock: 1,
  isCustomBox: true, // FLAG TO IDENTIFY IT
};

function ShopContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [boxConfig, setBoxConfig] = useState<any>(null);
  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState("all");
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    // Fetch Box Config
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data && data.boxBuilderConfig) {
        try {
          const parsed = JSON.parse(data.boxBuilderConfig);
          if (parsed.isActive) setBoxConfig(parsed);
        } catch (e) {}
      }
    });

    // Fetch Products
    const cached = localStorage.getItem("mocktopia_products_cache");
    if (cached) {
      try {
        setProducts(JSON.parse(cached));
        setLoading(false);
      } catch (e) {}
    }

    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
        localStorage.setItem("mocktopia_products_cache", JSON.stringify(data));
      });
  }, []);

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? [...products] : products.filter((p) => p.category === activeCategory);
    
    // INJECT MINI BOXES AT THE TOP IF BOX BUILDER IS ACTIVE
    if (boxConfig && (activeCategory === "all" || activeCategory === "banana-bread")) {
      list = [MINI_BOX_PRODUCT, ...list];
    }
    return list;
  }, [products, activeCategory, boxConfig]);

  const currentCategoryLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label || "All Treats";

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C1A1D] flex flex-col">
      
      <section id="hero" className="bg-[#2C1A1D] pt-[88px] pb-8 px-6 md:pt-[104px] md:pb-10 md:px-12 border-b border-[#FBF9F5]/10 relative z-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="relative">
              <button onClick={() => setIsCatOpen(!isCatOpen)} className="flex items-center gap-3 group">
                <h1 className="text-[32px] md:text-[48px] leading-none text-[#FBF9F5]" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                  {currentCategoryLabel}
                </h1>
                <svg className={`w-5 h-5 md:w-6 md:h-6 text-[#FBF9F5]/50 transition-transform ${isCatOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isCatOpen && (
                <div className="absolute left-0 top-full mt-4 w-56 bg-[#FBF9F5] text-[#2C1A1D] shadow-xl z-50 border border-[#2C1A1D]/10 rounded-md overflow-hidden">
                  {CATEGORIES.map((c) => (
                    <button key={c.id} onClick={() => { setActiveCategory(c.id); setIsCatOpen(false); }} className={`block w-full text-left px-5 py-3 text-[12px] hover:bg-[#2C1A1D]/5 transition-colors ${activeCategory === c.id ? 'font-bold bg-[#2C1A1D]/5' : ''}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[10px] font-medium text-[#FBF9F5]/50 uppercase tracking-[0.1em] pb-1">
              {filtered.length} Items
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-12 md:px-6 md:py-16">
        {loading ? (
          <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[14px] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-inter), sans-serif" }}>No treats available right now.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 lg:gap-x-5 lg:gap-y-14">
            {filtered.map((product, idx) => (
              <div key={product.id} className="rounded-xl overflow-hidden group" onClick={() => {
                if (product.isCustomBox) setIsBoxModalOpen(true);
                else setSelectedProduct(product);
              }}>
                <ProductCard 
                  product={{
                    ...product,
                    sizes: product.isCustomBox ? [] : JSON.parse(product.sizes || "[]")
                  }} 
                  priority={idx < 4}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="w-full border-t border-[#2C1A1D]/10 pt-8 pb-12 mt-auto">
        <p className="text-center text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#2C1A1D]/50" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          © {new Date().getFullYear()} Mocktopia Treats. All rights reserved.
        </p>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} allProducts={products} />
      )}

      {isBoxModalOpen && boxConfig && (
        <BoxBuilderModal config={boxConfig} onClose={() => setIsBoxModalOpen(false)} />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
