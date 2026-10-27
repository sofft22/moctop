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
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});

  const totalSelected = Object.values(selectedToppings).reduce((a, b) => a + b, 0);
  const isComplete = totalSelected === config.slots;

  const handleToggle = (toppingId: string) => {
    if (totalSelected >= config.slots && !selectedToppings[toppingId]) return;
    
    setSelectedToppings(prev => {
      const newState = { ...prev };
      const currentCount = newState[toppingId] || 0;
      
      // If they have some, remove one. If they have 0, add one.
      if (currentCount > 0) {
        if (currentCount === 1) {
          delete newState[toppingId];
        } else {
          newState[toppingId] = currentCount - 1;
        }
      } else {
        newState[toppingId] = 1;
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
      price: config.price,
      image: config.toppings[0]?.image || "/placeholder.png",
      size: `Box of ${config.slots} (${selectionDetails})`,
    };

    addToCart(customProduct, customProduct.size, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex bg-black/60 backdrop-blur-sm sm:p-4 sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 hidden sm:block" />
      
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-[850px] sm:rounded-xl overflow-y-auto"
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50 mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Custom Experience</p>
            <h2 className="text-[26px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{config.title}</h2>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8">
          <p className="text-[14px] text-[#2C1A1D]/70 mb-6 font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Select exactly {config.slots} treats to build your perfect box.
          </p>
          
          {/* EXACT PRODUCT CARD GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {config.toppings.map((topping: any) => {
              const count = selectedToppings[topping.id] || 0;
              const isSelected = count > 0;
              const formattedTitle = topping.name.replace(/\b\w/g, (char: string) => char.toUpperCase());

              return (
                <div 
                  key={topping.id} 
                  onClick={() => handleToggle(topping.id)}
                  className={`group flex flex-col cursor-pointer w-full transition-transform ${isComplete && !isSelected ? "opacity-50" : ""}`}
                >
                  
                  {/* IMAGE CONTAINER (Matches ProductCard) */}
                  <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#EBE0D3] border-2 transition-all duration-300 ${isSelected ? "border-[#2C1A1D]" : "border-transparent"}`}>
                    <Image 
                      src={topping.image} 
                      alt={formattedTitle} 
                      fill 
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                    
                    {/* SELECTED CHECKMARK OVERLAY */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2C1A1D] text-white shadow-md animate-in zoom-in">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM SECTION (Matches ProductCard Fonts) */}
                  <div className="mt-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 
                        className="text-[12px] md:text-[13px] font-semibold truncate leading-[1.3] tracking-[0.01em] text-[#2C1A1D]"
                        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {formattedTitle}
                      </h3>
                      
                      {/* QTY BADGE */}
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2C1A1D] text-[10px] font-bold text-white shrink-0 ml-2">
                          {count}
                        </span>
                      )}
                    </div>
                    
                    <p 
                      className="text-[11px] font-bold text-[#2C1A1D]/40 uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                    >
                      Tap to add
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PREMIUM FOOTER */}
        <div className="mt-auto border-t border-[#2C1A1D]/10 bg-[#FBF9F5] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-10 sm:pb-8">
          
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              {isComplete ? "Box Complete" : `Selected: ${totalSelected} of ${config.slots}`}
            </p>
            <p className="text-[24px] font-semibold text-[#2C1A1D] mt-1" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              £{config.price.toFixed(2)}
            </p>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            disabled={!isComplete}
            className={`w-full md:w-[300px] rounded-md py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
              isComplete 
                ? "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315] shadow-md" 
                : "bg-[#EBE0D3] text-[#2C1A1D]/40 cursor-not-allowed"
            }`} 
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {isComplete ? `Add to Bag — £${config.price.toFixed(2)}` : `Select ${config.slots - totalSelected} More`}
          </button>
        </div>

      </div>
    </div>
  );
}
