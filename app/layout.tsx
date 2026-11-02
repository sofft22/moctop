import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "./CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Mocktopia Treats | Banana Bread & Mocktails in Plymouth",
  
  // FIXED: Shortened to under 160 characters so Google doesn't cut it off
  description: "Freshly baked banana bread, puff puffs & mocktails. Delivered in Plymouth & across the UK. Build your own custom box today!",
  
  metadataBase: new URL('https://mocktopiatreats.com'),
  
  openGraph: {
    title: "Mocktopia Treats | Sips & Treats",
    description: "Mix and match your favorite treats. Available in boxes of 6 or 8. Delivered in Plymouth.",
    url: 'https://mocktopiatreats.com',
    siteName: 'Mocktopia Treats',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        // FIXED: Changed to .jpg since you saved it as a JPG
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'Mocktopia Treats Logo',
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
