"use client";

import { useState, useEffect, useRef } from "react";
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
  const [scrolled, setScrolled] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0); 

  const lastY = useRef(0);
  const ticking = useRef(false);

  const HIDE_AFTER = 120;
  const TOLERANCE = 6;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const measure = () => {
      const el = document.getElementById('hero');
      if (el) setHeroHeight(el.offsetHeight);
      else setHeroHeight(window.innerHeight); 
    };
    setTimeout(measure, 100); 
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const prev = lastY.current;
        const diff = y - prev;

        setScrolled(y);

        if (y > HIDE_AFTER && diff > TOLERANCE) {
          setHidden(true);
        } else if (diff < -TOLERANCE || y <= HIDE_AFTER) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overHero = heroHeight === 0 || scrolled < heroHeight - 40; 
  const textClass = overHero ? 'text-white' : 'text-[#2C1A1D]';

  // UPDATED NAVIGATION WITH CORRECT TARGETS
  const NAV = [
    { label: 'Signature Treats', targetId: 'signature-treats' },
    { label: 'Categories', targetId: 'categories' },
    { label: 'Shop', href: '/shop' },
    { label: 'My Orders', href: '/my-orders' },
    { label: 'About Us', targetId: 'about' },
    { label: 'Contact', targetId: 'footer' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    if (item.href) return; // Let standard links (like Shop) work normally
    
    e.preventDefault();
    setMobileMenuOpen(false);

    const scrollToTarget = () => {
      const el = document.getElementById(item.targetId);
      if (el) {
        const yOffset = -80; // Offset for the fixed header
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (pathname === '/') {
      scrollToTarget();
    } else {
      // If on a different page (like Shop), go to home first, then scroll
      router.push('/');
      setTimeout(scrollToTarget, 500); // Small delay to let the page load
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-40 transition-[background-color,border-color,transform,color] duration-300 ease-out ${
          hidden && !overHero ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{
          backgroundColor: overHero ? 'transparent' : '#FBF9F5', 
          borderBottom: overHero ? '1px solid transparent' : '1px solid rgba(44, 26, 29, 0.1)'
        }}
      >
        {/* DESKTOP LAYOUT */}
        <div className="mx-auto hidden h-[72px] max-w-7xl grid-cols-3 items-center px-8 lg:grid">
          
          <div className="flex justify-start">
            <Link href="/" className="flex items-center">
              <span
                className={`uppercase leading-none tracking-[0.15em] transition-colors duration-300 text-[18px] ${textClass}`}
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 }}
              >
                Mocktopia
              </span>
            </Link>
          </div>

          <nav className="flex items-center justify-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href || `/#${item.targetId}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`whitespace-nowrap text-[11.5px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:opacity-60 ${textClass}`}
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
              className={`relative flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:opacity-70 ${textClass}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              {cartCount > 0 && (
                <span
                  className={`absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9.5px] font-bold leading-none transition-colors duration-300 ${
                    overHero ? 'bg-white text-black' : 'bg-[#2C1A1D] text-white'
                  }`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="mx-auto flex h-[56px] max-w-7xl items-center justify-between px-5 lg:hidden">
          <div className="flex w-16 items-center justify-start">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className={`-ml-2 flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:opacity-70 ${textClass}`}
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
                className={`uppercase leading-none tracking-[0.15em] transition-colors duration-300 text-[16px] ${textClass}`}
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
              className={`relative flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:opacity-70 ${textClass}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              {cartCount > 0 && (
                <span
                  className={`absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9.5px] font-bold leading-none transition-colors duration-300 ${
                    overHero ? 'bg-white text-black' : 'bg-[#2C1A1D] text-white'
                  }`}
                >
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
          }`}
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
      </header>
      
      <div 
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}