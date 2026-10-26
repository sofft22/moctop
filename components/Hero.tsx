import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <>
      <style>{`
        .hero-section {
          height: 76vh;
          min-height: 500px;
        }
        @media (max-width: 768px) {
          .hero-section {
            height: 68vh;
            min-height: 400px;
          }
        }
      `}</style>

      <section id="hero" className="hero-section relative flex w-full items-center justify-center overflow-hidden bg-[#2C1A1D] mt-0 border-none outline-none">
        
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Mocktopia Treats"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="absolute inset-0 z-10 bg-black/35" />

        <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center px-6 text-center md:bottom-12">
          
          <h1 
            className="text-[52px] leading-[1.05] text-white md:text-[85px]"
            style={{ 
              fontFamily: 'var(--font-dm-serif), serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.15)',
              marginBottom: '12px' 
            }}
          >
           Treats  & sips.
          </h1>

          <Link 
            href="/shop" 
            className="rounded-full bg-[#2C1A1D] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:scale-105 md:px-14 md:py-5 md:text-[12px] border border-white/20"
            style={{ 
              fontFamily: 'var(--font-inter), sans-serif',
              boxShadow: '0 0 25px 2px rgba(44, 26, 29, 0.4)' 
            }}
          >
            Order Now
          </Link>
        </div>
      </section>
    </>
  );
}