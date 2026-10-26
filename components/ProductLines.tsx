"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function ProductLines() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  if (loading || !content) return null;

  const categories = [
    {
      id: "banana-bread",
      title: "Banana Bread",
      image: content.catBanana || "/category-banana-bread.png", // Fallback just in case
      link: "/shop"
    },
    {
      id: "puff-puffs",
      title: "Puff Puffs",
      image: content.catPuff || "/category-puff-puffs.png",
      link: "/shop"
    },
    {
      id: "mocktails",
      title: "Mocktails",
      image: content.catMocktail || "/category-mocktails.png",
      link: "/shop"
    }
  ];

  return (
    <section id="categories" className="w-full bg-[#FBF9F5] py-16 px-4 md:py-24 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        
        <div className="mb-10 flex items-end justify-between">
          <h2 
            className="text-[24px] md:text-[48px] font-normal text-[#2C1A1D]"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            Shop by Category
          </h2>
        </div>

        {/* 
          MOBILE: Stacked (flex-col)
          TABLET & DESKTOP: 3 columns side by side (md:grid-cols-3) 
        */}
        <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="group relative w-full overflow-hidden rounded-md aspect-[4/5] md:aspect-[3/4] bg-[#EBE0D3]"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A1D]/80 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 
                  className="text-[24px] text-[#FBF9F5] md:text-[32px]"
                  style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                >
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}