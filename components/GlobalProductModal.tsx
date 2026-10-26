"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductModal } from "./ProductModal";

function ModalLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [product, setProduct] = useState<any>(null);

  const productId = searchParams.get("product");

  useEffect(() => {
    if (productId) {
      // Fetch all products and find the one matching the ID
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          const found = data.find((p: any) => p.id === productId);
          if (found) setProduct(found);
        });
    } else {
      setProduct(null);
    }
  }, [productId]);

  const handleClose = () => {
    setProduct(null);
    // Remove the ?product=id from the URL when closed
    router.replace(pathname, { scroll: false });
  };

  if (!product) return null;

  return <ProductModal product={product} onClose={handleClose} />;
}

export function GlobalProductModal() {
  return (
    <Suspense fallback={null}>
      <ModalLogic />
    </Suspense>
  );
}
