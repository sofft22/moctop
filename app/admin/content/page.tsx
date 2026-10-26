"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [heroImage, setHeroImage] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [catBanana, setCatBanana] = useState("");
  const [catPuff, setCatPuff] = useState("");
  const [catMocktail, setCatMocktail] = useState("");

  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) {
        setHeroImage(data.heroImage || "");
        setHeroHeadline(data.heroHeadline || "");
        setAboutText(data.aboutText || "");
        setCatBanana(data.catBanana || "");
        setCatPuff(data.catPuff || "");
        setCatMocktail(data.catMocktail || "");
      }
      setLoading(false);
    });
  }, [router]);

  // THE BASE64 COMPRESSOR FUNCTION
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(id);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200; // Slightly larger for hero images
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress to JPEG at 70% quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setter(dataUrl);
        setUploading(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/content", {
      method: "POST",
      body: JSON.stringify({ heroImage, heroHeadline, aboutText, catBanana, catPuff, catMocktail }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex justify-center py-24 min-h-screen bg-[#FBF9F5]"><div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Website Design</p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Content & Images</h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* HERO SECTION */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Hero Section</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Headline Text</label>
                <input value={heroHeadline} onChange={e => setHeroHeadline(e.target.value)} type="text" className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
              </div>
              
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Hero Image</label>
                <div className="flex items-center gap-4">
                  {heroImage && (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3]">
                      <Image src={heroImage} alt="Hero" fill className="object-cover" />
                    </div>
                  )}
                  <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#2C1A1D]/20 bg-[#FBF9F5] py-4 text-[12px] font-bold uppercase tracking-wider text-[#2C1A1D]/60 hover:border-[#2C1A1D]">
                    {uploading === "hero" ? "Compressing..." : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setHeroImage, "hero")} disabled={!!uploading} />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[#EBE0D3] md:aspect-auto md:h-full">
              {heroImage && <Image src={heroImage} alt="Hero Preview" fill className="object-cover opacity-80" />}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-center text-[28px] text-white drop-shadow-md" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{heroHeadline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY IMAGES */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Category Images</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { label: "Banana Bread", state: catBanana, setState: setCatBanana, id: "banana" },
              { label: "Puff Puffs", state: catPuff, setState: setCatPuff, id: "puff" },
              { label: "Mocktails", state: catMocktail, setState: setCatMocktail, id: "mocktail" }
            ].map((cat) => (
              <div key={cat.id}>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{cat.label}</label>
                
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#EBE0D3] mb-3">
                  {cat.state && <Image src={cat.state} alt={cat.label} fill className="object-cover" />}
                </div>
                
                <label className="flex w-full cursor-pointer items-center justify-center rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] py-2 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]/60 hover:border-[#2C1A1D]">
                  {uploading === cat.id ? "Compressing..." : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, cat.setState, cat.id)} disabled={!!uploading} />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT TEXT */}
        <div className="rounded-lg border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[14px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>About Us Text</h2>
          <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={6} className="w-full resize-none rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3 text-[14px] leading-relaxed text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} />
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-[#2C1A1D]/10 pt-6">
          {saved && <span className="text-[13px] font-bold text-green-600 animate-pulse" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Content saved! ✓</span>}
          <button type="submit" disabled={!!uploading} className="rounded-md bg-[#2C1A1D] px-8 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] hover:shadow-md disabled:opacity-50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Save Content</button>
        </div>
      </form>
    </div>
  );
}