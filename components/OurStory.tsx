import Image from "next/image";

export function OurStory() {
  return (
    <section id="about" className="w-full bg-[#FBF9F5]">
      
      {/* FULL BLEED IMAGE (Edge to Edge) */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-[#EBE0D3]">
        <Image
          src="/our-story.png"
          alt="Mocktopia Story"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* TEXT SECTION */}
      <div className="mx-auto max-w-[800px] px-6 py-16 md:py-24 flex flex-col items-center text-center">
        
        <h2 
          className="mb-8 text-[36px] md:text-[56px] text-[#2C1A1D] leading-tight"
          style={{ fontFamily: 'var(--font-dm-serif), serif' }}
        >
          Our Story
        </h2>

        <div className="w-12 h-[1px] bg-[#2C1A1D]/20 mb-8" />

        <p 
          className="text-[15px] font-semibold leading-[1.6] text-[#2C1A1D] md:text-[18px] mb-8 uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
        >
          A Love of Baking. A Passion for Creating.
        </p>

        <p 
          className="text-[15px] leading-[1.8] text-[#2C1A1D]/70 md:text-[16px] mb-6 max-w-[650px]"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Mocktopia Treats was born from my love of baking, pastries and experimenting with exciting mocktail flavours. What started as a hobby — making treats for friends and family — gradually grew into something more.
        </p>

        <p 
          className="text-[15px] leading-[1.8] text-[#2C1A1D]/70 md:text-[16px] mb-8 max-w-[650px]"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          My love for banana bread took off after baking in bulk for my daughter’s first birthday, where the treats were a hit! Today, I’m turning that passion into a brand dedicated to creating delicious treats and refreshing mocktails for life’s special moments.
        </p>

        <p 
          className="text-[16px] md:text-[18px] text-[#2C1A1D]"
          style={{ fontFamily: 'var(--font-dm-serif), serif', fontStyle: 'italic' }}
        >
          Mocktopia Treats — made with love, served with joy.
        </p>

      </div>
    </section>
  );
}
