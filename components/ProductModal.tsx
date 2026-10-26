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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Header Visibility State (Hidden by default, shows on Add to Cart)
  const [showHeader, setShowHeader] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Frequently Bought Together State
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Toggle State
  const isBulkAvailable = product?.isBulk === 1;

  const displayImages = product?.images && Array.isArray(product.images) ? product.images : [product?.image];
  const [activeImage, setActiveImage] = useState(displayImages[0]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes ? JSON.parse(product.sizes)[0] : "");
      setQty(1);
      setMainImgLoaded(false);
      setAddedFlash(false);
      setShowHeader(false); // Reset header on new product
      setIsLightboxOpen(false);
      setShowReviewForm(false);
      
      const initialImg = product?.images && Array.isArray(product.images) ? product.images[0] : product.image;
      setActiveImage(initialImg);

      fetch("/api/reviews").then(res => res.json()).then(data => {
        const productReviews = data.filter((r: any) => r.productId === product.id && r.approved === 1);
        setReviews(productReviews);
      });

      fetch("/api/products").then(res => res.json()).then(data => {
        const others = data.filter((p: any) => p.id !== product.id && p.inStock === 1);
        const shuffled = others.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 4));
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
    setShowHeader(true); // Reveal header on Add to Cart
    setTimeout(() => setAddedFlash(false), 2000);
  };

  const handleBulkQuote = () => {
    const message = `Hi Mocktopia! I'd like to request a bulk quote for:%0A%0A*Product:* ${product.title}%0A*Size:* ${selectedSize}%0A%0APlease let me know the pricing and availability.`;
    window.open(`https://wa.me/2348178910628?text=${message}`, '_blank');
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

  // Dynamic Share Logic
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}?product=${product.id}` : "";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#1F1315]/80 backdrop-blur-sm md:p-8" onClick={onClose}>
        
        {/* MODAL CONTAINER: Tightened width (max-w-[980px]) for sleek desktop frame */}
        <div onClick={(e) => e.stopPropagation()} className="relative flex h-full w-full flex-col bg-[#FBF9F5] shadow-2xl md:h-auto md:max-h-[92vh] md:max-w-[980px] md:rounded-xl overflow-hidden">
          
          {/* SCROLLABLE CONTAINER: Added transform-gpu for buttery smooth scrolling */}
          <div className="flex w-full flex-1 flex-col overflow-y-auto overscroll-contain transform-gpu">
            
            {/* HEADER (Hidden by default, slides down on Add to Cart) */}
            <header 
              className={`relative z-20 flex w-full flex-col border-b border-[#2C1A1D]/10 bg-[#FBF9F5] transition-all duration-500 ease-in-out ${
                showHeader 
                  ? "opacity-100 translate-y-0 h-[60px]" 
                  : "opacity-0 -translate-y-full h-0 overflow-hidden border-transparent pointer-events-none"
              }`}
            >
              <div className="mx-auto flex h-[60px] w-full items-center justify-between px-6">
                <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
                <span className="uppercase tracking-[0.15em] text-[#2C1A1D] text-[16px] font-semibold" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>Mocktopia</span>
                <button onClick={() => setIsCartOpen(true)} className="relative text-[#2C1A1D] hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
                  {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2C1A1D] text-[9px] text-white animate-in zoom-in">{cartCount}</span>}
                </button>
              </div>
            </header>

            {/* 1. TOP SECTION (Image Left, Details Right) */}
            <div className="flex w-full flex-col md:flex-row border-b border-[#2C1A1D]/10">
              
              {/* LEFT COLUMN: Taller Image */}
              <div className="w-full md:w-1/2 shrink-0 flex flex-col bg-[#EBE0D3]">
                <div className="relative w-full h-[60vh] sm:h-[650px]">
                  <div className="relative w-full h-full cursor-zoom-in group" onClick={() => setIsLightboxOpen(true)}>
                    {!mainImgLoaded && <div className="absolute inset-0 animate-pulse bg-[#EBE0D3]" />}
                    <Image 
                      src={activeImage} 
                      alt={product.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      onLoad={() => setMainImgLoaded(true)} 
                      priority 
                    />
                  </div>
                </div>
                
                {/* Thumbnails */}
                {displayImages.length > 1 && (
                  <div className="flex gap-2 p-4 bg-white border-t border-[#2C1A1D]/10 overflow-x-auto">
                    {displayImages.map((img: string, i: number) => (
                      <button key={i} onClick={() => setActiveImage(img)} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${activeImage === img ? 'border-[#2C1A1D] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Details */}
              <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10">
                <div className="mb-6">
                  <h2 className="text-[28px] leading-tight text-[#2C1A1D] md:text-[36px]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{product.title}</h2>
                  <p className="mt-3 text-[18px] font-semibold text-[#2C1A1D]/70" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>£{product.price.toLocaleString()}</p>
                </div>

                <p className="text-[14px] leading-relaxed text-[#2C1A1D]/70 mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{product.description}</p>
                
                <hr className="mb-8 border-[#2C1A1D]/10" />

                {/* Sizes (3 per row) */}
                {sizes.length > 0 && (
                  <div className="mb-8">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Select Size</p>
                    <div className="grid grid-cols-3 gap-2">
                      {sizes.map((size: string) => (
                        <button 
                          key={size} 
                          onClick={() => setSelectedSize(size)} 
                          className={`flex h-[44px] items-center justify-center text-[10px] font-bold uppercase tracking-wide transition-all border rounded-md ${selectedSize === size ? "bg-[#2C1A1D]/60 border-[#2C1A1D]/60 text-[#FBF9F5]" : "border-[#2C1A1D]/20 text-[#2C1A1D] hover:bg-[#2C1A1D]/5"}`} 
                          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Qty</p>
                    <div className="inline-flex items-stretch overflow-hidden rounded-md border border-[#2C1A1D]/20 bg-white">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-white transition-colors">−</button>
                      <span className="flex h-10 w-12 items-center justify-center text-[13px] font-bold text-[#2C1A1D]">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-white transition-colors">+</button>
                    </div>
                  </div>

                  <button onClick={handleAdd} className={`w-full rounded-md py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${addedFlash ? "bg-[#1F1315] text-[#FBF9F5] scale-[0.98]" : "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315]"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {addedFlash ? "Added to Bag ✓" : `Add to Bag — £${totalPrice.toLocaleString()}`}
                  </button>

                  {isBulkAvailable && (
                    <button onClick={handleBulkQuote} className="w-full rounded-md border border-[#2C1A1D] py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#2C1A1D] hover:text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      Request Bulk Quote
                    </button>
                  )}
                </div>

                {/* Share Section (Official Icon) */}
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Share</p>
                  <div className="flex gap-3">
                    <a href={`https://wa.me/?text=Check out this product: ${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2C1A1D]/20 text-[#2C1A1D] hover:bg-[#2C1A1D]/5 transition-all hover:scale-105">
                      {/* Official WhatsApp Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <button onClick={copyToClipboard} className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2C1A1D]/20 text-[#2C1A1D] hover:bg-[#2C1A1D]/5 transition-all hover:scale-105">
                      {/* Clean Copy Icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BOTTOM SECTION (Full Width) */}
            <div className="w-full bg-[#FBF9F5] p-6 md:p-10">
              
              {/* Frequently Bought Together */}
              {relatedProducts.length > 0 && (
                <div className="mb-14">
                  <h3 className="mb-6 text-[24px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
                    Complete the look
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((p) => (
                      <div key={p.id} className="group cursor-pointer">
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#EBE0D3] mb-3">
                          <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <p className="text-[12px] font-semibold text-[#2C1A1D] truncate" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{p.title}</p>
                        <p className="text-[11px] text-[#2C1A1D]/60 mt-1">£{p.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h3 className="mb-6 text-[24px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Reviews</h3>
                
                {reviews.length === 0 ? (
                  <p className="text-[13px] text-[#2C1A1D]/50 mb-6">No reviews yet. Be the first to review this item.</p>
                ) : (
                  <div className="flex flex-col gap-5 mb-8">
                    {reviews.map(r => (
                      <div key={r.id} className="bg-white p-5 rounded-lg border border-[#2C1A1D]/5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[13px] font-bold text-[#2C1A1D]">{r.customerName}</p>
                          <span className="text-[12px] text-[#2C1A1D]">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="text-[14px] text-[#2C1A1D]/70 leading-relaxed">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {!showReviewForm ? (
                  <button onClick={() => setShowReviewForm(true)} className="rounded-md border border-[#2C1A1D] px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Write a Review
                  </button>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg border border-[#2C1A1D]/10 max-w-xl shadow-sm">
                    <input value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Your Name" required className="w-full rounded-md border border-[#2C1A1D]/20 px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#2C1A1D]/60">Rating:</span>
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setReviewRating(star)} className={`text-[18px] transition-colors ${star <= reviewRating ? "text-[#2C1A1D]" : "text-[#2C1A1D]/20"}`}>★</button>
                      ))}
                    </div>
                    <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Your review..." required rows={4} className="w-full rounded-md border border-[#2C1A1D]/20 px-4 py-3 text-[14px] outline-none focus:border-[#2C1A1D]" />
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 bg-[#2C1A1D] text-white text-[12px] font-bold uppercase tracking-wider rounded-md py-3 hover:bg-[#1F1315] transition-colors">Submit</button>
                      <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 text-[12px] font-bold uppercase tracking-wider text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">Cancel</button>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={() => setIsLightboxOpen(false)}>
          <Image src={activeImage} alt={product.title} fill className="object-contain" />
          <button className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      )}
    </>
  );
}
