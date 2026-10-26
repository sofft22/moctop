import { Hero } from "@/components/Hero";
import { HomeClient } from "@/components/HomeClient";
import { ProductLines } from "@/components/ProductLines";
import { OurStory } from "@/components/OurStory";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main style={{ margin: 0, padding: 0, width: '100%', overflowX: 'hidden', backgroundColor: '#FBF9F5' }}>
      
      <Hero />
      <HomeClient />
      <ProductLines /> 
      <OurStory />
      
      {/* REMOVED <RecentReviews /> FROM HERE */}

      <Newsletter />
      <Footer />
      
    </main>
  );
}
