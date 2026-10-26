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
    <section id="categories" className="w-full bg-[#FBF9F5] py-16 px-6 md:py-24 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <h2 
            className="text-[24px] md:text-[48px] font-normal text-[#2C1A1D]"
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
              className="group flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image (Shorter Aspect Ratio) */}
              <div className="relative w-full aspect-[4/3] bg-[#EBE0D3] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Text Section Below Image */}
              <div className="flex flex-col p-6 md:p-8">
                
                {/* Title and Hover Arrow */}
                <div className="flex items-center justify-between mb-3">
                  <h3 
                    className="text-[24px] text-[#2C1A1D] md:text-[28px] leading-tight"
                    style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                  >
                    {cat.title}
                  </h3>
                  
                  {/* Arrow only shows on hover */}
                  <span className="text-[#2C1A1D] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* Description */}
                <p 
                  className="text-[13px] leading-[1.6] text-[#2C1A1D]/60 md:text-[14px]"
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
