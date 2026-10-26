import Image from "next/image";
import Link from "next/link";

export function ProductLines() {
  const categories = [
    {
      id: "banana-bread",
      title: "Banana Bread",
      description: "Available in boxes of 6 or 8, and MIDI or Maxi loaves. Customize with coconut, Oreos, Nutella, and more.",
      image: "/category-banana-bread.png", 
      link: "/shop"
    },
    {
      id: "puff-puffs",
      title: "Puff Puffs",
      description: "Golden, fluffy, and perfectly sweet. Available in classic or party boxes.",
      image: "/category-puff-puffs.png",
      link: "/shop"
    },
    {
      id: "mocktails",
      title: "Mocktails",
      description: "Refreshing hibiscus, sweet strawberry, and spicy ginger blends. Perfect for any occasion.",
      image: "/category-mocktails.png",
      link: "/shop"
    }
  ];

  return (
    <section id="categories" className="w-full bg-[#FBF9F5] py-16 px-6 md:py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <h2 
            className="text-[24px] md:text-[40px] font-normal text-[#2C1A1D]"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            Shop by Category
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              
              {/* Top: Image (Slightly longer aspect ratio) */}
              <div className="relative w-full aspect-[5/4] bg-[#EBE0D3] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle gradient at the bottom so text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                {/* Title anchored to the bottom left of the image */}
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <h3 
                    className="text-[28px] text-white md:text-[32px] leading-tight drop-shadow-md"
                    style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                  >
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Bottom: Description text inside the white box */}
              <div className="p-5 md:p-6 flex-1">
                <p 
                  className="text-[13px] leading-[1.6] text-[#2C1A1D]/70 md:text-[14px]"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {cat.description}
                </p>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
