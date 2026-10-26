"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  
  // Smart Header State
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Handle scroll for the mini-header on mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and past 50px, hide header. If scrolling up, show header.
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If it's the login page, render children naked (no sidebar or header)
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#FBF9F5]">
      
      {/* Desktop Sidebar */}
      <AdminNav />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:pb-0 pb-[80px]">
        
        {/* SMART MINI HEADER (Mobile Only) */}
        <header 
          className={`lg:hidden fixed top-0 left-0 right-0 z-40 flex h-[60px] items-center justify-center border-b border-[#2C1A1D]/10 bg-[#FBF9F5] transition-transform duration-300 ${
            showHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <span className="text-[16px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Mocktopia
          </span>
        </header>

        {/* Spacer for the mobile mini header so content doesn't hide behind it initially */}
        <div className="lg:hidden h-[60px]" />

        {/* Page Content */}
        {children}
      </main>

    </div>
  );
}