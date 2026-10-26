import { Inter, DM_Serif_Display, Montserrat, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "./CartContext";
import { CartDrawer } from "@/components/CartDrawer";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"], 
  variable: "--font-inter" 
});

const dmSerif = DM_Serif_Display({ 
  subsets: ["latin"], 
  weight: ["400"], 
  variable: "--font-dm-serif" 
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"], 
  variable: "--font-montserrat" 
});

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  weight: ["500", "600", "700", "800"], 
  variable: "--font-bricolage" 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`light ${inter.variable} ${dmSerif.variable} ${montserrat.variable} ${bricolage.variable}`}>
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