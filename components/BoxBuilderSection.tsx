"use client";

export function BoxBuilderSection() {
  
  const handleBulkOrder = () => {
    const message = `Hi Mocktopia! I'd like to request a bulk order for an upcoming event.%0A%0A*Event Type:* %0A*Number of Guests:* %0A*Date Needed:* %0A%0APlease let me know the pricing and availability.`;
    window.open(`https://wa.me/2348178910628?text=${message}`, '_blank');
  };

  return (
    <section className="relative w-full py-24 md:py-32 px-6 md:px-12 border-y border-[#2C1A1D]/10 overflow-hidden flex items-center justify-center bg-[#2C1A1D]">
      
      {/* BACKGROUND IMAGE (Using a nice background) */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src="/box-builder-home.png" 
          alt="Bulk Orders" 
          className="w-full h-full object-cover object-center" 
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 mx-auto max-w-[800px] flex flex-col items-center text-center">
        
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FBF9F5]/60 mb-4" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Catering & Events
        </p>

        <h2 className="text-[40px] md:text-[64px] text-[#FBF9F5] leading-[1.05] mb-6" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
          Planning an event?<br />Let us bake for you.
        </h2>

        <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#FBF9F5]/80 mb-10 max-w-lg font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          From birthdays to corporate gatherings, we offer bulk orders of our signature treats and mocktails, perfectly packaged for your guests.
        </p>
        
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
