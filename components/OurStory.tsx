import Image from "next/image";

export function OurStory() {
  return (
    <section id="about" className="w-full bg-[#FBF9F5] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        
        {/* Layout: Flex-col on mobile, Flex-row on desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* 1. IMAGE SIDE (Left on desktop) */}
          <div className="relative w-full lg:w-1/2 aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-xl bg-[#EBE0D3]">
            <Image
              src="/our-story.png"
              alt="Mocktopia Story"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* 2. TEXT SIDE (Right on desktop) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <h2 
              className="mb-6 text-[32px] text-[#2C1A1D] md:text-[48px]"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
              Our Story
            </h2>

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

        </div>

      </div>
    </section>
  );
}
