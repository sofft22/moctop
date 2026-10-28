import Image from "next/image";
import Link from "next/link";

export function ProductLines() {
  const categories = [
    {
      id: "banana-bread",
      title: "Banana Bread",
      image: "/category-banana-bread.PNG", 
      link: "/shop?category=banana-bread"
    },
    {
      id: "puff-puffs",
      title: "Puff Puffs",
      image: "/category-puff-puffs.PNG",
      link: "/shop?category=puff-puffs"
    },
    {
      id: "mocktails",
      title: "Mocktails",
      image: "/category-mocktails.PNG",
      link: "/shop?category=mocktails"
    }
  ];

  return (
    <section id="categories" className="w-full bg-[#FBF9F5] py-20 px-6 md:py-28 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        
        {/* CENTERED HEADER */}
        <div className="mb-16 flex flex-col items-center text-center">
          <p 
            className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2C1A1D]/50 mb-4"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          >
            The Menu
          </p>
          <h2 
            className="text-[36px] md:text-[56px] text-[#2C1A1D] leading-tight"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            What are you craving?
          </h2>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 items-start">
          
          {categories.map((cat, index) => {
            // Push the middle item down on desktop for the staggered look
            const isMiddle = index === 1;
            
            return (
              <Link 
                key={cat.id} 
                href={cat.link}
                className={`group flex flex-col w-full ${isMiddle ? "md:mt-16" : ""}`}
              >
                
                {/* IMAGE WRAPPER */}
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-[#EBE0D3] shadow-sm">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index < 2}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* TEXT SECTION */}
                <div className="mt-5 flex flex-col items-center text-center">
                  <h3 
                    className="text-[24px] md:text-[32px] text-[#2C1A1D] transition-colors group-hover:text-[#2C1A1D]/70"
                    style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                  >
                    {cat.title}
                  </h3>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]"
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                    >
                      Shop Now
                    </span>
                    <span className="text-[#2C1A1D] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
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
