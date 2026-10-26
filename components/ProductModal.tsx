"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/app/CartContext";

interface Props {
  product: any | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const { addToCart, setIsCartOpen, cartCount } = useCart(); 
  
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Bulk Quote State
  const [guests, setGuests] = useState("");
  const [isQuoteSubmitted, setIsQuoteSubmitted] = useState(false);

  const isBulkOrder = product?.isBulk === 1;

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes ? JSON.parse(product.sizes)[0] : "");
      setQty(1);
      setMainImgLoaded(false);
      setAddedFlash(false);
      setCopied(false);
      setIsLightboxOpen(false);
      setShowReviewForm(false);
      setGuests("");
      setIsQuoteSubmitted(false);

      fetch("/api/reviews").then(res => res.json()).then(data => {
        const productReviews = data.filter((r: any) => r.productId === product.id && r.approved === 1);
        setReviews(productReviews);
      });
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  const sizes = product.sizes ? JSON.parse(product.sizes) : [];
  const totalPrice = product.price * qty;

  const handleAdd = () => {
    addToCart(product, selectedSize, qty); 
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 2000);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuoteSubmitted(true);
    setTimeout(() => {
      setIsQuoteSubmitted(false);
      setGuests("");
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        customerName: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      }),
    });
    setShowReviewForm(false);
    setReviewName("");
    setReviewComment("");
    alert("Thank you! Your review has been submitted and is pending approval.");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#1F1315]/80 backdrop-blur-sm md:p-8" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="relative flex h-full w-full flex-col bg-[#FBF9F5] shadow-2xl md:h-auto md:max-h-[90vh] md:max-w-[900px] md:rounded-lg overflow-hidden">
          
          {/* HEADER */}
          <header className="relative z-10 flex w-full flex-col border-b border-[#2C1A1D]/10 bg-[#FBF9F5] shrink-0">
            <div className="mx-auto flex h-[60px] w-full items-center justify-between px-6">
              <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              <span className="uppercase tracking-[0.15em] text-[#2C1A1D] text-[16px] font-semibold" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>Mocktopia</span>
              <button onClick={() => setIsCartOpen(true)} className="relative text-[#2C1A1D]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
                {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2C1A1D] text-[9px] text-white">{cartCount}</span>}
              </button>
            </div>
          </header>

          {/* SCROLLABLE BODY */}
          <div className="flex w-full flex-1 flex-col overflow-y-auto overscroll-contain">
            
            {/* TOP SECTION: IMAGE + DETAILS STACKED */}
            <div className="flex flex-col">
              
              {/* IMAGE (Full width on all screens now) */}
              <div className="relative w-full bg-[#EBE0D3]">
                <div className="relative h-[50vh] w-full cursor-zoom-in overflow-hidden sm:h-[400px]" onClick={() => setIsLightboxOpen(true)}>
                  {!mainImgLoaded && <div className="absolute inset-0 animate-pulse bg-[#EBE0D3]" />}
                  <Image src={product.image} alt={product.title} fill className="object-cover" onLoad={() => setMainImgLoaded(true)} priority />
                </div>
              </div>

              {/* DETAILS (Below image) */}
              <div className="w-full p-6 md:p-10">
                <div className="mb-6">
                  <h2 className="text-[28px] leading-tight text-[#2C1A1D] md:text-[36px]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{product.title}</h2>
                  <p className="mt-2 text-[18px] font-semibold text-[#2C1A1D]/70" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>₦{product.price.toLocaleString()}</p>
                </div>

                <p className="text-[14px] leading-relaxed text-[#2C1A1D]/70 mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{product.description}</p>
                
                <hr className="mb-8 border-[#2C1A1D]/10" />

                {/* SIZES */}
                {sizes.length > 0 && (
                  <div className="mb-8">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Select Size</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {sizes.map((size: string) => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`flex min-h-[44px] items-center justify-center px-2 py-2 text-[11px] font-bold uppercase tracking-wide transition-all border rounded-md ${selectedSize === size ? "bg-[#2C1A1D]/70 border-[#2C1A1D]/70 text-[#FBF9F5]" : "border-[#2C1A1D]/20 text-[#2C1A1D] hover:bg-[#2C1A1D]/5"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* DYNAMIC CTA */}
                {isBulkOrder ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Bulk Order Details</p>
                    <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-3">
                      <input type="number" min="1" placeholder="Estimated guests" value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full rounded-md border border-[#2C1A1D]/20 bg-white px-4 py-3 text-[13px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D]" style={{ fontFamily: "var(--font-inter), sans-serif" }} required />
                      <button type="submit" className={`w-full rounded-md py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${isQuoteSubmitted ? "bg-green-700 text-white" : "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315]"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        {isQuoteSubmitted ? "Quote Requested ✓" : "Request Quote"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <>
                    {/* QUANTITY */}
                    <div className="mb-6 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Qty</p>
                      <div className="inline-flex items-stretch overflow-hidden rounded-md border border-[#2C1A1D]/20 bg-white">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-white">−</button>
                        <span className="flex h-10 w-12 items-center justify-center text-[13px] font-bold text-[#2C1A1D]">{qty}</span>
                        <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-white">+</button>
                      </div>
                    </div>

                    {/* ADD TO BAG */}
                    <button onClick={handleAdd} className={`w-full rounded-md py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${addedFlash ? "bg-[#1F1315] text-[#FBF9F5]" : "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315]"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      {addedFlash ? "Added to Bag ✓" : `Add to Bag — ₦${totalPrice.toLocaleString()}`}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* BOTTOM SECTION: FULL WIDTH COMPLETE THE LOOK & REVIEWS */}
            <div className="w-full border-t border-[#2C1A1D]/10 bg-[#FBF9F5] p-6 md:p-10">
              
              {/* COMPLETE THE LOOK */}
              <div className="mb-12">
                <h3 className="mb-6 text-[22px] font-normal text-[#2C1A1D] md:text-[26px]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
                  Complete the look
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Placeholder items for now, can be wired to products */}
                  <div className="bg-white p-3 rounded-md border border-[#2C1A1D]/5 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-[#EBE0D3] mb-2">
                      <Image src="/feat-mocktail-hibiscus.png" alt="Pair" fill className="object-cover" />
                    </div>
                    <p className="text-[12px] font-bold text-[#2C1A1D]">Hibiscus Mocktail</p>
                    <p className="text-[11px] text-[#2C1A1D]/50">₦3,500</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-[#2C1A1D]/5 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-[#EBE0D3] mb-2">
                      <Image src="/feat-puff-classic.png" alt="Pair" fill className="object-cover" />
                    </div>
                    <p className="text-[12px] font-bold text-[#2C1A1D]">Classic Puff Puff</p>
                    <p className="text-[11px] text-[#2C1A1D]/50">₦3,000</p>
                  </div>
                </div>
              </div>

              {/* REVIEWS */}
              <div>
                <h3 className="mb-6 text-[22px] font-normal text-[#2C1A1D] md:text-[26px]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Reviews</h3>
                
                {reviews.length === 0 ? (
                  <p className="text-[13px] text-[#2C1A1D]/50 mb-6">No reviews yet. Be the first to review this item.</p>
                ) : (
                  <div className="flex flex-col gap-5 mb-6">
                    {reviews.map(r => (
                      <div key={r.id} className="bg-white p-4 rounded-md border border-[#2C1A1D]/5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[12px] font-bold text-[#2C1A1D]">{r.customerName}</p>
                          <span className="text-[11px] text-[#2C1A1D]">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="text-[13px] text-[#2C1A1D]/70">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {!showReviewForm ? (
                  <button onClick={() => setShowReviewForm(true)} className="w-full rounded-md border border-[#2C1A1D] py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Write a Review
                  </button>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3 bg-white p-4 rounded-md border border-[#2C1A1D]/10">
                    <input value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Your Name" required className="w-full rounded border border-[#2C1A1D]/20 px-3 py-2 text-[13px]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-[#2C1A1D]/60">Rating:</span>
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setReviewRating(star)} className={`text-[16px] ${star <= reviewRating ? "text-[#2C1A1D]" : "text-[#2C1A1D]/20"}`}>★</button>
                      ))}
                    </div>
                    <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Your review..." required rows={3} className="w-full rounded border border-[#2C1A1D]/20 px-3 py-2 text-[13px]" />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-[#2C1A1D] text-white text-[11px] font-bold uppercase rounded py-2">Submit</button>
                      <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 text-[11px] font-bold uppercase text-[#2C1A1D]/50">Cancel</button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black" onClick={() => setIsLightboxOpen(false)}>
          <Image src={product.image} alt={product.title} fill className="object-contain" />
          <button className="absolute left-6 top-6 h-11 w-11 rounded-full bg-white text-black shadow-lg">✕</button>
        </div>
      )}
    </>
  );
}