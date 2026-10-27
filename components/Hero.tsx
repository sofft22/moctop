"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
  // We use a scroll container for a native, ultra-smooth swipe experience
  const scrollRef = useRef<HTMLDivElement>(null);

  // You can replace these with your 3 actual image paths
  const heroImages = [
    "/hero.png",
    "/hero-2.png",
    "/hero-3.png"
  ];

  return (
    <>
      <style>{`
        .hero-section {
          /* Reduced height by 2vh from 85vh */
          height: 83vh;
          min-height: 550px;
        }
        @media (max-width: 768px) {
          .hero-section {
            /* Reduced height by 2vh from 75vh */
            height: 73vh;
            min-height: 450px;
          }
        }
        /* Hide scrollbar for the swiping effect */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <section 
        id="hero" 
        className="hero-section relative w-full overflow-hidden bg-[#2C1A1D] mt-0 border-none outline-none"
      >
        
        {/* SWIPEABLE IMAGES CONTAINER */}
        <div 
          ref={scrollRef}
          className="absolute inset-0 z-0 flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        >
          {heroImages.map((src, index) => (
            <div 
              key={index} 
              className="relative w-full h-full shrink-0 snap-center"
            >
              <Image
                src={src}
                alt={`Mocktopia Hero ${index + 1}`}
                fill
                className="object-cover object-center"
                priority={index === 0} // Only the first image loads instantly
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 z-10 bg-black/35 pointer-events-none" />

        {/* TEXT AND BUTTON (Must be pointer-events-none so swiping works, but button needs pointer-events-auto) */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center px-6 text-center md:bottom-16 pointer-events-none">
          
          <h1 
            className="text-[48px] leading-[1.05] text-white md:text-[80px]"
            style={{ 
              fontFamily: 'var(--font-dm-serif), serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.15)',
              marginBottom: '16px' 
            }}
          >
           Sips & Treats.
          </h1>

          <Link 
            href="/shop" 
            className="pointer-events-auto rounded-full bg-[#2C1A1D] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 md:px-14 md:py-5 md:text-[12px] border border-white/20"
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
