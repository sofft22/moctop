"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing:", email);
  };

  return (
    // DARK CHOCOLATE BACKGROUND with reduced padding
    <section className="w-full bg-[#2C1A1D] py-12 md:py-16 px-6 border-t border-white/5 flex items-center justify-center">
      <div className="mx-auto max-w-[700px] w-full text-center flex flex-col items-center">
        
        <h2 
          className="text-[32px] md:text-[42px] leading-tight text-[#FBF9F5] mb-2" 
          style={{ fontFamily: 'var(--font-dm-serif), serif' }}
        >
          Join the list.
        </h2>
        
        <p 
          className="text-[11px] md:text-[12px] text-[#FBF9F5]/60 mb-6 uppercase tracking-[0.15em]" 
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Get notified when we drop fresh batches.
        </p>

        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
        >
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-[#FBF9F5]/30 px-2 py-3 text-[14px] text-[#FBF9F5] outline-none transition-all focus:border-[#FBF9F5] placeholder:text-[#FBF9F5]/30"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            required
          />
          
          <button 
            type="submit"
            className="w-full sm:w-auto shrink-0 rounded-full bg-[#FBF9F5] text-[#2C1A1D] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:scale-105 hover:bg-white"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}