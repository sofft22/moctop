"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/app/CartContext";

interface Props {
  product: any | null;
  onClose: () => void;
  allProducts?: any[]; 
}

export function ProductModal({ product, onClose, allProducts = [] }: Props) {
  const { addToCart, setIsCartOpen, cartCount } = useCart(); 
  
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false); 
  
  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // FBT State
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Safe parsing of sizes
  let parsedSizes: { size: string; price: number }[] = [];
  try {
    if (product?.sizes) {
      const parsed = JSON.parse(product.sizes);
      if (Array.isArray(parsed)) {
        parsedSizes = parsed.map((s: any) => {
          if (typeof s === "string") return { size: s, price: product.price };
          return { size: s.size, price: s.price || product.price };
        });
      }
    }
  } catch (e) {}

  // Safe parsing of images
  let displayImages: string[] = [];
  try {
    if (product?.images) {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) displayImages = parsed;
    }
  } catch (e) {}
  
  if (displayImages.length === 0 && product?.image) {
    displayImages = [product.image];
  }

  const [activeImage, setActiveImage] = useState(displayImages[0] || "");

  const isSoldOut = product?.inStock === 0;
  const isBulkAvailable = product?.isBulk === 1;

  useEffect(() => {
    if (product) {
      setSelectedSize(parsedSizes.length > 0 ? parsedSizes[0].size : "");
      setQty(1);
      setMainImgLoaded(false);
      setAddedFlash(false);
      setShowHeader(false);
      setIsLightboxOpen(false);
      setShowReviewForm(false);
      setActiveImage(displayImages[0] || "");

      fetch("/api/reviews").then(res => res.json()).then(data => {
        const productReviews = data.filter((r: any) => r.productId === product.id && r.approved === 1);
        setReviews(productReviews);
      }).catch(() => {});

      // INSTANT FBT LOGIC
      let pool = allProducts;
      if (pool.length === 0) {
        const cached = localStorage.getItem("mocktopia_products_cache");
        if (cached) {
          try { pool = JSON.parse(cached); } catch (e) {}
        }
      }
      
      if (pool.length > 0) {
        const others = pool.filter((p: any) => p.id !== product.id && p.inStock === 1);
        const shuffled = [...others].sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 4)); // Max 4
      }
    }
  }, [product, allProducts]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  const currentSizeObj = parsedSizes.find(s => s.size === selectedSize);
  const currentPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const totalPrice = currentPrice * qty;

  const handleAdd = () => {
    if (isSoldOut) return;
    addToCart({ ...product, price: currentPrice }, selectedSize, qty); 
    setAddedFlash(true);
    setShowHeader(true); 
    setTimeout(() => {
      setAddedFlash(false);
      setShowHeader(false);
    }, 3000);
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

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}?product=${product.id}` : "";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#1F1315]/80 backdrop-blur-sm md:p-8" onClick={onClose}>
        
        <div onClick={(e) => e.stopPropagation()} className="relative flex h-full w-full flex-col bg-[#FBF9F5] shadow-2xl md:h-auto md:max-h-[92vh] md:max-w-[980px] md:rounded-xl overflow-hidden">
          
          <div className="flex w-full flex-1 flex-col overflow-y-auto overscroll-contain scroll-smooth">
            
            <header 
              className={`relative z-20 flex w-full flex-col border-b border-[#2C1A1D]/10 bg-[#FBF9F5] transition-transform duration-300 ${
                showHeader ? "translate-y-0" : ""
              }`}
            >
              <div className="mx-auto flex h-[60px] w-full items-center justify-between px-6">
                <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
                <span className="uppercase tracking-[0.15em] text-[#2C1A1D] text-[16px] font-semibold" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>Mocktopia</span>
                <button onClick={() => setIsCartOpen(true)} className="relative text-[#2C1A1D] hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
                  {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2C1A1D] text-[9px] text-white">{cartCount}</span>}
                </button>
              </div>
            </header>

            <div className="flex w-full flex-col md:flex-row border-b border-[#2C1A1D]/10">
              
              <div className="w-full md:w-1/2 shrink-0 flex flex-col bg-[#EBE0D3]">
                <div className="relative w-full h-[60vh] sm:h-[650px]">
                  <div className="relative w-full h-full cursor-zoom-in group" onClick={() => setIsLightboxOpen(true)}>
                    {!mainImgLoaded && <div className="absolute inset-0 animate-pulse bg-[#EBE0D3]" />}
                    <Image 
                      src={activeImage || "/placeholder.png"} 
                      alt={product.title} 
                      fill 
                      className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'opacity-80 grayscale-[50%]' : ''}`}
                      onLoad={() => setMainImgLoaded(true)} 
                      priority 
                    />
                    
                    {isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className="bg-white/90 px-6 py-2 text-[14px] font-bold uppercase tracking-widest text-[#2C1A1D] rounded-sm shadow-sm">Sold Out</span>
                      </div>
                    )}
                  </div>
                </div>
                
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

              <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10">
                <div className="mb-6">
                  <h2 className="text-[28px] leading-tight text-[#2C1A1D] md:text-[36px]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{product.title}</h2>
                  <p className="mt-3 text-[18px] font-semibold text-[#2C1A1D]/70" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>£{currentPrice.toLocaleString()}</p>
                </div>

                <p className="text-[14px] leading-relaxed text-[#2C1A1D]/70 mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{product.description}</p>
                
                <hr className="mb-8 border-[#2C1A1D]/10" />

                {parsedSizes.length > 0 && (
                  <div className="mb-8">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Select Size</p>
                    <div className="grid grid-cols-3 gap-2">
                      {parsedSizes.map((s: any) => (
                        <button 
                          key={s.size} 
                          onClick={() => setSelectedSize(s.size)} 
                          className={`flex h-[44px] items-center justify-center text-[10px] font-bold uppercase tracking-wide transition-all border rounded-md ${selectedSize === s.size ? "bg-[#2C1A1D]/60 border-[#2C1A1D]/60 text-[#FBF9F5]" : "border-[#2C1A1D]/20 text-[#2C1A1D] hover:bg-[#2C1A1D]/5"}`} 
                          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4 mb-8">
                  {!isSoldOut && (
                    <div className="flex items-center gap-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Qty</p>
                      <div className="inline-flex items-stretch overflow-hidden rounded-md border border-[#2C1A1D]/20 bg-white">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-white transition-colors">−</button>
                        <span className="flex h-10 w-12 items-center justify-center text-[13px] font-bold text-[#2C1A1D]">{qty}</span>
                        <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center text-[#2C1A1D]/60 hover:bg-[#2C1A1D] hover:text-white transition-colors">+</button>
                      </div>
                    </div>
                  )}

                  {isSoldOut ? (
                    <button disabled className="w-full rounded-md py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] bg-[#2C1A1D]/10 text-[#2C1A1D]/40 cursor-not-allowed" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Sold Out</button>
                  ) : (
                    <button onClick={handleAdd} className={`w-full rounded-md py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${addedFlash ? "bg-[#1F1315] text-[#FBF9F5] scale-[0.98]" : "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315]"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      {addedFlash ? "Added to Bag ✓" : `Add to Bag — £${totalPrice.toLocaleString()}`}
                    </button>
                  )}

                  {isBulkAvailable && !isSoldOut && (
                    <button onClick={handleBulkQuote} className="w-full rounded-md border border-[#2C1A1D] py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#2C1A1D] hover:text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Request Bulk Quote</button>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-auto pt-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Share</p>
                  <div className="flex gap-2">
                    <a href={`https://wa.me/?text=Check out this product: ${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors p-1">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <button onClick={copyToClipboard} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors p-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-[#FBF9F5] p-6 md:p-10">
              
              {/* FREQUENTLY BOUGHT TOGETHER (Using exact ProductCard style inline to fix build) */}
              {relatedProducts.length > 0 && (
                <div className="mb-14">
                  <h3 className="mb-6 text-[24px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Frequently bought together</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-12">
                    {relatedProducts.map((p) => {
                      const numericPrice = typeof p.price === "number" ? p.price : parseInt(String(p.price).replace(/[^0-9]/g, ""), 10);
                      const formattedTitle = p.title.replace(/\b\w/g, (char: string) => char.toUpperCase());
                      return (
                        <div key={p.id} className="group flex flex-col cursor-pointer w-full">
                          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#EBE0D3]">
                            <Image src={p.image || "/placeholder.png"} alt={formattedTitle} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                          </div>
                          <div className="mt-3 flex flex-col gap-1">
                            <h3 className="text-[12px] md:text-[13px] font-semibold truncate leading-[1.3] tracking-[0.01em] text-[#2C1A1D]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{formattedTitle}</h3>
                            <div className="flex items-baseline">
                              <p className="text-[14px] font-extrabold text-[#2C1A1D]/60 tracking-tight" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>£{numericPrice.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
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
                  <button onClick={() => setShowReviewForm(true)} className="rounded-md border border-[#2C1A1D] px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Write a Review</button>
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
          <Image src={activeImage || "/placeholder.png"} alt={product.title} fill className="object-contain" />
          <button className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      )}
    </>
  );
}
