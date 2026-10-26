"use client";

import { useState } from "react";
import Image from "next/image";

export function BulkQuote() {
  const [guests, setGuests] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting bulk quote for:", guests, "guests");
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center py-24 px-6 md:py-32 overflow-hidden">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/category-banana-bread.png" 
          alt="Bulk Orders Background"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* 80% DARK CHOCOLATE OVERLAY */}
      <div className="absolute inset-0 z-10 bg-[#2C1A1D]/80" />

      {/* CONTENT */}
      <div className="relative z-20 mx-auto max-w-[800px] w-full flex flex-col items-center text-center">
        
        <h2 
          className="text-[40px] md:text-[64px] leading-[1.05] text-[#FBF9F5] mb-4"
          style={{ fontFamily: 'var(--font-dm-serif), serif' }}
        >
          Feeding a crowd?
        </h2>

        <p 
          className="text-[13px] md:text-[15px] leading-relaxed text-[#FBF9F5]/70 mb-10 max-w-md"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Bulk orders are planned around your guest count. Tell us how many people you're expecting, and we'll handle the catering.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row items-center gap-4">
          
          <div className="flex flex-col w-full text-left">
            <label 
              htmlFor="guests" 
              className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5]/60 mb-2 ml-1"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Number of guests
            </label>
            <input
              id="guests"
              type="number"
              min="1"
              placeholder="e.g. 100"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent border-b border-[#FBF9F5]/30 px-1 py-3 text-[16px] text-[#FBF9F5] outline-none transition-all focus:border-[#FBF9F5] placeholder:text-[#FBF9F5]/30"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto shrink-0 mt-6 sm:mt-0 rounded-full bg-[#FBF9F5] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:scale-105 hover:bg-white"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Request Quote
          </button>
        </form>

      </div>
    </section>
  );
}