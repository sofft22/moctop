"use client";

import { useEffect, useState } from "react";

export function AnnouncementBanner() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.bannerActive === 1 && data.bannerText) {
          setText(data.bannerText);
          setIsActive(true);
        }
      });
  }, []);

  if (!isActive || isClosed) return null;

  return (
    <div className="w-full bg-[#FBF9F5] text-[#2C1A1D] border-b border-[#2C1A1D]/10 flex h-[36px] items-center relative overflow-hidden z-50">
      
      {/* FIXED SPEAKER ICON */}
      <div className="flex-shrink-0 px-4 bg-[#FBF9F5] z-10 shadow-[4px_0_8px_-2px_rgba(251,249,245,1)]">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>

      {/* MOVING TEXT */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-marquee whitespace-nowrap absolute">
          <span className="mx-4 text-[11px] font-bold uppercase tracking-[0.15em]">{text}</span>
          <span className="mx-4 text-[11px] font-bold uppercase tracking-[0.15em]">{text}</span>
          <span className="mx-4 text-[11px] font-bold uppercase tracking-[0.15em]">{text}</span>
          <span className="mx-4 text-[11px] font-bold uppercase tracking-[0.15em]">{text}</span>
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button onClick={() => setIsClosed(true)} className="flex-shrink-0 px-4 text-[#2C1A1D]/40 hover:text-[#2C1A1D] z-10">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      {/* CSS for the marquee animation (add this to your globals.css if it isn't there) */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
