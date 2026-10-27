import Image from "next/image";
import Link from "next/link";

export function ProductLines() {
  const categories = [
    {
      id: "banana-bread",
      title: "Banana Bread",
      image: "/category-banana-bread.png", 
      link: "/shop?category=banana-bread"
    },
    {
      id: "puff-puffs",
      title: "Puff Puffs",
      image: "/category-puff-puffs.png",
      link: "/shop?category=puff-puffs"
    },
    {
      id: "mocktails",
      title: "Mocktails",
      image: "/category-mocktails.png",
      link: "/shop?category=mocktails"
    }
  ];

  return (
    <section id="categories" className="w-full bg-[#FBF9F5] py-16 px-6 md:py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Grid Layout: 1 column on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, index) => {
            return (
              <Link 
                key={cat.id} 
                href={cat.link}
                className="group relative flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full"
              >
                
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] md:aspect-[4/5] bg-[#EBE0D3] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index < 2}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Dark gradient overlay so text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  
                  {/* Title overlay at the bottom left */}
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                    <h3 
                      className="text-[28px] text-white md:text-[36px] leading-tight drop-shadow-lg"
                      style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                    >
                      {cat.title}
                    </h3>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
