import Image from "next/image";
import Link from "next/link";

export function ProductLines() {
  const categories = [
    {
      id: "banana-bread",
      title: "Banana Bread",
      description: "Available in boxes of 6 or 8, and MIDI or Maxi loaves. Customize with coconut, Oreos, Nutella, and more.",
      image: "/category-banana-bread.png", 
      link: "/shop?category=banana-bread"
    },
    {
      id: "puff-puffs",
      title: "Puff Puffs",
      description: "Golden, fluffy, and perfectly sweet. Available in classic or party boxes.",
      image: "/category-puff-puffs.png",
      link: "/shop?category=puff-puffs"
    },
    {
      id: "mocktails",
      title: "Mocktails",
      description: "Refreshing hibiscus, sweet strawberry, and spicy ginger blends. Perfect for any occasion.",
      image: "/category-mocktails.png",
      link: "/shop?category=mocktails"
    }
  ];

  return (
    <section id="categories" className="w-full bg-[#FBF9F5] py-20 px-6 md:py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <h2 
            className="text-[32px] md:text-[48px] font-normal text-[#2C1A1D]"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            Shop by Category
          </h2>
        </div>

        {/* Grid Layout - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {categories.map((cat, index) => {
            // Center the 3rd item on mobile
            const isCentered = index === 2;

            return (
              <Link 
                key={cat.id} 
                href={cat.link}
                className={`group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
                  isCentered ? "col-span-2 md:col-span-1 w-1/2 md:w-full mx-auto" : ""
                }`}
              >
                
                {/* Top: Image (Made much taller: aspect-[4/5]) */}
                <div className="relative w-full aspect-[4/5] md:aspect-[3/4] bg-[#EBE0D3] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority={index < 2}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Stronger gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  
                  {/* Title anchored to the bottom left, made larger */}
                  <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                    <h3 
                      className="text-[24px] text-white md:text-[36px] leading-tight drop-shadow-lg"
                      style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                    >
                      {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom: Description (More padding, larger text) */}
                <div className="p-5 md:p-8 flex-1 bg-white">
                  <p 
                    className="text-[13px] leading-[1.7] text-[#2C1A1D]/70 md:text-[15px]"
                    style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {cat.description}
                  </p>
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
