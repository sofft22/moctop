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

  const handleSelect = (toppingId: string) => {
    if (totalSelected >= config.slots) return;
    setSelectedToppings(prev => ({
      ...prev,
      [toppingId]: (prev[toppingId] || 0) + 1
    }));
  };

  const handleRemove = (toppingId: string) => {
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
      
      {/* FULL SCREEN ON MOBILE, ELEGANT ON DESKTOP */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-[850px] sm:rounded-xl overflow-y-auto scroll-smooth"
      >
        
        {/* NON-STICKY HEADER */}
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5]">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50 mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Custom Experience</p>
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
          
          {/* TOPPING GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {config.toppings.map((topping: any) => {
              const count = selectedToppings[topping.id] || 0;
              return (
                <div key={topping.id} className={`group relative flex flex-col rounded-xl border-2 transition-all duration-300 bg-white overflow-hidden ${count > 0 ? "border-[#2C1A1D] shadow-md" : "border-[#2C1A1D]/10 hover:border-[#2C1A1D]/30"}`}>
                  
                  <div className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden" onClick={() => handleSelect(topping.id)}>
                    <Image src={topping.image} alt={topping.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* Selected Count Badge */}
                    {count > 0 && (
                      <div className="absolute top-2 right-2 bg-[#2C1A1D] text-[#FBF9F5] h-7 w-7 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-[12px] font-bold">{count}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex items-center justify-between bg-white">
                    <p className="text-[12px] font-bold text-[#2C1A1D] truncate pr-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{topping.name}</p>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {count > 0 && (
                        <button onClick={() => handleRemove(topping.id)} className="h-6 w-6 rounded-md border border-[#2C1A1D]/20 flex items-center justify-center text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors">−</button>
                      )}
                      <button 
                        onClick={() => handleSelect(topping.id)} 
                        disabled={isComplete} 
                        className={`h-6 w-6 rounded-md border flex items-center justify-center transition-colors ${isComplete ? "border-gray-200 text-gray-300" : "border-[#2C1A1D]/20 text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white"}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER (Scrolls with content, no stick) */}
        <div className="mt-auto border-t border-[#2C1A1D]/10 bg-[#FBF9F5] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-10 sm:pb-8">
          
          <div className="flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
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
            {isComplete ? "Add to Bag" : `Select ${config.slots - totalSelected} More`}
          </button>
        </div>

      </div>
    </div>
  );
}
