"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FeaturedProducts } from "./FeaturedProducts";
import { ProductModal } from "./ProductModal";
import { BoxBuilderModal } from "./BoxBuilderModal"; // IMPORT

function ProductDeepLink({ onSelect }: { onSelect: (p: any) => void }) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  useEffect(() => {
    if (!productId) return;
    const cached = localStorage.getItem("mocktopia_products_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const found = parsed.find((p: any) => p.id === productId);
        if (found) onSelect(found);
        return;
      } catch (e) {}
    }
    fetch("/api/products").then(res => res.json()).then(data => {
      localStorage.setItem("mocktopia_products_cache", JSON.stringify(data));
      const found = data.find((p: any) => p.id === productId);
      if (found) onSelect(found);
    });
  }, [productId, onSelect]);

  return null;
}

export function HomeClient() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  // BOX BUILDER STATE
  const [boxConfig, setBoxConfig] = useState<any>(null);
  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);

  useEffect(() => {
    // Load products for modal
    const cached = localStorage.getItem("mocktopia_products_cache");
    if (cached) {
      try { setAllProducts(JSON.parse(cached)); } catch (e) {}
    }
    fetch("/api/products").then(res => res.json()).then(data => {
      setAllProducts(data);
      localStorage.setItem("mocktopia_products_cache", JSON.stringify(data));
    });

    // Load Box Builder Config
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data && data.boxBuilderConfig) {
        try {
          const parsed = JSON.parse(data.boxBuilderConfig);
          if (parsed.isActive && parsed.toppings.length > 0) {
            setBoxConfig(parsed);
          }
        } catch (e) {}
      }
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ProductDeepLink onSelect={setSelectedProduct} />
      </Suspense>

      <FeaturedProducts onProductClick={(product) => setSelectedProduct(product)} />
      
      {/* BOX BUILDER HOME SECTION (Only shows if Active) */}
      {boxConfig && (
        <section className="w-full bg-white py-16 px-4 md:py-24 md:px-6 border-t border-[#2C1A1D]/10">
          <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-center gap-10 md:gap-16">
            
            {/* Image Side */}
            <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl bg-[#EBE0D3]">
              <Image src="/box-builder-home.png" alt="Build Your Own Box" fill className="object-cover" />
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50 mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Custom Experience</p>
              <h2 className="text-[36px] md:text-[56px] text-[#2C1A1D] leading-tight mb-4" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{boxConfig.title}</h2>
              <p className="text-[15px] md:text-[16px] text-[#2C1A1D]/70 mb-8 max-w-md mx-auto md:mx-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Choose your {boxConfig.slots} favorite treats and build the perfect box. Freshly baked and packed just the way you want it.
              </p>
              
              <button 
                onClick={() => setIsBoxModalOpen(true)}
                className="rounded-full bg-[#2C1A1D] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 md:px-14 md:py-5 md:text-[12px] mx-auto md:mx-0 w-fit"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Start Building — £{boxConfig.price.toFixed(2)}
              </button>
            </div>
          </div>
        </section>
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          allProducts={allProducts} 
        />
      )}

      {/* BOX MODAL */}
      {isBoxModalOpen && boxConfig && (
        <BoxBuilderModal 
          config={boxConfig} 
          onClose={() => setIsBoxModalOpen(false)} 
        />
      )}
    </>
  );
}
