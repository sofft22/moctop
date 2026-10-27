"use client";

import { useState, useEffect } from "react";
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
      {/* WHITE BACKGROUND SECTION (No image) */}
      <section className="w-full bg-[#FBF9F5] py-20 px-6 md:py-28 md:px-12 border-t border-[#2C1A1D]/10">
        <div className="mx-auto max-w-[800px] flex flex-col items-center text-center">
          
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2C1A1D]/50 mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Custom Experience
          </p>

          <h2 className="text-[36px] md:text-[56px] text-[#2C1A1D] leading-[1.1] mb-6" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            {config.title}
          </h2>

          <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#2C1A1D]/70 mb-10 max-w-lg" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Mix and match your favorite treats. Available in boxes of 6 or 8, perfectly packed for sharing and gifting.
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full max-w-[280px] rounded-md bg-[#2C1A1D] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Build Your Box
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
