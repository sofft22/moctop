"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminContentPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Content State
  const [heroImage, setHeroImage] = useState("/hero-bg.png");
  const [heroHeadline, setHeroHeadline] = useState("Treats & sips.");
  const [aboutText, setAboutText] = useState("Mocktopia was born from a simple love for baking...");
  
  const [catBanana, setCatBanana] = useState("/category-banana-bread.png");
  const [catPuff, setCatPuff] = useState("/category-puff-puffs.png");
  const [catMocktail, setCatMocktail] = useState("/category-mocktails.png");

  useEffect(() => {
    // Auth Check
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }

    // Load existing content
    const savedContent = localStorage.getItem("mocktopia_content");
    if (savedContent) {
      const parsed = JSON.parse(savedContent);
      if (parsed.heroImage) setHeroImage(parsed.heroImage);
      if (parsed.heroHeadline) setHeroHeadline(parsed.heroHeadline);
      if (parsed.aboutText) setAboutText(parsed.aboutText);
      if (parsed.catBanana) setCatBanana(parsed.catBanana);
      if (parsed.catPuff) setCatPuff(parsed.catPuff);
      if (parsed.catMocktail) setCatMocktail(parsed.catMocktail);
    }

    setLoading(false);
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContent = {
      heroImage,
      heroHeadline,
      aboutText,
      catBanana,
      catPuff,
      catMocktail,
    };

    localStorage.setItem("mocktopia_content", JSON.stringify(newContent));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 min-h-screen bg-[#FBF9F5]">
        <div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Website Design
        </p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
          Content & Images
        </h1>
        <p className="mt-2 text-[13px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Manage the visual appearance of your storefront.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* SECTION 1: HERO SECTION */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Hero Section
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  Headline Text
                </label>
                <input 
                  value={heroHeadline} onChange={e => setHeroHeadline(e.target.value)} 
                  type="text" placeholder="Treats & sips." 
                  className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" 
                  style={{ fontFamily: "var(--font-inter), sans-serif" }} 
                />
              </div>
              
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  Background Image URL
                </label>
                <input 
                  value={heroImage} onChange={e => setHeroImage(e.target.value)} 
                  type="text" placeholder="/hero-bg.png" 
                  className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" 
                  style={{ fontFamily: "var(--font-inter), sans-serif" }} 
                />
              </div>
            </div>
            
            {/* Hero Preview */}
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[#EBE0D3] md:aspect-auto md:h-full">
              <Image src={heroImage} alt="Hero Preview" fill className="object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-center text-[28px] text-white drop-shadow-md" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
                  {heroHeadline}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CATEGORY IMAGES */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Category Images
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Banana Bread */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Banana Bread</label>
              <input value={catBanana} onChange={e => setCatBanana(e.target.value)} type="text" placeholder="/category-banana-bread.png" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-2 text-[12px] outline-none focus:border-[#2C1A1D] mb-3" />
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#EBE0D3]">
                <Image src={catBanana} alt="Banana Bread Preview" fill className="object-cover" />
              </div>
            </div>

            {/* Puff Puffs */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Puff Puffs</label>
              <input value={catPuff} onChange={e => setCatPuff(e.target.value)} type="text" placeholder="/category-puff-puffs.png" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-2 text-[12px] outline-none focus:border-[#2C1A1D] mb-3" />
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#EBE0D3]">
                <Image src={catPuff} alt="Puff Puffs Preview" fill className="object-cover" />
              </div>
            </div>

            {/* Mocktails */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Mocktails</label>
              <input value={catMocktail} onChange={e => setCatMocktail(e.target.value)} type="text" placeholder="/category-mocktails.png" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-2 text-[12px] outline-none focus:border-[#2C1A1D] mb-3" />
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#EBE0D3]">
                <Image src={catMocktail} alt="Mocktails Preview" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ABOUT TEXT */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            About Us Text
          </h2>
          <textarea 
            value={aboutText} onChange={e => setAboutText(e.target.value)} 
            rows={6} 
            className="w-full resize-none rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] leading-relaxed text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" 
            style={{ fontFamily: "var(--font-inter), sans-serif" }} 
          />
        </div>

        {/* ACTION BUTTON */}
        <div className="flex items-center justify-end gap-4 border-t border-[#2C1A1D]/10 pt-6">
          {saved && (
            <span className="text-[13px] font-bold text-green-600 animate-pulse" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Content saved successfully! ✓
            </span>
          )}
          <button 
            type="submit" 
            className="rounded-md bg-[#2C1A1D] px-8 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] hover:shadow-md"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Save Content
          </button>
        </div>

      </form>
    </div>
  );
}