import Image from "next/image";
import Link from "next/link";

const GALLERY_IMAGES = [
  { src: "/feat-banana-choc.png", isTall: true, alt: "Chocolate Chip Banana Bread" },
  { src: "/feat-puff-biscoff.png", isTall: false, alt: "Biscoff Puff Puff" },
  { src: "/feat-mocktail-hibiscus.png", isTall: true, alt: "Hibiscus Mocktail" }, // Changed to tall
  { src: "/category-banana-bread.png", isTall: false, alt: "Banana Bread Box" }, // Changed to short
  { src: "/feat-puff-classic.png", isTall: true, alt: "Classic Puff Puff" },
  { src: "/feat-mocktail-strawberry.png", isTall: false, alt: "Strawberry Mocktail" },
];

export function VibeGallery() {
  return (
    <section className="w-full bg-[#F2EAE6] py-16 px-4 md:py-24 md:px-6 border-t border-[#2C1A1D]/10">
      <div className="mx-auto max-w-[1400px]">
        
        <div className="mb-12 text-center">
          <h2 
            className="text-[28px] md:text-[42px] font-normal text-[#2C1A1D]"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            The Mocktopia Vibe.
          </h2>
        </div>

        {/* TRUE MASONRY GRID */}
        <div className="columns-2 md:columns-3 gap-3 md:gap-5 space-y-3 md:space-y-5">
          {GALLERY_IMAGES.map((img, index) => (
            <Link
              href="/shop" 
              key={index}
              // The varying aspect ratios + break-inside-avoid creates the masonry
              className={`group relative block w-full overflow-hidden rounded-lg md:rounded-xl break-inside-avoid ${
                img.isTall ? "aspect-[3/4]" : "aspect-square"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}