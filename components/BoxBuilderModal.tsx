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
    if (totalSelected >= config.slots) return; // Block if full
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
    
    // Build the description of what they chose
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
      image: config.toppings[0]?.image || "/placeholder.png", // Uses first topping image as cart thumbnail
      size: `Box of ${config.slots} (${selectionDetails})`,
    };

    addToCart(customProduct, customProduct.size, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex bg-black/60 backdrop-blur-sm sm:p-4 sm:items-center justify-center">
      <div className="absolute inset-0 hidden sm:block" onClick={onClose} />
      
      <div className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-[800px] sm:rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-white">
          <h2 className="text-[24px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{config.title}</h2>
          <button onClick={onClose} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <p className="text-[14px] text-[#2C1A1D]/70 mb-6">Pick your {config.slots} favorite treats below.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {config.toppings.map((topping: any) => {
              const count = selectedToppings[topping.id] || 0;
              return (
                <div key={topping.id} className={`relative overflow-hidden rounded-xl border-2 transition-all bg-white ${count > 0 ? "border-[#2C1A1D]" : "border-transparent"}`}>
                  <div className="relative aspect-square w-full cursor-pointer" onClick={() => handleSelect(topping.id)}>
                    <Image src={topping.image} alt={topping.name} fill className="object-cover" />
                    
                    {/* Checkmark overlay if selected */}
                    {count > 0 && (
                      <div className="absolute top-2 right-2 bg-[#2C1A1D] text-white h-6 w-6 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-[11px] font-bold">{count}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <p className="text-[12px] font-bold text-[#2C1A1D] truncate">{topping.name}</p>
                    <div className="flex gap-2">
                      {count > 0 && (
                        <button onClick={() => handleRemove(topping.id)} className="h-6 w-6 rounded border border-[#2C1A1D]/20 flex items-center justify-center text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white transition-colors">-</button>
                      )}
                      <button onClick={() => handleSelect(topping.id)} disabled={isComplete} className={`h-6 w-6 rounded border flex items-center justify-center transition-colors ${isComplete ? "border-gray-200 text-gray-300" : "border-[#2C1A1D]/20 text-[#2C1A1D] hover:bg-[#2C1A1D] hover:text-white"}`}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="shrink-0 border-t border-[#2C1A1D]/10 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]">Selected: {totalSelected} / {config.slots}</p>
            <p className="text-[20px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>£{config.price.toFixed(2)}</p>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            disabled={!isComplete}
            className={`w-full rounded-md py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${isComplete ? "bg-[#2C1A1D] text-[#FBF9F5] hover:bg-[#1F1315]" : "bg-[#EBE0D3] text-[#2C1A1D]/40 cursor-not-allowed"}`} 
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {isComplete ? `Add to Bag — £${config.price.toFixed(2)}` : `Select ${config.slots - totalSelected} More`}
          </button>
        </div>

      </div>
    </div>
  );
}
