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
  
  // State to handle the 6 or 8 choice
  const [selectedSlots, setSelectedSlots] = useState<number>(6);
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});

  // Price logic: Assuming admin saved base config for 6, if 8 is selected we add a small premium
  // (You can adjust this logic if the price is fixed regardless of size)
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
    <div className="fixed inset-0 z-[120] flex bg-black/60 backdrop-blur-sm sm:p-4 sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 hidden sm:block" />
      
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-[900px] sm:rounded-xl overflow-y-auto"
      >
        
        {/* CLEAN HEADER */}
        <div className="flex flex-col border-b border-[#2C1A1D]/10 px-6 py-6 md:px-10 md:py-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <span className="uppercase tracking-[0.15em] text-[#2C1A1D] text-[16px] font-semibold" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
              Mocktopia
            </span>
            <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBF9F5] text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <h2 className="text-[32px] md:text-[40px] text-[#2C1A1D] leading-tight mb-2" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            Build Your Box
          </h2>
          
          {/* PRICE LINE */}
          <p className="text-[14px] text-[#2C1A1D]/60 mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Box of {selectedSlots} — <span className="font-bold text-[#2C1A1D]">£{currentPrice.toFixed(2)}</span>
          </p>

          {/* SIZE SELECTOR (6 or 8) */}
          <div className="flex gap-3">
            <button 
              onClick={() => { setSelectedSlots(6); setSelectedToppings({}); }}
              className={`px-6 py-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all border ${selectedSlots === 6 ? "bg-[#2C1A1D] border-[#2C1A1D] text-white" : "border-[#2C1A1D]/20 text-[#2C1A1D] hover:border-[#2C1A1D]"}`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Select 6
            </button>
            <button 
              onClick={() => { setSelectedSlots(8); setSelectedToppings({}); }}
              className={`px-6 py-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all border ${selectedSlots === 8 ? "bg-[#2C1A1D] border-[#2C1A1D] text-white" : "border-[#2C1A1D]/20 text-[#2C1A1D] hover:border-[#2C1A1D]"}`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Select 8
            </button>
          </div>
        </div>

        {/* TOPPINGS GRID */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {config.toppings.map((topping: any) => {
              const count = selectedToppings[topping.id] || 0;
              const isSelected = count > 0;
              const formattedTitle = topping.name.replace(/\b\w/g, (char: string) => char.toUpperCase());
              const isFull = totalSelected >= selectedSlots;

              return (
                <div key={topping.id} className="flex flex-col w-full">
                  
                  {/* THE CARD (Matches ProductCard exactly) */}
                  <div 
                    onClick={() => handleAddOne(topping.id)}
                    className={`group cursor-pointer flex flex-col w-full transition-all ${
                      !isSelected && isFull ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#EBE0D3] border-2 transition-all duration-300 ${isSelected ? "border-[#2C1A1D]" : "border-transparent"}`}>
                      <Image 
                        src={topping.image} 
                        alt={formattedTitle} 
                        fill 
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                    </div>

                    <div className="mt-3 flex flex-col gap-1">
                      <h3 className="text-[13px] font-semibold truncate leading-[1.3] text-[#2C1A1D]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                        {formattedTitle}
                      </h3>
                    </div>
                  </div>

                  {/* QUANTITY SLIDER (Slides out under selected card) */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isSelected ? "grid-rows-[1fr] mt-2 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="flex items-center justify-between rounded-md border border-[#2C1A1D]/20 bg-white p-1">
                        <button onClick={(e) => handleRemoveOne(e, topping.id)} className="flex h-8 w-8 items-center justify-center rounded text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors">
                          −
                        </button>
                        <span className="text-[13px] font-bold text-[#2C1A1D]">{count}</span>
                        <button onClick={() => handleAddOne(topping.id)} className="flex h-8 w-8 items-center justify-center rounded text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER (No stick, scrolls to bottom) */}
        <div className="mt-auto border-t border-[#2C1A1D]/10 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 sm:pb-8">
          
          <div className="flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              {isComplete ? "Box Complete" : `Selected: ${totalSelected} of ${selectedSlots}`}
            </p>
            <p className="text-[24px] font-semibold text-[#2C1A1D] mt-1" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              £{currentPrice.toFixed(2)}
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
            {isComplete ? `Add to Bag — £${currentPrice.toFixed(2)}` : `Select ${selectedSlots - totalSelected} More`}
          </button>
        </div>

      </div>
    </div>
  );
}
