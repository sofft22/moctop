"use client";

import Link from "next/link";

export function OurStory() {
  return (
    <section id="about" className="w-full bg-[#FBF9F5]">
      
      {/* HEADER SECTION */}
      <div className="mx-auto max-w-[800px] px-6 pt-16 pb-10 md:pt-24 md:pb-12 flex flex-col items-center text-center">
        <h2 
          className="text-[36px] md:text-[56px] text-[#2C1A1D] leading-tight"
          style={{ fontFamily: 'var(--font-dm-serif), serif' }}
        >
          Our Story
        </h2>
        <div className="w-12 h-[1px] bg-[#2C1A1D]/20 mt-6" />
      </div>

      {/* FULL BLEED VIDEO (Increased Height) */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-[#1F1315] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* TEXT SECTION */}
      <div className="mx-auto max-w-[800px] px-6 py-16 md:py-24 flex flex-col items-center text-center">
        
        <p 
          className="text-[15px] font-semibold leading-[1.6] text-[#2C1A1D] md:text-[18px] mb-8 uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
        >
          A Love of Baking. A Passion for Creating.
        </p>

        <p 
          className="text-[15px] leading-[1.8] text-[#2C1A1D]/70 md:text-[16px] mb-6 max-w-[650px]"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Mocktopia Treats was born from my love of baking, pastries and experimenting with exciting mocktail flavours. What started as a hobby — making treats for friends and family — gradually grew into something more.
        </p>

        <p 
          className="text-[15px] leading-[1.8] text-[#2C1A1D]/70 md:text-[16px] mb-8 max-w-[650px]"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          My love for banana bread took off after baking in bulk for my daughter’s first birthday, where the treats were a hit! Today, I’m turning that passion into a brand dedicated to creating delicious treats and refreshing mocktails for life’s special moments.
        </p>

        <p 
          className="text-[16px] md:text-[18px] text-[#2C1A1D]"
          style={{ fontFamily: 'var(--font-dm-serif), serif', fontStyle: 'italic' }}
        >
          Mocktopia Treats — made with love, served with joy.
        </p>

      </div>
    </section>
  );
}
