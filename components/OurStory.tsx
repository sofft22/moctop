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
              src="/our-story.png" // CHANGED TO A DEDICATED IMAGE
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
              className="text-[15px] leading-[1.9] text-[#2C1A1D]/75 md:text-[17px] mb-6"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Mocktopia was born from a simple love for baking. What started as a small home kitchen experiment has grown into a passion for creating treats that bring people together. 
            </p>
            
            <p 
              className="text-[15px] leading-[1.9] text-[#2C1A1D]/75 md:text-[17px]"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Every loaf of our signature banana bread is baked fresh, every puff puff is fried to golden perfection, and every mocktail is crafted with real, fresh ingredients. We believe that good food shouldn't just taste amazing—it should feel like a warm hug.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
