export function TrustBanner() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
      ),
      title: "12 NOON CUT-OFF",
      subtitle: "Order before 12pm for next-day delivery."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "LOCAL & COURIER",
      subtitle: "Delivering within Plymouth & across the UK."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "24H NOTICE",
      subtitle: "Required for all cancellations or changes."
    }
  ];

  return (
    <section className="w-full bg-[#FBF9F5] border-t border-[#2C1A1D]/10">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              // CENTERED ON MOBILE, LEFT ALIGNED ON DESKTOP
              className="flex flex-col items-center text-center md:items-start md:text-left gap-3"
            >
              <div className="text-[#2C1A1D]">
                {feature.icon}
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h4 
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D] mb-2" 
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {feature.title}
                </h4>
                <p 
                  className="text-[13px] text-[#2C1A1D]/60 leading-relaxed max-w-[280px]" 
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
