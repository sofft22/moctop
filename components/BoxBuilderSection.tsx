"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
      <section className="w-full bg-[#2C1A1D] py-16 px-6 md:py-24 md:px-12">
        <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* IMAGE SIDE: Shorter height, perfect aspect ratio */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full aspect-[4/3] md:aspect-square max-h-[450px] overflow-hidden rounded-xl bg-[#EBE0D3] shadow-lg">
              <Image 
                src="/box-builder-home.png" 
                alt="Build Your Own Box" 
                fill 
                className="object-cover object-center" 
              />
            </div>
          </div>

          {/* TEXT SIDE: Short, punchy, smart spacing */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
            <h2 className="text-[36px] md:text-[48px] text-[#FBF9F5] leading-[1.1] mb-4" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              {config.title}
            </h2>

            <p className="text-[14px] md:text-[16px] leading-[1.6] text-[#FBF9F5]/70 mb-8 max-w-sm mx-auto md:mx-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Mix and match your favorite treats. Available in boxes of 6 or 8, perfectly packed for sharing.
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-[240px] rounded-md bg-[#FBF9F5] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#EBE0D3] mx-auto md:mx-0"
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
