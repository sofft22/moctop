"use client";

import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <>
      <style>{`
        .hero-section {
          height: 83vh;
          min-height: 550px;
        }
        @media (max-width: 768px) {
          .hero-section {
            height: 73vh;
            min-height: 450px;
          }
        }
      `}</style>

      <section 
        id="hero" 
        className="hero-section relative flex w-full items-center justify-center overflow-hidden bg-[#1F1315] mt-0 border-none outline-none"
      >
        
        {/* IMAGE BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.PNG"
            alt="Mocktopia Hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 z-10 bg-black/35" />

        {/* TEXT AND BUTTON */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center px-6 text-center md:bottom-16">
          
          <div 
            className="flex flex-col items-center text-white mb-6"
            style={{ 
              fontFamily: 'var(--font-dm-serif), serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <h1 className="text-[56px] leading-[0.95] md:text-[85px]">
              Sips & Treats.
            </h1>
          </div>

          <Link 
            href="/shop" 
            className="rounded-full bg-[#2C1A1D] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 md:px-14 md:py-5 md:text-[12px] border border-white/20"
            style={{ 
              fontFamily: 'var(--font-inter), sans-serif',
              boxShadow: '0 0 25px 2px rgba(44, 26, 29, 0.4)' 
            }}
          >
            Order Now
          </Link>
        </div>
      </section>
    </>
  );
}
