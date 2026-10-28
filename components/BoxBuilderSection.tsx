"use client";

export function BoxBuilderSection() {
  
  const handleBulkOrder = () => {
    const message = `Hi Mocktopia! I'd like to request a bulk order for an upcoming event.%0A%0A*Event Type:* %0A*Number of Guests:* %0A*Date Needed:* %0A%0APlease let me know the pricing and availability.`;
    window.open(`https://wa.me/2348178910628?text=${message}`, '_blank');
  };

  return (
    <section className="relative w-full py-24 md:py-32 px-6 md:px-12 border-y border-[#2C1A1D]/10 overflow-hidden flex items-center justify-center bg-[#2C1A1D]">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/box-builder-home.png" 
          alt="Bulk Orders" 
          className="w-full h-full object-cover object-center" 
        />
      </div>

      {/* SUBTLE DARK OVERLAY (Makes the text readable) */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* CONTENT */}
      <div className="relative z-20 mx-auto max-w-[800px] flex flex-col items-center text-center">
        
        <h2 className="text-[40px] md:text-[64px] text-[#FBF9F5] leading-[1.1] mb-10" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
          Planning an event?<br />Let us bake for you.
        </h2>
        
        <button 
          onClick={handleBulkOrder}
          className="w-full max-w-[280px] rounded-md bg-[#FBF9F5] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] transition-all hover:bg-[#EBE0D3] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Request Bulk Quote
        </button>
      </div>

    </section>
  );
}
