import Link from "next/link";

interface FooterProps {
  variant?: "dark" | "light";
}

export function Footer({ variant = "dark" }: FooterProps) {
  const isLight = variant === "light";

  // Dynamic classes based on the variant
  const bgClass = isLight ? "bg-[#FBF9F5]" : "bg-[#2C1A1D]";
  const textClass = isLight ? "text-[#2C1A1D]" : "text-white";
  const textMutedClass = isLight ? "text-[#2C1A1D]/50" : "text-white/50";
  const textLinkClass = isLight ? "text-[#2C1A1D]/70 hover:text-[#2C1A1D]" : "text-white/70 hover:text-white";
  const borderClass = isLight ? "border-[#2C1A1D]/10" : "border-white/10";

  return (
    <footer className={`w-full ${bgClass} pt-20 pb-10 px-6 md:pt-24 md:px-12 transition-colors duration-300`}>
      <div className="mx-auto max-w-[1200px]">
        
        {/* 5-COLUMN LAYOUT */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-6 pb-16 border-b ${borderClass}`}>
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-baseline mb-3">
              <span 
                className={`text-[20px] md:text-[24px] uppercase leading-none tracking-[0.2em] ${textClass}`}
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500 }}
              >
                Mocktopia
              </span>
            </Link>
            <p 
              className={`text-[10px] md:text-[11px] uppercase tracking-[0.15em] mt-2 ${textMutedClass}`}
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Sips & Snacks, Delivered.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ${textMutedClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Shop</h4>
            <Link href="/shop" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>All Treats</Link>
            <Link href="/shop" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Banana Bread</Link>
            <Link href="/shop" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Puff Puffs</Link>
            <Link href="/shop" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Mocktails</Link>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ${textMutedClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Company</h4>
            <Link href="/about" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Our Story</Link>
            <Link href="/bulk" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Catering & Bulk</Link>
            <Link href="/contact" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Contact</Link>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ${textMutedClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Follow Us</h4>
            <a href="#" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Instagram</a>
            <a href="#" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>TikTok</a>
            <a href="#" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>WhatsApp</a>
          </div>

          {/* Column 5: Legal */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ${textMutedClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Legal</h4>
            <Link href="#" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Privacy Policy</Link>
            <Link href="#" className={`text-[13px] transition-colors ${textLinkClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Terms of Service</Link>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between pt-8 gap-4 md:flex-row">
          <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-center md:text-left ${textMutedClass}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            © {new Date().getFullYear()} Mocktopia Treats. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}