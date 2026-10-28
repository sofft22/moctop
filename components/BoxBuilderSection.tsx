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
      {/* FULL BLEED SECTION WITH SOFT OVERLAY */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-12 border-y border-[#2C1A1D]/10 overflow-hidden flex items-center justify-center">
        
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/box-builder-home.png" 
            alt="Build Your Own Box Background" 
            fill 
            className="object-cover object-center" 
          />
        </div>

        {/* SOFT CREAM OVERLAY FOR LEGIBILITY */}
        <div className="absolute inset-0 z-10 bg-[#FBF9F5]/85" />

        {/* CONTENT */}
        <div className="relative z-20 mx-auto max-w-[800px] flex flex-col items-center text-center">
          
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2C1A1D]/60 mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            The Custom Experience
          </p>

          <h2 className="text-[40px] md:text-[64px] text-[#2C1A1D] leading-[1.05] mb-6" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            Your Cravings.<br />Your Box.
          </h2>

          <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#2C1A1D]/80 mb-10 max-w-lg font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Why settle for one when you can have it all? Mix and match your favorite treats to create the ultimate box of 6 or 8. Perfectly packed for sharing (or not).
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full max-w-[280px] rounded-md bg-[#2C1A1D] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
