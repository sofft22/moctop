"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FeaturedProducts } from "./FeaturedProducts";
import { ProductModal } from "./ProductModal";

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

  useEffect(() => {
    const cached = localStorage.getItem("mocktopia_products_cache");
    if (cached) {
      try { setAllProducts(JSON.parse(cached)); } catch (e) {}
    }
    fetch("/api/products").then(res => res.json()).then(data => {
      setAllProducts(data);
      localStorage.setItem("mocktopia_products_cache", JSON.stringify(data));
    });
  }, []);

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
          allProducts={allProducts} 
        />
      )}
    </>
  );
}
