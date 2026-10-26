"use client";

import { useState } from "react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface Props {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group flex flex-col cursor-pointer w-[95%] mx-auto">
      
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#EBE0D3]">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#EBE0D3]" />
        )}

        <Image
          src={product.image}
          alt={product.title}
          fill
          priority={priority}
          onLoad={() => setImgLoaded(true)}
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="mt-2 text-left">
        <h3 
          className="text-[12px] md:text-[13px] font-medium normal-case truncate leading-[1.3] tracking-[0.02em] text-[#2C1A1D]"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {product.title}
        </h3>
        
        <div className="mt-1 flex items-baseline gap-1">
          {/* REDUCED PRICE SIZE HERE */}
          <p 
            className="text-[12px] md:text-[13px] font-light tracking-[0.02em] text-[#2C1A1D]/60"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {product.price}
          </p>
        </div>
      </div>

    </div>
  );
}