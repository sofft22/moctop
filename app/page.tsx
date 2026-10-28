import { Hero } from "@/components/Hero";
import { HomeClient } from "@/components/HomeClient";
import { BoxBuilderSection } from "@/components/BoxBuilderSection";
import { ProductLines } from "@/components/ProductLines";
import { OurStory } from "@/components/OurStory";
import { RecentReviews } from "@/components/RecentReviews";
import { TrustBanner } from "@/components/TrustBanner";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main style={{ margin: 0, padding: 0, width: '100%', overflowX: 'hidden', backgroundColor: '#FBF9F5' }}>
      
      <Hero />
      
      {/* FLEX CONTAINER FOR BREATHING ROOM */}
      <div className="flex flex-col gap-12 md:gap-20">
        <HomeClient />
        
        <BoxBuilderSection />
        
        <ProductLines /> 
        
        <OurStory />

        <RecentReviews />
        
        <TrustBanner />
      </div>

      <Footer />
      
    </main>
  );
}
