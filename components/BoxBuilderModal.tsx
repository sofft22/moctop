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
    <div 
      className="fixed inset-0 z-[120] flex bg-[#1F1315]/80 backdrop-blur-sm sm:p-6 items-center justify-center" 
      onClick={onClose}
    >
      <div className="absolute inset-0 hidden sm:block" />
      
      {/* MODAL CONTAINER: Full screen scroll on mobile */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-[1000px] sm:rounded-xl overflow-y-auto overscroll-contain"
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-6 md:px-10 border-b border-[#2C1A1D]/10 bg-white shrink-0">
          <span className="uppercase tracking-[0.2em] text-[12px] font-semibold text-[#2C1A1D]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
            Mocktopia
          </span>
          <button onClick={onClose} className="text-[#2C1A1D]/40 hover:text-[#2C1A1D] transition-colors p-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-10 flex-1">
          
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
                Select 6
              </button>
              <button 
                onClick={() => { setSelectedSlots(8); setSelectedToppings({}); }}
                className={`text-[11px] font-bold uppercase tracking-[0.1em] pb-1 transition-colors border-b-2 ${selectedSlots === 8 ? "border-[#2C1A1D] text-[#2C1A1D]" : "border-transparent text-[#2C1A1D]/40 hover:text-[#2C1A1D]"}`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Select 8
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-12">
            {config.toppings.map((topping: any) => {
              const count = selectedToppings[topping.id] || 0;
              const isSelected = count > 0;
              const formattedTitle = topping.name.replace(/\b\w/g, (char: string) => char.toUpperCase());
              const isFull = totalSelected >= selectedSlots;

              return (
                <div key={topping.id} className="flex flex-col w-full group">
                  
                  {/* IMAGE CARD WITH OVERLAY */}
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
                    
                    {/* RESTORED OVERLAY */}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
                        <div className="bg-white/90 backdrop-blur text-[#2C1A1D] h-9 w-9 rounded-full flex items-center justify-center font-bold text-[14px] shadow-sm">
                          {count}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TITLE & CONTROLS */}
                  <div className="mt-2.5 text-center flex flex-col items-center">
                    <h3 className="text-[12px] font-semibold text-[#2C1A1D] truncate w-full" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                      {formattedTitle}
                    </h3>
                    
                    {isSelected ? (
                      <div className="mt-1.5 flex items-center justify-center gap-3">
                        <button onClick={(e) => handleRemoveOne(e, topping.id)} className="text-[14px] text-[#2C1A1D]/50 hover:text-[#2C1A1D]">−</button>
                        <span className="text-[12px] font-bold text-[#2C1A1D]">{count}</span>
                        <button onClick={() => handleAddOne(topping.id)} className="text-[14px] text-[#2C1A1D]/50 hover:text-[#2C1A1D]">+</button>
                      </div>
                    ) : (
                      <p 
                        className="text-[10px] text-[#2C1A1D]/40 mt-1.5 cursor-pointer hover:text-[#2C1A1D] transition-colors" 
                        onClick={() => handleAddOne(topping.id)}
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

          {/* CHECKOUT (Scrolls with content, no sticky) */}
          <div className="mt-16 pt-8 border-t border-[#2C1A1D]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
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
    </div>
  );
}
