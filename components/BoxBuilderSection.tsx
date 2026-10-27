"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/app/CartContext";
import { BoxBuilderModal } from "./BoxBuilderModal";

export function BoxBuilderSection() {
  const [config, setConfig] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data && data.boxBuilderConfig) {
        try {
          const parsed = JSON.parse(data.boxBuilderConfig);
          if (parsed.isActive && parsed.toppings.length > 0) {
            setConfig(parsed);
          }
        } catch (e) {}
      }
    });
  }, []);

  if (!config) return null;

  return (
    <>
      <section className="w-full bg-[#2C1A1D] py-20 px-6 md:py-24 md:px-12">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
          
          {/* IMAGE SIDE (Now a perfect square, grounded, no saggy empty space) */}
          <div className="w-full md:w-[50%] flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-2xl bg-[#EBE0D3] shadow-xl">
              <Image 
                src="/box-builder-home.png" 
                alt="Build Your Own Box" 
                fill 
                className="object-cover object-center" 
              />
            </div>
          </div>

          {/* TEXT SIDE (Perfectly centered vertically) */}
          <div className="w-full md:w-[50%] flex flex-col justify-center text-center md:text-left md:pl-4">
            <h2 className="text-[36px] md:text-[54px] text-[#FBF9F5] leading-[1.05] mb-5" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              {config.title}
            </h2>

            <p className="text-[15px] md:text-[16px] leading-[1.7] text-[#FBF9F5]/70 mb-8 max-w-md mx-auto md:mx-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Build your perfect box. Choose your favorite treats and customize it exactly how you want, available in boxes of {config.slots} or more.
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-[280px] rounded-md bg-[#FBF9F5] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#EBE0D3] mx-auto md:mx-0"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Build Your Box
            </button>
          </div>

        </div>
      </section>

      {isModalOpen && (
        <BoxBuilderModal 
          config={config} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
