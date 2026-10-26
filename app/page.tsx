import { Hero } from "@/components/Hero";
import { HomeClient } from "@/components/HomeClient";
import { ProductLines } from "@/components/ProductLines";
import { OurStory } from "@/components/OurStory";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main style={{ margin: 0, padding: 0, width: '100%', overflowX: 'hidden', backgroundColor: '#FBF9F5' }}>
      
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Signature Treats (Featured Products) */}
      <HomeClient />
      
      {/* 3. Shop by Category (Product Lines) */}
      <ProductLines /> 
      
      {/* 4. Our Story (Side by Side Image + Text) */}
      <OurStory />

      {/* 5. Footer */}
      <Footer />
      
    </main>
  );
}
