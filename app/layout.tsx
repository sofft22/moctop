import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "./CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { GlobalProductModal } from "@/components/GlobalProductModal"; // <-- ADD THIS

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          <CartProvider>
            <Header />
            <CartDrawer />
            <GlobalProductModal /> {/* <-- ADD THIS */}
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
