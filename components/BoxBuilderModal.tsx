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

  const price6 = config.price6 || config.price || 20;
  const price8 = config.price8 || (config.price ? config.price + 5 : 25);
  const currentPrice = selectedSlots === 6 ? price6 : price8; 

  const totalSelected = Object.values(selectedToppings).reduce((a, b) => a + b, 0);
  const isComplete = totalSelected === selectedSlots;

  const handleAddOne = (toppingId: string) => {
    if (totalSelected >= selectedSlots) return;
    setSelectedToppings(prev => ({
      ...prev,
      [toppingId]: (prev[toppingId] || 0) + 1
    }));
  };

  const handleRemoveAll = (e: React.MouseEvent, toppingId: string) => {
    e.stopPropagation();
    setSelectedToppings(prev => {
      const newState = { ...prev };
      delete newState[toppingId];
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
    <div 
      className="fixed inset-0 z-[120] flex bg-[#1F1315]/80 backdrop-blur-sm p-4 sm:p-6 items-center justify-center" 
      onClick={onClose}
    >
      
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full max-w-[1000px] h-full max-h-[90dvh] sm:max-h-[85vh] rounded-xl overflow-hidden"
      >
        
        {/* SCROLLABLE CONTENT (Header is now inside here) */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-10">
          
          {/* HEADER (Scrolls away) */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2C1A1D]/10">
            <span className="uppercase tracking-[0.2em] text-[12px] font-semibold text-[#2C1A1D]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
              Mocktopia
            </span>
            <button onClick={onClose} className="text-[#2C1A1D]/40 hover:text-[#2C1A1D] transition-colors p-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <div className="mb-10">
            <h2 className="text-[28px] md:text-[36px] text-[#2C1A1D] mb-2" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              Build Your Box
            </h2>
            <p className="text-[12px] text-[#2C1A1D]/60 mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Box of {selectedSlots} — <span className="font-bold text-[#2C1A1D]">£{currentPrice.toFixed(2)}</span>
            </p>

            <div className="flex gap-6 border-b border-[#2C1A1D]/10 pb-3">
              <button 
                onClick={() => { setSelectedSlots(6); setSelectedToppings({}); }}
                className={`text-[11px] font-bold uppercase tracking-[0.1em] pb-1 transition-colors border-b-2 ${selectedSlots === 6 ? "border-[#2C1A1D] text-[#2C1A1D]" : "border-transparent text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Select 6 — £{price6.toFixed(2)}
              </button>
              <button 
                onClick={() => { setSelectedSlots(8); setSelectedToppings({}); }}
                className={`text-[11px] font-bold uppercase tracking-[0.1em] pb-1 transition-colors border-b-2 ${selectedSlots === 8 ? "border-[#2C1A1D] text-[#2C1A1D]" : "border-transparent text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Select 8 — £{price8.toFixed(2)}
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-12 pb-6">
            {config.toppings.map((topping: any) => {
              const count = selectedToppings[topping.id] || 0;
              const isSelected = count > 0;
              const formattedTitle = topping.name.replace(/\b\w/g, (char: string) => char.toUpperCase());
              const isFull = totalSelected >= selectedSlots;

              return (
                <div key={topping.id} className="flex flex-col w-full group">
                  
                  <div 
                    onClick={() => handleAddOne(topping.id)}
                    className={`relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#EBE0D3] cursor-pointer transition-all duration-300 ${!isSelected && isFull ? "opacity-40" : "opacity-100"}`}
                  >
                    <Image 
                      src={topping.image} 
                      alt={formattedTitle} 
                      fill 
                      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isSelected ? "scale-105" : ""}`} 
                    />
                    
                    {isSelected && (
                      <button 
                        onClick={(e) => handleRemoveAll(e, topping.id)}
                        className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#2C1A1D] hover:bg-white shadow-sm transition-transform hover:scale-110"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" /></svg>
                      </button>
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                        <div className="bg-white text-[#2C1A1D] h-10 w-10 rounded-full flex items-center justify-center font-bold text-[15px] shadow-md">
                          {count}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 text-center flex flex-col items-center">
                    <h3 className="text-[12px] font-semibold text-[#2C1A1D] truncate w-full" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                      {formattedTitle}
                    </h3>
                    
                    <p 
                      className={`text-[10px] mt-1.5 transition-colors ${isSelected ? "text-[#2C1A1D]/60 font-medium" : "text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`}
                      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {isSelected ? "Click to add more" : "Click to add"}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* STICKY FOOTER (Pinned to the bottom) */}
        <div className="shrink-0 border-t border-[#2C1A1D]/10 bg-white p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              {isComplete ? "Box Complete" : `Selected: ${totalSelected} of ${selectedSlots}`}
            </p>
            <p className="text-[20px] font-bold text-[#2C1A1D] mt-1" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              £{currentPrice.toFixed(2)}
            </p>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            disabled={!isComplete}
            className={`w-full md:w-[280px] rounded-md py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
              isComplete 
                ? "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315]" 
                : "bg-[#EBE0D3] text-[#2C1A1D]/40 cursor-not-allowed"
            }`} 
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {isComplete ? "Add to Bag" : `Select ${selectedSlots - totalSelected} More`}
          </button>
        </div>

      </div>
    </div>
  );
}
