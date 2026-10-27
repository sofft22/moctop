"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/app/CartContext"; 

export function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  
  // HIDE THE HEADER IF WE ARE IN THE ADMIN SECTION
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // BANNER STATE
  const [bannerText, setBannerText] = useState("");
  const [bannerActive, setBannerActive] = useState(false);
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  // FETCH BANNER DATA
  useState(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.bannerActive === 1 && data.bannerText) {
          setBannerText(data.bannerText);
          setBannerActive(true);
        }
      });
  });

  const NAV = [
    { label: 'Signature Treats', targetId: 'signature-treats' },
    { label: 'Categories', targetId: 'categories' },
    { label: 'Shop', href: '/shop' },
    { label: 'My Orders', href: '/my-orders' },
    { label: 'About Us', targetId: 'about' },
    { label: 'Contact', targetId: 'footer' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    if (item.href) return;
    
    e.preventDefault();
    setMobileMenuOpen(false);

    const scrollToTarget = () => {
      const el = document.getElementById(item.targetId);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (pathname === '/') {
      scrollToTarget();
    } else {
      router.push('/');
      setTimeout(scrollToTarget, 500);
    }
  };

  const showBanner = bannerActive && !isBannerClosed;

  return (
    <div className="relative w-full z-40 bg-[#FBF9F5] border-b border-[#2C1A1D]/10 shadow-sm">
      
      {/* ANNOUNCEMENT BANNER (STACKED ON TOP) */}
      {showBanner && (
        <div className={`w-full flex h-[32px] items-center justify-center relative overflow-hidden bg-[#2C1A1D] text-[#FBF9F5]`}>
          
          {/* Fixed Speaker Icon */}
          <div className="flex-shrink-0 px-4 z-10">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>

          {/* Moving Text */}
          <div className="flex-1 overflow-hidden relative h-full flex items-center">
            <div className="animate-marquee whitespace-nowrap absolute flex">
              <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.15em]">{bannerText}</span>
              <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.15em]">{bannerText}</span>
              <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.15em]">{bannerText}</span>
              <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.15em]">{bannerText}</span>
            </div>
          </div>

          {/* Close Button */}
          <button onClick={() => setIsBannerClosed(true)} className="flex-shrink-0 px-4 opacity-50 hover:opacity-100 z-10 transition-opacity">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      )}

      {/* DESKTOP LAYOUT */}
      <div className="mx-auto hidden h-[72px] w-full max-w-7xl grid-cols-3 items-center px-8 lg:grid">
        
        <div className="flex justify-start">
          <Link href="/" className="flex items-center">
            <span
              className="uppercase leading-none tracking-[0.15em] text-[18px] text-[#2C1A1D]"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 }}
            >
              Mocktopia
            </span>
          </Link>
        </div>

        <nav className="flex items-center justify-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href || `/#${item.targetId}`}
              onClick={(e) => handleNavClick(e, item)}
              className="whitespace-nowrap text-[10px] font-normal tracking-[0.15em] uppercase text-[#2C1A1D] transition-colors duration-300 hover:opacity-60"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-end items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center text-[#2C1A1D] transition-colors duration-300 hover:opacity-70"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9.5px] font-bold leading-none bg-[#2C1A1D] text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="mx-auto flex h-[56px] w-full max-w-7xl items-center justify-between px-5 lg:hidden">
        <div className="flex w-16 items-center justify-start">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="-ml-2 flex h-10 w-10 items-center justify-center text-[#2C1A1D] transition-colors duration-300 hover:opacity-70"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-[18px] w-[18px]">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-[18px] w-[18px]">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Link href="/" className="flex items-center">
            <span
              className="uppercase leading-none tracking-[0.15em] text-[16px] text-[#2C1A1D]"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 }}
            >
              Mocktopia
            </span>
          </Link>
        </div>

        <div className="flex w-16 items-center justify-end gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center text-[#2C1A1D] transition-colors duration-300 hover:opacity-70"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9.5px] font-bold leading-none bg-[#2C1A1D] text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div 
        className={`absolute top-[56px] left-4 right-4 z-50 overflow-hidden rounded-2xl bg-[#FBF9F5] shadow-2xl transition-all duration-300 ease-in-out lg:hidden border border-[#2C1A1D]/10 ${
          mobileMenuOpen ? 'max-h-[400px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
        } ${showBanner ? 'top-[88px]' : 'top-[56px]'}`}
      >
        <nav className="flex flex-col p-2">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href || `/#${item.targetId}`}
              onClick={(e) => handleNavClick(e, item)}
              className="flex items-center justify-between rounded-xl px-4 py-4 text-[13px] uppercase tracking-[0.1em] text-[#2C1A1D] transition-colors hover:bg-[#2C1A1D]/5"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
