"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LegalModal } from "./LegalModal";

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalType, setLegalType] = useState<"terms" | "privacy" | "refunds" | "allergens" | "delivery" | null>(null);

  const openLegal = (type: "terms" | "privacy" | "refunds" | "allergens" | "delivery") => {
    setLegalType(type);
    setLegalModalOpen(true);
  };

  // Exact same smooth-scroll logic as your Header
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    if (item.href) return; 
    e.preventDefault();
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

  const NAV = [
    { label: 'Signature Treats', targetId: 'signature-treats' },
    { label: 'Categories', targetId: 'categories' },
    { label: 'Shop', href: '/shop' },
    { label: 'My Orders', href: '/my-orders' },
    { label: 'About Us', targetId: 'about' },
    { label: 'Contact', targetId: 'footer' },
  ];

  return (
    <footer id="footer" className="w-full bg-[#2C1A1D] pt-20 pb-10 px-6 md:pt-24 md:px-12">
      <div className="mx-auto max-w-[1200px]">
        
        {/* 4-COLUMN LAYOUT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-baseline mb-3">
              <span 
                className="text-[22px] md:text-[24px] uppercase leading-none tracking-[0.2em] text-white"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 }}
              >
                Mocktopia
              </span>
            </Link>
            <p 
              className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] mt-2 text-white/50"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Sips & Snacks, Delivered.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 text-white/50" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
              Navigation
            </h4>
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href || `/#${item.targetId}`}
                onClick={(e) => handleNavClick(e, item)}
                className="text-[13px] text-left text-white/70 hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 text-white/50" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
              Socials
            </h4>
            <a 
              href="https://www.tiktok.com/@mocktopiatreats" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[13px] text-white/70 hover:text-white transition-colors" 
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              TikTok
            </a>
            <a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>WhatsApp</a>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 text-white/50" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
              Legal
            </h4>
            <button onClick={() => openLegal("terms")} className="text-left text-[13px] text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Terms & Conditions</button>
            <button onClick={() => openLegal("privacy")} className="text-left text-[13px] text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Privacy Policy</button>
            <button onClick={() => openLegal("delivery")} className="text-left text-[13px] text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Delivery Policy</button>
            <button onClick={() => openLegal("refunds")} className="text-left text-[13px] text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Refund Policy</button>
            <button onClick={() => openLegal("allergens")} className="text-left text-[13px] text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Allergen Info</button>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between pt-8 gap-4 md:flex-row">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-center md:text-left text-white/50" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            © {new Date().getFullYear()} Mocktopia Treats. All rights reserved.
          </p>
        </div>

      </div>

      {/* LEGAL MODAL */}
      <LegalModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        type={legalType} 
      />
    </footer>
  );
}
