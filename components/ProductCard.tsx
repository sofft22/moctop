"use client";

import { useState } from "react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: string | number;
  image: string;
  inStock?: number;
}

interface Props {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const numericPrice = typeof product.price === "number" 
    ? product.price 
    : parseInt(String(product.price).replace(/[^0-9]/g, ""), 10);

  const formattedTitle = product.title.replace(/\b\w/g, (char) => char.toUpperCase());
  const isSoldOut = product.inStock === 0;

  return (
    <div className="group flex flex-col cursor-pointer w-full">
      
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#EBE0D3]">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#EBE0D3]" />
        )}

        <Image
          src={product.image || "/placeholder.png"}
          alt={formattedTitle}
          fill
          priority={priority}
          onLoad={() => setImgLoaded(true)}
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          } ${isSoldOut ? "opacity-60 grayscale" : ""}`}
        />

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2C1A1D]">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 
          className="text-[12px] md:text-[13px] font-semibold truncate leading-[1.3] tracking-[0.01em] text-[#2C1A1D]"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {formattedTitle}
        </h3>
        
        <div className="flex items-baseline">
          {/* PRICE UPDATED: Slightly larger (14px) and thicker (font-extrabold) */}
          <p 
            className="text-[14px] font-extrabold text-[#2C1A1D]/60 tracking-tight"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            £{numericPrice.toLocaleString()}
          </p>
        </div>
      </div>

    </div>
  );
}
