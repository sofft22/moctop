"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function OurStory() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  // Use the hero image from content, or a fallback if it's not set
  const storyImage = content?.heroImage || "/category-banana-bread.png";

  return (
    <section id="about" className="w-full bg-[#FBF9F5]">
      
      {/* FULL BLEED IMAGE */}
      <div className="relative h-[50vh] w-full md:h-[70vh]">
        <Image
          src={storyImage}
          alt="Our Story"
          fill
          className="object-cover"
          priority
        />
        {/* Optional subtle overlay to blend with the cream background */}
        <div className="absolute inset-0 bg-[#2C1A1D]/10" />
      </div>

      {/* TEXT SECTION (Directly under the image) */}
      <div className="mx-auto max-w-[800px] px-6 py-16 md:py-24 text-center">
        <h2 
          className="mb-6 text-[32px] text-[#2C1A1D] md:text-[48px]"
          style={{ fontFamily: 'var(--font-dm-serif), serif' }}
        >
          Our Story
        </h2>
        
        <p 
          className="text-[15px] leading-[1.9] text-[#2C1A1D]/75 md:text-[17px]"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {content?.aboutText || "Mocktopia was born from a simple love for baking. Every loaf is baked fresh, every puff is golden, and every sip is crafted to perfection."}
        </p>
      </div>

    </section>
  );
}