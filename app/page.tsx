import { Hero } from "@/components/Hero";
import { HomeClient } from "@/components/HomeClient";
import { BoxBuilderSection } from "@/components/BoxBuilderSection";
import { ProductLines } from "@/components/ProductLines";
import { OurStory } from "@/components/OurStory";
import { RecentReviews } from "@/components/RecentReviews"; // IMPORTED HERE
import { TrustBanner } from "@/components/TrustBanner";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main style={{ margin: 0, padding: 0, width: '100%', overflowX: 'hidden', backgroundColor: '#FBF9F5' }}>
      
      <Hero />
      
      <HomeClient />
      
      <BoxBuilderSection />
      
      <ProductLines /> 
      
      <OurStory />

      {/* RECENT REVIEWS PLACED HERE */}
      <RecentReviews />
      
      <TrustBanner />

      <Footer />
      
    </main>
  );
}
