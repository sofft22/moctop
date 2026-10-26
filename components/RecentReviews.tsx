"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductModal } from "./ProductModal";

export function RecentReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<Record<string, any>>({});
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both reviews and products to map them together
    Promise.all([
      fetch("/api/reviews").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([reviewsData, productsData]) => {
      
      // Create a dictionary of products by ID for quick lookup
      const productMap: Record<string, any> = {};
      productsData.forEach((p: any) => {
        productMap[p.id] = p;
      });
      setProducts(productMap);

      // Filter for approved reviews, get the 3 most recent, and ensure product exists
      const approved = reviewsData
        .filter((r: any) => r.approved === 1 && productMap[r.productId])
        .slice(0, 3);

      setReviews(approved);
      setLoading(false);
    });
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <>
      <section className="w-full bg-[#2C1A1D] py-16 px-4 md:py-24 md:px-6">
        <div className="mx-auto max-w-[1400px]">
          
          <div className="mb-12 text-center">
            <h2 
              className="text-[28px] text-[#FBF9F5] md:text-[42px]"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
              Loved by our customers
            </h2>
            <p 
              className="mt-3 text-[13px] text-[#FBF9F5]/60 uppercase tracking-[0.15em]"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
              Real reviews from real orders
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => {
              const product = products[review.productId];
              return (
                <div 
                  key={review.id} 
                  className="flex flex-col justify-between rounded-md bg-[#FBF9F5] p-6 shadow-lg"
                >
                  <div>
                    {/* Stars & Name */}
                    <div className="flex items-center justify-between mb-4">
                      <p 
                        className="text-[13px] font-bold uppercase tracking-wider text-[#2C1A1D]"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      >
                        {review.customerName}
                      </p>
                      <span className="text-[14px] text-[#2C1A1D]">
                        {"★".repeat(review.rating)}
                        <span className="text-[#2C1A1D]/20">{"★".repeat(5 - review.rating)}</span>
                      </span>
                    </div>

                    {/* Comment */}
                    <p 
                      className="text-[14px] leading-relaxed text-[#2C1A1D]/80 mb-6"
                      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Product Link/CTA */}
                  <div className="border-t border-[#2C1A1D]/10 pt-4 flex items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3]">
                      <Image src={product.image} alt={product.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="truncate text-[13px] font-semibold text-[#2C1A1D]"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      >
                        {product.title}
                      </p>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A1D]/50 hover:text-[#2C1A1D] underline mt-1"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      >
                        See Product →
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Render the Product Modal if a review product is clicked */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}