"use client";

import { useEffect, useState } from "react";
import { ProductModal } from "./ProductModal";

export function RecentReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<Record<string, any>>({});
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/reviews").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([reviewsData, productsData]) => {
      
      const productMap: Record<string, any> = {};
      productsData.forEach((p: any) => {
        productMap[p.id] = p;
      });
      setProducts(productMap);

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
      <section className="w-full bg-[#FBF9F5] py-20 px-6 md:py-28 md:px-12 border-t border-[#2C1A1D]/10">
        <div className="mx-auto max-w-[1200px]">
          
          <div className="mb-16 text-center">
            <p 
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2C1A1D]/50 mb-4"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
          
            </p>
            <h2 
              className="text-[36px] md:text-[56px] text-[#2C1A1D] leading-tight"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
             Most recent reviews
            </h2>
          </div>

          {/* Slim, Rectangular Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review) => {
              const product = products[review.productId];
              return (
                <div 
                  key={review.id} 
                  className="flex flex-col justify-between rounded-xl bg-white px-6 py-5 border border-[#2C1A1D]/10 shadow-sm"
                >
                  <div>
                    {/* Stars & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-[13px] text-[#2C1A1D]">
                        {"★".repeat(review.rating)}
                        <span className="text-[#2C1A1D]/20">{"★".repeat(5 - review.rating)}</span>
                      </div>
                      <p className="text-[10px] text-[#2C1A1D]/40" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                        {new Date(review.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                      </p>
                    </div>

                    {/* Comment */}
                    <p 
                      className="text-[14px] leading-[1.6] text-[#2C1A1D]/80 mb-6"
                      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Footer: Name & Product Link */}
                  <div className="border-t border-[#2C1A1D]/5 pt-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p 
                        className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A1D] truncate"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      >
                        {review.customerName}
                      </p>
                      <p 
                        className="text-[10px] text-[#2C1A1D]/40 mt-0.5 truncate"
                        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {product.title}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D] hover:underline shrink-0"
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                    >
                      See Product →
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}
