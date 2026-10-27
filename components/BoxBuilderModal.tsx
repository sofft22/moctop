"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/CartContext";

interface Props {
  config: any;
  onClose: () => void;
}

export function BoxBuilderModal({ config, onClose }: Props) {
  const { addToCart } = useCart();
  
  const [selectedSlots, setSelectedSlots] = useState<number>(6);
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});

  // Price logic (Base price for 6, +£5 for 8 - adjust if needed)
  const basePrice = config.price; 
  const currentPrice = selectedSlots === 6 ? basePrice : basePrice + 5; 

  const totalSelected = Object.values(selectedToppings).reduce((a, b) => a + b, 0);
  const isComplete = totalSelected === selectedSlots;

  const handleAddOne = (toppingId: string) => {
    if (totalSelected >= selectedSlots) return;
    setSelectedToppings(prev => ({
      ...prev,
      [toppingId]: (prev[toppingId] || 0) + 1
    }));
  };

  const handleRemoveOne = (e: React.MouseEvent, toppingId: string) => {
    e.stopPropagation();
    setSelectedToppings(prev => {
      const newState = { ...prev };
      if (newState[toppingId] > 1) {
        newState[toppingId] -= 1;
      } else {
        delete newState[toppingId];
      }
      return newState;
    });
  };

  const handleAddToCart = () => {
    if (!isComplete) return;
    
    const selectionDetails = Object.entries(selectedToppings)
      .map(([id, qty]) => {
        const topping = config.toppings.find((t: any) => t.id === id);
        return `${qty}x ${topping.name}`;
      })
      .join(", ");

    const customProduct = {
      id: `box-${Date.now()}`,
      title: config.title,
      price: currentPrice,
      image: config.toppings[0]?.image || "/placeholder.png",
      size: `Box of ${selectedSlots} (${selectionDetails})`,
    };

    addToCart(customProduct, customProduct.size, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex bg-[#1F1315]/70 backdrop-blur-md sm:p-6 sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 hidden sm:block" />
      
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-[85vh] sm:max-w-[1000px] sm:rounded-2xl overflow-hidden"
      >
        
        {/* MINIMAL HEADER */}
        <header className="flex items-center justify-between px-8 py-6 md:px-12 shrink-0 bg-[#FBF9F5]">
          <span className="uppercase tracking-[0.2em] text-[12px] font-semibold text-[#2C1A1D]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
            Mocktopia
          </span>
          <button onClick={onClose} className="text-[#2C1A1D]/40 hover:text-[#2C1A1D] transition-colors p-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12">
          
          {/* TITLE & SLOT SELECTOR */}
          <div className="mb-10 md:mb-12">
            <h1 className="text-[32px] md:text-[44px] text-[#2C1A1D] mb-3" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              Build Your Box
            </h1>
            <p className="text-[13px] text-[#2C1A1D]/60 mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Box of {selectedSlots} — <span className="font-semibold text-[#2C1A1D]">£{currentPrice.toFixed(2)}</span>
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => { setSelectedSlots(6); setSelectedToppings({}); }}
                className={`text-[12px] font-semibold uppercase tracking-wider pb-1 transition-all border-b-2 ${selectedSlots === 6 ? "border-[#2C1A1D] text-[#2C1A1D]" : "border-transparent text-[#2C1A1D]/40 hover:text-[#2C1A1D]/70"}`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Select 6
              </button>
              <button 
                onClick={() => { setSelectedSlots(8); setSelectedToppings({}); }}
                className={`text-[12px] font-semibold uppercase tracking-wider pb-1 transition-all border-b-2 ${selectedSlots === 8 ? "border-[#2C1A1D] text-[#2C1A1D]" : "border-transparent text-[#2C1A1D]/40 hover:text-[#2C1A1D]/70"}`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Select 8
              </button>
            </div>
          </div>

          {/* CLEAN GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {config.toppings.map((topping: any) => {
              const count = selectedToppings[topping.id] || 0;
              const isSelected = count > 0;
              const formattedTitle = topping.name.replace(/\b\w/g, (char: string) => char.toUpperCase());
              const isFull = totalSelected >= selectedSlots;

              return (
                <div key={topping.id} className="flex flex-col w-full group">
                  
                  {/* IMAGE */}
                  <div 
                    onClick={() => handleAddOne(topping.id)}
                    className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#EBE0D3] cursor-pointer transition-all duration-500 ${!isSelected && isFull ? "opacity-40" : "opacity-100"}`}
                  >
                    <Image 
                      src={topping.image} 
                      alt={formattedTitle} 
                      fill 
                      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isSelected ? "scale-105" : ""}`} 
                    />
                    
                    {/* MINIMAL OVERLAY WHEN SELECTED */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur text-[#2C1A1D] h-8 w-8 rounded-full flex items-center justify-center font-bold text-[13px] shadow-sm">
                          {count}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TITLE */}
                  <div className="mt-3 flex flex-col items-center text-center">
                    <h3 className="text-[12px] md:text-[13px] font-medium text-[#2C1A1D] truncate" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                      {formattedTitle}
                    </h3>
                  </div>

                  {/* SMOOTH SLIDER (Only shows when selected) */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isSelected ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="flex items-center justify-between rounded-full border border-[#2C1A1D]/15 bg-white px-2 py-1 shadow-sm">
                        <button onClick={(e) => handleRemoveOne(e, topping.id)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#2C1A1D] hover:bg-[#FBF9F5] transition-colors">−</button>
                        <span className="text-[12px] font-semibold text-[#2C1A1D]">{count}</span>
                        <button onClick={() => handleAddOne(topping.id)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#2C1A1D] hover:bg-[#FBF9F5] transition-colors">+</button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* FLOATING BOTTOM BAR (Sticky within the modal) */}
        <div className="shrink-0 bg-white border-t border-[#2C1A1D]/10 px-8 py-5 md:px-12 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              {isComplete ? "Box Complete" : `${totalSelected} of ${selectedSlots} Selected`}
            </p>
            <p className="text-[22px] font-semibold text-[#2C1A1D] mt-1" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              £{currentPrice.toFixed(2)}
            </p>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            disabled={!isComplete}
            className={`w-full md:w-[280px] rounded-full py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
              isComplete 
                ? "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315] shadow-lg" 
                : "bg-[#FBF9F5] border border-[#2C1A1D]/20 text-[#2C1A1D]/30 cursor-not-allowed"
            }`} 
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {isComplete ? `Add to Bag — £${currentPrice.toFixed(2)}` : `Select ${selectedSlots - totalSelected} More`}
          </button>
        </div>

      </div>
    </div>
  );
}
