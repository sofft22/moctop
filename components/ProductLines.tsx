import Image from "next/image";
import Link from "next/link";

export function ProductLines() {
  const categories = [
    {
      id: "banana-bread",
      title: "Banana Bread",
      description: "Classic, choc chip, walnut & more.", // <-- ADD YOUR TEXT HERE
      image: "/category-banana-bread.png", 
      link: "/shop"
    },
    {
      id: "puff-puffs",
      title: "Puff Puffs",
      description: "Golden, fluffy, and perfectly sweet.", // <-- ADD YOUR TEXT HERE
      image: "/category-puff-puffs.png",
      link: "/shop"
    },
    {
      id: "mocktails",
      title: "Mocktails",
      description: "Hibiscus, strawberry, ginger & more.", // <-- ADD YOUR TEXT HERE
      image: "/category-mocktails.png",
      link: "/shop"
    }
  ];

  return (
    <section id="categories" className="w-full bg-[#FBF9F5] py-16 px-4 md:py-24 md:px-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="group relative w-full overflow-hidden rounded-md aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] bg-[#EBE0D3]"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A1D]/95 via-[#2C1A1D]/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
              
              {/* Text content at the bottom */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col items-start">
                
                {/* Title and Arrow */}
                <div className="flex w-full items-center justify-between">
                  <h3 
                    className="text-[28px] text-[#FBF9F5] md:text-[32px] leading-tight"
                    style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                  >
                    {cat.title}
                  </h3>
                  
                  {/* Just the arrow */}
                  <span className="text-[#FBF9F5] transition-transform duration-300 group-hover:translate-x-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* The text you wanted under each item */}
                <p 
                  className="mt-2 text-[13px] text-[#FBF9F5]/70 md:text-[14px]"
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
