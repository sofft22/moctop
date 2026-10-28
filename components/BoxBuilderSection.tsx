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
      {/* REDUCED MOBILE PADDING */}
      <section className="relative w-full py-16 md:py-28 px-6 md:px-12 border-y border-[#2C1A1D]/10 overflow-hidden flex items-center justify-center">
        
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/box-builder-home.png" 
            alt="Build Your Own Box Background" 
            fill 
            className="object-cover object-center" 
          />
        </div>

        {/* VERY SUBTLE DARK TINT */}
        <div className="absolute inset-0 z-10 bg-black/10" />

        {/* COMPACT FROSTED GLASS CARD */}
        <div className="relative z-20 mx-auto max-w-[800px] w-full bg-[#FBF9F5]/85 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl p-6 md:p-16 flex flex-col items-center text-center">
          
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-[#2C1A1D]/60 mb-3 md:mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            The Custom Experience
          </p>

          <h2 className="text-[32px] md:text-[56px] text-[#2C1A1D] leading-[1.05] mb-4 md:mb-6" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            Your Cravings.<br />Your Box.
          </h2>

          {/* SHORTENED TEXT FOR MOBILE */}
          <p className="text-[14px] md:text-[17px] leading-[1.6] text-[#2C1A1D]/80 mb-6 md:mb-10 max-w-lg" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Mix and match your favorite treats to create the ultimate box of 6 or 8.
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full max-w-[260px] md:max-w-[280px] rounded-md bg-[#2C1A1D] px-6 py-3.5 md:px-8 md:py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] shadow-lg"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Start Building
          </button>
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
