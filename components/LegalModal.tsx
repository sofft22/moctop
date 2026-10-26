"use client";

import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy" | "refunds" | "allergens" | null;
}

export function LegalModal({ isOpen, onClose, type }: Props) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !type) return null;

  const content = {
    terms: {
      title: "Terms & Conditions",
      body: (
        <>
          <p><strong>1. Order Acceptance:</strong> All orders are subject to availability. A contract is formed only when we send you an order confirmation email.</p>
          <p><strong>2. Pricing:</strong> All prices are in GBP (£) and include VAT where applicable. Delivery charges are calculated at checkout.</p>
          <p><strong>3. Cancellations:</strong> Under UK Consumer Contracts Regulations, you have a 14-day right to cancel. However, due to the perishable nature of our fresh bakes, this right does not apply once the order has been dispatched or baked.</p>
          <p><strong>4. Liability:</strong> We are not liable for any allergic reactions. Please review our Allergen Information before ordering.</p>
        </>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <>
          <p><strong>1. Data We Collect:</strong> We collect your name, phone number, email address, and delivery address when you place an order.</p>
          <p><strong>2. How We Use It:</strong> Your data is used solely to fulfill your order, communicate updates, and maintain accounting records.</p>
          <p><strong>3. Third Parties:</strong> We share necessary details with our payment processor (Paystack) and delivery couriers. We do not sell your data.</p>
          <p><strong>4. Your Rights:</strong> You have the right to request access to, or deletion of, your personal data by contacting us.</p>
        </>
      )
    },
    refunds: {
      title: "Refund & Returns Policy",
      body: (
        <>
          <p><strong>1. Perishable Goods:</strong> Because our products are freshly baked and perishable, we cannot accept returns for a change of mind.</p>
          <p><strong>2. Damaged or Incorrect Orders:</strong> If your order arrives damaged, missing, or incorrect, please contact us within 24 hours of delivery with photographic evidence. We will offer a replacement or refund.</p>
          <p><strong>3. Late Deliveries:</strong> If your order is significantly delayed due to our fault, please reach out and we will make it right.</p>
        </>
      )
    },
    allergens: {
      title: "Allergen Information",
      body: (
        <>
          <p><strong>Important Notice:</strong> Our products are made in a kitchen that handles <strong>cereals containing gluten, milk, eggs, and nuts.</strong></p>
          <p>While we take precautions, we cannot guarantee a completely allergen-free environment. Cross-contamination is possible.</p>
          <p>If you have a severe allergy, please contact us before ordering to discuss your specific requirements.</p>
        </>
      )
    }
  };

  const currentContent = content[type];

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4" 
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-[600px] flex-col bg-[#FBF9F5] rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 px-6 py-5 bg-[#FBF9F5]">
          <h2 className="text-[24px] text-[#2C1A1D]" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
            {currentContent.title}
          </h2>
          <button 
            onClick={onClose} 
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#2C1A1D]/50 transition-colors hover:bg-[#2C1A1D]/5 hover:text-[#2C1A1D]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div 
          className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4 text-[14px] leading-[1.8] text-[#2C1A1D]/75" 
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {currentContent.body}
        </div>
      </div>
    </div>
  );
}
