import Image from "next/image";
import Link from "next/link";

export function ProductLines() {
  const categories = [
    {
      id: "banana-bread",
      title: "Banana Bread",
      description: "Available in boxes of 6 or 8, and MIDI or Maxi loaves. Customize with coconut, Oreos, Nutella, and more.",
      image: "/category-banana-bread.png", 
      // WIRED TO FILTER THE SHOP PAGE
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

        {/* GRID LOGIC:
            Mobile: 2 columns. 
            The 3rd item (mocktails) will span both columns and be centered.
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {categories.map((cat, index) => {
            // Make the 3rd item (index 2) span 2 columns on mobile and center it
            const isCentered = index === 2;

            return (
              <Link 
                key={cat.id} 
                href={cat.link}
                className={`group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  isCentered ? "col-span-2 md:col-span-1 w-1/2 md:w-full mx-auto" : ""
                }`}
              >
                
                {/* Top: Image */}
                <div className="relative w-full aspect-[5/4] bg-[#EBE0D3] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority={index < 2} // Loads the first two instantly
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle gradient at the bottom so text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  {/* Title anchored to the bottom left of the image */}
                  <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6">
                    <h3 
                      className="text-[20px] text-white md:text-[32px] leading-tight drop-shadow-md"
                      style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                    >
                      {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom: Description text inside the white box */}
                <div className="p-4 md:p-6 flex-1 hidden md:block">
                  <p 
                    className="text-[13px] leading-[1.6] text-[#2C1A1D]/70 md:text-[14px]"
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
