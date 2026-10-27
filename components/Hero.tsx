"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
        className="hero-section relative flex w-full items-center justify-center overflow-hidden bg-[#2C1A1D] mt-0 border-none outline-none"
      >
        
        {/* VIDEO BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            // The poster shows instantly while the video buffers
            poster="/hero.png"
            onCanPlay={() => setIsVideoLoaded(true)}
            className={`h-full w-full object-cover object-center transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Fallback Image: Stays visible until video is fully loaded */}
          {!isVideoLoaded && (
             <div 
               className="absolute inset-0 h-full w-full bg-cover bg-center"
               style={{ backgroundImage: "url('/hero.png')" }}
             />
          )}
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
            {/* Top Line */}
            <h1 className="text-[56px] leading-[0.9] md:text-[85px]">
              Sips
            </h1>
            
            {/* Bottom Line */}
            <h1 className="text-[56px] leading-[0.9] md:text-[85px] ml-12 md:ml-20">
              & Treats.
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
