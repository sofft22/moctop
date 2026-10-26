"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "home" },
  { label: "Orders", href: "/admin/orders", icon: "orders" },
  { label: "Products", href: "/admin/products", icon: "products" },
  { label: "Reviews", href: "/admin/reviews", icon: "reviews" },
  { label: "Content", href: "/admin/content", icon: "content" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

const MOBILE_TABS = NAV_ITEMS.slice(0, 3);
const MORE_ITEMS = NAV_ITEMS.slice(3);

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("mocktopia_admin_logged_in");
    router.push("/admin/login");
  };

  const renderIcon = (name: string) => {
    const cls = "h-5 w-5";
    switch (name) {
      case "home": return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case "orders": return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
      case "products": return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
      case "reviews": return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
      case "content": return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      case "settings": return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      default: return null;
    }
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#2C1A1D]/10 bg-[#FBF9F5] h-screen sticky top-0">
        <div className="flex h-[72px] items-center px-8 border-b border-[#2C1A1D]/10">
          <span className="text-[18px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Mocktopia
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-md px-4 py-3 text-[13px] font-medium transition-colors ${
                active ? "bg-[#2C1A1D] text-[#FBF9F5]" : "text-[#2C1A1D]/70 hover:bg-[#2C1A1D]/5 hover:text-[#2C1A1D]"
              }`}>
                {renderIcon(item.icon)}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#2C1A1D]/10">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] flex h-[60px] items-center justify-around border-t border-[#2C1A1D]/10 bg-[#FBF9F5] pb-safe">
        {MOBILE_TABS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${active ? "text-[#2C1A1D]" : "text-[#2C1A1D]/40"}`}>
              {renderIcon(item.icon)}
              <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
        
        {/* MORE BUTTON */}
        <button onClick={() => setMoreOpen(true)} className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${moreOpen ? "text-[#2C1A1D]" : "text-[#2C1A1D]/40"}`}>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" /></svg>
          <span className="text-[9px] font-bold uppercase tracking-wider">More</span>
        </button>
      </nav>

      {/* ================= MOBILE MORE BOTTOM SHEET ================= */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[110] flex flex-col justify-end bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setMoreOpen(false)} />
          <div className="relative w-full rounded-t-2xl bg-[#FBF9F5] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-[#2C1A1D]/20" />
            <div className="flex flex-col gap-2">
              {MORE_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} className="flex items-center gap-4 rounded-lg px-4 py-4 text-[15px] font-medium text-[#2C1A1D] hover:bg-[#2C1A1D]/5">
                  {renderIcon(item.icon)}
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-[#2C1A1D]/10" />
              <button onClick={() => { setMoreOpen(false); handleLogout(); }} className="flex items-center gap-4 rounded-lg px-4 py-4 text-[15px] font-medium text-red-600 hover:bg-red-50">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}