"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[32px] md:text-[48px] text-[#2C1A1D] mb-4" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
        Something went wrong
      </h1>
      <p className="text-[14px] text-[#2C1A1D]/60 mb-8 max-w-md" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        We apologize for the inconvenience. An unexpected error occurred while loading this page.
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-md bg-[#2C1A1D] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border border-[#2C1A1D] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#2C1A1D] hover:text-white"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
