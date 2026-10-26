"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FeaturedProducts } from "./FeaturedProducts";
import { ProductModal } from "./ProductModal";

// 1. Define your products outside the component
const ALL_PRODUCTS = [
  { id: "p1", title: "Choc Chip Banana Bread", price: "₦6,500", image: "/feat-banana-choc.png", description: "Our signature moist banana bread loaded with premium chocolate chips.", sizes: ["Box of 6", "Box of 8", "MIDI loaf", "Maxi loaf", "Bulk / Event Order"] },
  // ... make sure all your other products are listed here
];

// 2. Create a separate component for the search param logic
function ProductDeepLink({ onSelect }: { onSelect: (p: any) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId) {
      const foundProduct = ALL_PRODUCTS.find((p) => p.id === productId);
      if (foundProduct) onSelect(foundProduct);
    }
  }, [searchParams, onSelect]);

  return null;
}

// 3. Your main component
export function HomeClient() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <>
      {/* Wrap the component that uses useSearchParams in a Suspense boundary */}
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