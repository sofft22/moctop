"use client";

export function LegalModal({ 
  isOpen, 
  onClose, 
  type 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  type: "terms" | "privacy" | "refunds" | "allergens" | "delivery" | null 
}) {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-[150] flex bg-black/60 backdrop-blur-sm sm:p-6 sm:items-center justify-center" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col bg-[#FBF9F5] shadow-2xl w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-[700px] sm:rounded-xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-200"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C1A1D]/10 bg-white px-6 py-5 shrink-0">
          <h2 className="text-[22px] text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            {type === "allergens" && "Allergen Information"}
            {type === "privacy" && "Privacy Policy"}
            {type === "refunds" && "Refunds & Returns Policy"}
            {type === "delivery" && "Ordering & Delivery Policy"}
            {type === "terms" && "Terms & Conditions"}
          </h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FBF9F5] text-[#2C1A1D]/50 hover:text-[#2C1A1D] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 text-[13px] leading-[1.7] text-[#2C1A1D]/80 space-y-5" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          
          {/* --- ALLERGEN INFO --- */}
          {type === "allergens" && (
            <>
              <p className="font-bold text-[#2C1A1D]">Important Notice — Please Read Before Ordering</p>
              <p>At Mocktopia Treats, food safety and customer wellbeing are important to us.</p>
              <p>Our products are prepared in a kitchen that handles cereals containing gluten, milk, eggs and nuts. As a result, cross-contamination may occur, even though we take precautions to reduce the risk.</p>
              <p>We cannot guarantee that our products are completely free from unintended traces of these allergens.</p>
              <p>If you have a food allergy, intolerance or specific dietary requirement, please contact us before placing your order so we can discuss your requirements and provide relevant product information.</p>
              <p>If you have a severe allergy, please contact us before ordering. We will explain the precautions we can take and whether we can safely accommodate your request. We will not confirm an order if we cannot appropriately address the relevant safety concerns.</p>
              <p>Please do not assume that a product is suitable for your allergy simply because the allergen is not listed among its main ingredients. If you are unsure, contact us before purchasing.</p>
            </>
          )}

          {/* --- TERMS --- */}
          {type === "terms" && (
            <>
              <h3 className="font-bold text-[#2C1A1D] pt-2">1. Ordering and Payment</h3>
              <p>All orders must be paid for in full at checkout before processing. Customers are responsible for providing accurate contact details, delivery addresses and order selections. Orders are subject to product availability.</p>
              
              <h3 className="font-bold text-[#2C1A1D] pt-2">2. Order Cut-Off Times</h3>
              <p>Our standard order cut-off time is 12 noon.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Orders placed before 12 noon:</strong> Eligible orders are scheduled for delivery or dispatch the following day.</li>
                <li><strong>Orders placed after 12 noon:</strong> Eligible orders are scheduled for delivery or dispatch on the second day after the order is placed.</li>
                <li><strong>Non-operating days and bank holidays:</strong> Orders will be processed on the next available operating day.</li>
              </ul>

              <h3 className="font-bold text-[#2C1A1D] pt-2">3. Cancellations</h3>
              <p>We request at least 24 hours’ notice for cancellation or amendment requests. Changes cannot be guaranteed once preparation has started. Certain perishable food products may be exempt from statutory change-of-mind cancellation rights.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">4. Customer Responsibilities</h3>
              <p>Customers must provide accurate delivery details and contact us promptly if there is an error. Nothing in this policy affects your statutory rights.</p>
            </>
          )}

          {/* --- DELIVERY POLICY --- */}
          {type === "delivery" && (
            <>
              <h3 className="font-bold text-[#2C1A1D] pt-2">1. Delivery Within Plymouth</h3>
              <p>For customers within our Plymouth delivery area, we aim to deliver eligible orders the following day when placed before 12 noon. Saturday delivery may be available. Delivery on Sundays and bank holidays is not guaranteed.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">2. Delivery Outside Plymouth</h3>
              <p>We accept delivery enquiries from outside Plymouth. Depending on the destination, order size and product type, delivery may be arranged through a suitable courier or delivered personally. Weekend delivery cannot be guaranteed. Charges will be confirmed before payment.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">3. Collection</h3>
              <p>Collection is available where offered at checkout. Instructions including date, time and location will be provided in the order confirmation.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">4. Delivery Delays</h3>
              <p>We make reasonable efforts to fulfil orders on the agreed date. However, unexpected circumstances or courier delays may affect delivery. If we become aware of a delay, we will contact you as soon as possible.</p>
            </>
          )}

          {/* --- REFUNDS POLICY --- */}
          {type === "refunds" && (
            <>
              <p>At Mocktopia Treats, we take pride in preparing quality products. If something goes wrong with your order, please contact us so we can help resolve the issue.</p>
              
              <h3 className="font-bold text-[#2C1A1D] pt-2">1. Perishable Products and Change of Mind</h3>
              <p>Our products are freshly prepared and may be perishable. For food safety and hygiene reasons, we do not generally accept physical returns of food products simply because a customer has changed their mind. Under UK consumer law, certain goods that are liable to deteriorate or expire rapidly may be exempt from the usual statutory cancellation right for online purchases.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">2. Damaged, Missing or Incorrect Orders</h3>
              <p>If your order arrives damaged, contains missing items or is incorrect, please contact us as soon as possible, ideally within 24 hours of delivery. Please provide your order number, a description of the issue and photographs where possible.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">3. Refund Processing</h3>
              <p>Where a refund is agreed or legally required, we will process it in accordance with applicable law using the original payment method.</p>
            </>
          )}

          {/* --- PRIVACY POLICY --- */}
          {type === "privacy" && (
            <>
              <p>At Mocktopia Treats, we respect your privacy and are committed to protecting your personal information.</p>
              
              <h3 className="font-bold text-[#2C1A1D] pt-2">1. Information We Collect</h3>
              <p>We may collect your name, phone number, email, delivery address, order information, payment status and technical website data (like cookies).</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">2. How We Use Your Information</h3>
              <p>We use your information to process orders, arrange delivery, send confirmations, respond to enquiries, maintain records, prevent fraud and meet legal obligations. We will not use your information for unrelated marketing without consent.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">3. Sharing Your Information</h3>
              <p>We do not sell your data. We may share it with payment processors (like Paystack), delivery couriers, and website hosting providers only when necessary to fulfil your order or comply with the law.</p>

              <h3 className="font-bold text-[#2C1A1D] pt-2">4. Your Privacy Rights</h3>
              <p>Under UK data protection law, you have the right to request access to your data, ask for corrections, request deletion, restrict processing, or object to certain uses. To exercise these rights, please contact us.</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
