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
  
  // NEW: Get the correct weight based on the selected box size
  const weight6 = config.weight6 || 0.5;
  const weight8 = config.weight8 || 0.7;

  const currentPrice = selectedSlots === 6 ? price6 : price8; 
  const currentWeight = selectedSlots === 6 ? weight6 : weight8; // <--- NEW

  const totalSelected = Object.values(selectedToppings).reduce((a, b) => a + b, 0);
  const isComplete = totalSelected === selectedSlots;

  const handleAddOne = (toppingId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (totalSelected >= selectedSlots) return;
    setSelectedToppings(prev => ({
      ...prev,
      [toppingId]: (prev[toppingId] || 0) + 1
    }));
  };

  const handleRemoveOne = (toppingId: string, e: React.MouseEvent) => {
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
      weight: currentWeight, // <--- NEW: Pass the weight to the cart!
      image: config.toppings[0]?.image || "/placeholder.png",
      size: `Box of ${selectedSlots} (${selectionDetails})`,
    };

    addToCart(customProduct, customProduct.size, 1);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex bg-[#FBF9F5]" 
      onClick={onClose}
    >
      
      {/* FULL SCREEN CONTAINER */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col w-full h-full bg-[#FBF9F5] overflow-hidden transform-gpu"
      >
        
        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto overscroll-auto scroll-smooth p-6 md:p-10">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2C1A1D]/10 max-w-[1200px] mx-auto">
            <span className="uppercase tracking-[0.2em] text-[12px] font-semibold text-[#2C1A1D]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
              Mocktopia
            </span>
            <button onClick={onClose} className="text-[#2C1A1D]/40 hover:text-[#2C1A1D] transition-colors p-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <div className="max-w-[1200px] mx-auto">
            <div className="mb-10">
              <h2 className="text-[32px] md:text-[40px] text-[#2C1A1D] mb-2" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
                Build Your Box
              </h2>
              <p className="text-[13px] md:text-[14px] text-[#2C1A1D]/60 mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Box of {selectedSlots} — <span className="font-bold text-[#2C1A1D]">£{currentPrice.toFixed(2)}</span>
              </p>

              <div className="flex gap-6 border-b border-[#2C1A1D]/10 pb-3">
                <button 
                  onClick={() => { setSelectedSlots(6); setSelectedToppings({}); }}
                  className={`text-[12px] font-bold uppercase tracking-[0.1em] pb-1 transition-colors border-b-2 ${selectedSlots === 6 ? "border-[#2C1A1D] text-[#2C1A1D]" : "border-transparent text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`}
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Select 6 — £{price6.toFixed(2)}
                </button>
                <button 
                  onClick={() => { setSelectedSlots(8); setSelectedToppings({}); }}
                  className={`text-[12px] font-bold uppercase tracking-[0.1em] pb-1 transition-colors border-b-2 ${selectedSlots === 8 ? "border-[#2C1A1D] text-[#2C1A1D]" : "border-transparent text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`}
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Select 8 — £{price8.toFixed(2)}
                </button>
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-12 pb-6">
              {config.toppings.map((topping: any, index: number) => {
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
                        sizes="(max-width: 768px) 50vw, 25vw"
                        priority={index < 4}
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isSelected ? "scale-105" : ""}`} 
                      />

                      {/* QUANTITY SELECTOR OVERLAY */}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity">
                          <div className="flex items-center gap-3 rounded-full bg-white px-2 py-1 shadow-lg">
                            <button 
                              onClick={(e) => handleRemoveOne(topping.id, e)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-[#2C1A1D] hover:bg-[#FBF9F5] transition-colors text-lg"
                            >
                              −
                            </button>
                            <span className="text-[14px] font-bold text-[#2C1A1D] w-4 text-center">
                              {count}
                            </span>
                            <button 
                              onClick={(e) => handleAddOne(topping.id, e)}
                              disabled={isFull}
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-[#2C1A1D] transition-colors text-lg ${isFull ? "opacity-30 cursor-not-allowed" : "hover:bg-[#FBF9F5]"}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-center flex flex-col items-center">
                      <h3 className="text-[13px] font-semibold text-[#2C1A1D] truncate w-full" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                        {formattedTitle}
                      </h3>
                      
                      {!isSelected && (
                        <p 
                          className="text-[11px] mt-1.5 text-[#2C1A1D]/40 hover:text-[#2C1A1D] transition-colors"
                          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          Click to add
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SLIM STICKY FOOTER */}
        <div className="shrink-0 border-t border-[#2C1A1D]/10 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-4 md:px-10 md:py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {isComplete ? "Box Complete" : `${totalSelected} of ${selectedSlots} Selected`}
              </p>
              <p className="text-[16px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
                £{currentPrice.toFixed(2)}
              </p>
            </div>
            
            <button 
              onClick={handleAddToCart} 
              disabled={!isComplete}
              className={`rounded-md px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
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
    </div>
  );
}
