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
    // Increased side padding on desktop (lg:px-20) for a premium, centered look
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="group flex flex-col"
            >
              {/* IMAGE with Title INSIDE */}
              <div className="relative w-full aspect-[4/3] bg-[#EBE0D3] overflow-hidden rounded-sm mb-4">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-[#2C1A1D]/40 transition-opacity duration-300 group-hover:opacity-50" />
                
                {/* Title inside the image */}
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <h3 
                    className="text-[28px] text-white md:text-[36px] drop-shadow-lg leading-tight"
                    style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                  >
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* SMALL DESCRIPTION BELOW */}
              <p 
                className="text-[13px] leading-[1.6] text-[#2C1A1D]/70 md:text-[14px] px-2"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {cat.description}
              </p>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
