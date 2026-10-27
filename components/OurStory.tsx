import Image from "next/image";

export function OurStory() {
  return (
    <section id="about" className="w-full bg-[#FBF9F5] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        
        {/* Layout: Flex-col on mobile, Flex-row on desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* 1. TEXT SIDE (Right on desktop, but on mobile the Title comes first) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-2">
            
            <h2 
              className="mb-6 text-[32px] text-[#2C1A1D] md:text-[48px]"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
              Our Story
            </h2>

            {/* Mobile Image (Only visible on mobile, sits between title and text) */}
            <div className="block lg:hidden relative w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-xl bg-[#EBE0D3] mb-6">
              <Image
                src="/our-story.png"
                alt="Mocktopia Story"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>

            <p 
              className="text-[15px] font-semibold leading-[1.6] text-[#2C1A1D]/90 md:text-[17px] mb-6"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              A Love of Baking. A Passion for Creating. A Treat worth Sharing.
            </p>

            <p 
              className="text-[15px] leading-[1.8] text-[#2C1A1D]/75 md:text-[16px] mb-4"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Mocktopia Treats was born from my love of baking, pastries and experimenting with exciting mocktail flavours.
            </p>

            <p 
              className="text-[15px] leading-[1.8] text-[#2C1A1D]/75 md:text-[16px] mb-4"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              What started as a hobby — making treats for friends and family and creating mocktails for their gatherings — gradually grew into something more when they always said to me that this needs to be in people’s palates.
            </p>

            <p 
              className="text-[15px] leading-[1.8] text-[#2C1A1D]/75 md:text-[16px] mb-4"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              My love for banana bread took off after baking in bulk for my daughter’s first birthday, where the treats were a hit!
            </p>

            <p 
              className="text-[15px] leading-[1.8] text-[#2C1A1D]/75 md:text-[16px] mb-6"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Today, I’m turning that passion into a brand dedicated to creating delicious treats and refreshing mocktails for life’s special moments.
            </p>

            <p 
              className="text-[15px] font-medium leading-[1.8] text-[#2C1A1D] md:text-[16px]"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Mocktopia Treats — made with love, served with joy.
            </p>

          </div>

          {/* 2. IMAGE SIDE (Left on desktop) */}
          <div className="hidden lg:block w-full lg:w-1/2 order-1 lg:order-1">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#EBE0D3]">
              <Image
                src="/our-story.png"
                alt="Mocktopia Story"
                fill
                sizes="50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
