"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const toggleApproval = async (id: string, currentApproved: number) => {
    const newApproved = currentApproved === 1 ? 0 : 1;
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: newApproved } : r));
    await fetch("/api/reviews", {
      method: "PUT",
      body: JSON.stringify({ id, approved: newApproved }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    setReviews(reviews.filter(r => r.id !== id));
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Community</p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Reviews</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>
      ) : reviews.length === 0 ? (
        <p className="py-20 text-center text-[13px] font-medium text-[#2C1A1D]/50">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-[#2C1A1D]/10 bg-white rounded-lg p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{r.customerName}</p>
                  <span className="text-[13px] text-[#2C1A1D]">{"★".repeat(r.rating)}<span className="text-[#2C1A1D]/20">{"★".repeat(5 - r.rating)}</span></span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${r.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {r.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-[#2C1A1D]/80 mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>"{r.comment}"</p>
              
              <div className="flex items-center gap-4 border-t border-[#2C1A1D]/10 pt-3">
                <button onClick={() => toggleApproval(r.id, r.approved)} className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {r.approved ? "Unapprove" : "Approve"}
                </button>
                <button onClick={() => handleDelete(r.id)} className="text-[10px] font-bold uppercase tracking-wider text-red-600" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}