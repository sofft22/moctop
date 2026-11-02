import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "./CartContext";
import { CartDrawer } from "@/components/CartDrawer";

// THIS IS WHERE YOU PUT YOUR META TAGS
export const metadata: Metadata = {
  title: "Mocktopia Treats | Banana Bread & Mocktails in Plymouth",
  description: "Freshly baked banana bread, golden puff puffs, and refreshing mocktails. Delivered locally in Plymouth and shipped across the UK. Build your own custom box today!",
  
  metadataBase: new URL('https://mocktopiatreats.com'),
  
  // This is for WhatsApp, Twitter, Facebook, etc.
  openGraph: {
    title: "Mocktopia Treats | Sips & Treats",
    description: "Mix and match your favorite treats. Available in boxes of 6 or 8. Delivered in Plymouth.",
    url: 'https://mocktopiatreats.com',
    siteName: 'Mocktopia Treats',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        // Because you are putting the image in the "public" folder, 
        // we just reference the file name here.
        url: '/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'Mocktopia Treats Banana Bread',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          <CartProvider>
            <Header />
            <CartDrawer />
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
