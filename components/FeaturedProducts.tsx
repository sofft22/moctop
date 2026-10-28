"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface Props {
  onProductClick: (product: any) => void;
  onBoxClick: () => void; 
}

const MINI_BOX_PRODUCT = {
  id: "custom-mini-boxes",
  title: "Mini Boxes",
  price: "20",
  image: "/box-builder-home.PNG",
  featured: 1,
  inStock: 1,
  isCustomBox: true,
};

export function FeaturedProducts({ onProductClick, onBoxClick }: Props) {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Instantly load from localStorage
    const cached = localStorage.getItem("mocktopia_products_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const featured = parsed.filter((p: any) => p.featured === 1);
        setFeaturedItems(featured.slice(0, 5)); 
        setLoading(false);
      } catch (e) {}
    }

    // 2. Fetch fresh data in background
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const featured = data.filter((p: any) => p.featured === 1);
        setFeaturedItems(featured.slice(0, 5));
        setLoading(false);
        localStorage.setItem("mocktopia_products_cache", JSON.stringify(data));
      });
  }, []);

  if (loading) return null; 
  if (featuredItems.length === 0) return null;

  // ADD MINI BOX AS FIRST ITEM
  const displayItems = [MINI_BOX_PRODUCT, ...featuredItems];

  return (
    <section className="w-full bg-[#FBF9F5] py-16 px-4 md:py-24 md:px-6 border-t border-[#2C1A1D]/10">
      <div className="mx-auto max-w-[1400px]">
        
        <div className="mb-8 flex flex-row items-end justify-between">
          <h2 className="text-[24px] md:text-[48px] font-normal text-[#2C1A1D] whitespace-nowrap" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
            Signature Treats
          </h2>
          <Link href="/shop" className="group flex shrink-0 items-center gap-2 pb-1 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.15em] text-[#2C1A1D] transition-colors hover:opacity-60" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            <span className="border-b border-[#2C1A1D] pb-0.5 whitespace-nowrap">See More</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 lg:gap-x-5 lg:gap-y-14">
          {displayItems.map((item, idx) => (
            <div 
              key={item.id} 
              className={`${idx >= 4 ? "lg:hidden" : "block"} rounded-xl overflow-hidden group cursor-pointer`} 
              onClick={() => {
                if (item.isCustomBox) onBoxClick();
                else onProductClick(item);
              }} 
            >
              <ProductCard 
                product={{
                  ...item,
                  price: `£${item.price.toLocaleString()}`, 
                  sizes: item.isCustomBox ? [] : JSON.parse(item.sizes || "[]")
                }} 
                // PRIORITY LOADING FOR THE FIRST TWO IMAGES
                priority={idx < 2}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
