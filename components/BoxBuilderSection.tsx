"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/app/CartContext";

export function BoxBuilderSection() {
  const { addToCart } = useCart();
  const [config, setConfig] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data && data.boxBuilderConfig) {
        try {
          const parsed = JSON.parse(data.boxBuilderConfig);
          if (parsed.isActive && parsed.toppings.length > 0) {
            setConfig(parsed);
          }
        } catch (e) {}
      }
    });
  }, []);

  if (!config) return null;

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
    setIsModalOpen(false);
    setSelectedToppings({});
  };

  return (
    <>
      <section className="w-full bg-[#FBF9F5] py-20 px-6 md:py-28 md:px-12 border-t border-[#2C1A1D]/10">
        {/* Changed max-w to 1600px so it stretches more, giving the image more space */}
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Image Side - Given 55% width and a very tall aspect ratio */}
          <div className="relative w-full md:w-[55%] aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl bg-[#EBE0D3] shadow-sm">
            <Image src="/box-builder-home.png" alt="Build Your Own Box" fill className="object-cover" />
          </div>

          {/* Text Side - Given 45% width */}
          <div className="w-full md:w-[45%] flex flex-col justify-center text-center md:text-left md:pr-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2C1A1D]/60 mb-3" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              Custom Experience
            </p>
            <h2 className="text-[40px] md:text-[56px] text-[#2C1A1D] leading-[1.05] mb-5" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
              {config.title}
            </h2>
            
            {/* UPDATED TEXT: Accommodates both sizes and shortened slightly */}
            <p className="text-[15px] md:text-[16px] leading-[1.7] text-[#2C1A1D]/70 mb-8 max-w-md mx-auto md:mx-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Build your perfect box. Choose your favorite treats and customize it exactly how you want, available in boxes of {config.slots} or more.
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-[280px] rounded-md bg-[#2C1A1D] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315] mx-auto md:mx-0"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Build Your Box
            </button>
          </div>
        </div>
      </section>

      {/* THE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex bg-black/60 backdrop-blur-sm sm:p-4 sm:items-center justify-center">
          <div className="absolute inset-0 hidden sm:block" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-[800px] sm:rounded-xl overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-white">
              <h2 className="text-[24px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>{config.title}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#2C1A1D]/50 hover:text-[#2C1A1D]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <p className="text-[14px] text-[#2C1A1D]/70 mb-6">Pick your {config.slots} favorite treats below.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {config.toppings.map((topping: any) => {
                  const count = selectedToppings[topping.id] || 0;
                  return (
                    <div key={topping.id} className={`relative overflow-hidden rounded-xl border-2 transition-all bg-white ${count > 0 ? "border-[#2C1A1D]" : "border-transparent"}`}>
                      <div className="relative aspect-square w-full cursor-pointer" onClick={() => handleSelect(topping.id)}>
                        <Image src={topping.image} alt={topping.name} fill className="object-cover" />
                        
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
      )}
    </>
  );
}
