"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface Props {
  onProductClick: (product: any) => void;
}

export function FeaturedProducts({ onProductClick }: Props) {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(data => {
      // Filter products that are featured and in stock
      const featured = data.filter((p: any) => p.featured === 1 && p.inStock === 1);
      
      // We only need a maximum of 6 items to display
      setFeaturedItems(featured.slice(0, 6));
      setLoading(false);
    });
  }, []);

  if (loading) return null; // Hide section while loading

  // If no products are marked as featured, hide the whole section
  if (featuredItems.length === 0) return null;

  return (
    <section className="w-full bg-[#FBF9F5] py-16 px-4 md:py-24 md:px-6 border-t border-[#2C1A1D]/10">
      <div className="mx-auto max-w-[1400px]">
        
        <div className="mb-8 flex flex-row items-end justify-between">
          <h2 
            className="text-[24px] md:text-[48px] font-normal text-[#2C1A1D] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            Signature Treats
          </h2>
          <Link 
            href="/shop" 
            className="group flex shrink-0 items-center gap-2 pb-1 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.15em] text-[#2C1A1D] transition-colors hover:opacity-60"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span className="border-b border-[#2C1A1D] pb-0.5 whitespace-nowrap">
              See More
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* 
          GRID LOGIC:
          - Mobile: 2 columns
          - Tablet: 3 columns (3x2 grid with 6 items)
          - Desktop: 4 columns (hides items 5 & 6 using lg:hidden)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 lg:gap-x-5 lg:gap-y-14">
          {featuredItems.map((item, idx) => (
            <div 
              key={item.id} 
              className={`${idx >= 4 ? "lg:hidden" : "block"} rounded-md overflow-hidden`} // Subtle radius applied here
              onClick={() => onProductClick(item)} 
            >
              <ProductCard 
                product={{
                  ...item,
                  price: `₦${item.price.toLocaleString()}`,
                  sizes: JSON.parse(item.sizes)
                }} 
                priority={idx < 2}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}