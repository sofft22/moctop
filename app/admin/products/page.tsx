"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductFormModal } from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  
  // Search Toggle State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const loadProducts = async () => {
    if (localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleStock = async (id: string, currentStock: boolean) => {
    setProducts(products.map(p => p.id === id ? { ...p, inStock: !currentStock } : p));
    await fetch("/api/products", {
      method: "PUT",
      body: JSON.stringify({ ...products.find(p => p.id === id), inStock: !currentStock }),
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setProducts(products.filter(p => p.id !== id));
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    }
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }, [products, category, query]);

  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Catalog</p>
          <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>Products</h1>
          <p className="mt-2 text-[13px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {products.length} total {outOfStockCount > 0 && <span className="ml-2 font-bold text-[#2C1A1D]">· {outOfStockCount} out of stock</span>}
          </p>
        </div>

        <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 rounded-md bg-[#2C1A1D] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#FBF9F5] transition-colors hover:bg-[#1F1315]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
          Add Product
        </button>
      </div>

      {/* FILTER BAR (Fixed clipping & Expanding Search) */}
      <div className="mb-6 border-b border-[#2C1A1D]/10 pb-3 flex items-center justify-between gap-4">
        
        {/* Scrollable Tabs */}
        <nav className="flex flex-1 items-center gap-x-6 overflow-x-auto no-scrollbar pb-1">
          {["all", "banana-bread", "puff-puffs", "mocktails"].map((c) => {
            const active = category === c;
            const count = c === "all" ? products.length : products.filter((p) => p.category === c).length;
            const label = c === "all" ? "All" : c.replace("-", " ");
            return (
              <button key={c} onClick={() => setCategory(c)} className={`relative shrink-0 pb-2 text-[12px] font-bold uppercase tracking-wider transition-colors ${active ? "text-[#2C1A1D]" : "text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {label} <span className={`ml-1 text-[10px] ${active ? "text-[#2C1A1D]" : "text-[#2C1A1D]/30"}`}>{count}</span>
                {active && <span className="absolute -bottom-[5px] left-0 h-[2px] w-full bg-[#2C1A1D]" />}
              </button>
            );
          })}
        </nav>

        {/* Expanding Search Icon */}
        <div className={`relative flex items-center justify-end transition-all duration-300 ${isSearchOpen ? "w-[200px] sm:w-[240px]" : "w-[32px]"}`}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => { if (!query) setIsSearchOpen(false); }}
            className={`w-full rounded-md border border-[#2C1A1D]/20 bg-white py-2 pl-8 pr-3 text-[12px] text-[#2C1A1D] outline-none focus:border-[#2C1A1D] transition-opacity ${isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none absolute"}`}
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          />
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`absolute left-0 p-2 text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors ${isSearchOpen ? "pointer-events-none" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-24"><div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-[13.5px] font-medium text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-inter), sans-serif" }}>No products found. Click "Add Product" to create your first one.</div>
      ) : (
        <ul className="flex flex-col border-t border-[#2C1A1D]/10">
          {filtered.map((p) => (
            <li key={p.id} className="group flex items-center gap-4 border-b border-[#2C1A1D]/10 py-4 hover:bg-white px-2 transition-colors">
              <div className="flex min-w-0 flex-1 items-center gap-4 cursor-pointer" onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#EBE0D3]">
                  <Image src={p.image || "/placeholder.png"} alt={p.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{p.title}</p>
                  <p className="text-[12px] text-[#2C1A1D]/50 capitalize" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{p.category.replace('-', ' ')}</p>
                </div>
              </div>

              <div className="w-[80px] shrink-0 text-right">
                <p className="text-[14px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>₦{p.price.toLocaleString()}</p>
              </div>

              <button onClick={() => toggleStock(p.id, p.inStock)} className="w-[90px] shrink-0 hidden sm:flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${p.inStock ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`text-[11px] font-bold uppercase tracking-wider ${p.inStock ? "text-green-700" : "text-red-700"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{p.inStock ? "In Stock" : "Sold Out"}</span>
              </button>

              <button onClick={() => handleDelete(p.id, p.title)} className="shrink-0 text-[#2C1A1D]/20 hover:text-red-600 transition-colors p-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <ProductFormModal product={editingProduct} onClose={() => setIsModalOpen(false)} onSave={loadProducts} />
      )}
    </div>
  );
}
