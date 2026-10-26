"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FeaturedProducts } from "./FeaturedProducts";
import { ProductModal } from "./ProductModal";

// 1. The Deep Link Logic fetches from the API (using the cache)
function ProductDeepLink({ onSelect }: { onSelect: (p: any) => void }) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  useEffect(() => {
    if (!productId) return;

    // Check cache first
    const cached = localStorage.getItem("mocktopia_products_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const found = parsed.find((p: any) => p.id === productId);
        if (found) onSelect(found);
        return; // Exit early if found in cache
      } catch (e) {}
    }

    // If not in cache, fetch from API
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("mocktopia_products_cache", JSON.stringify(data));
        const found = data.find((p: any) => p.id === productId);
        if (found) onSelect(found);
      });
  }, [productId, onSelect]);

  return null;
}

// 2. Main Home Page Component
export function HomeClient() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <>
      <Suspense fallback={null}>
        <ProductDeepLink onSelect={setSelectedProduct} />
      </Suspense>

      <FeaturedProducts onProductClick={(product) => setSelectedProduct(product)} />
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
