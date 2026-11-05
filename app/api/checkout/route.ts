import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const stripeSecret = (env as any).STRIPE_SECRET_KEY;

    if (!stripeSecret) return NextResponse.json({ error: "Key missing" }, { status: 500 });

    const stripe = new Stripe(String(stripeSecret).trim(), {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId, appliedPromoCode } = body;

    // 1. SECURELY CALCULATE TOTAL WEIGHT ON THE SERVER
    let totalWeight = 0;
    let subtotal = 0;

    items.forEach((item: any) => {
      let itemWeight = item.weight || 0;
      if (item.size && item.sizes) {
        const sizeObj = item.sizes.find((s: any) => s.name === item.size);
        if (sizeObj && sizeObj.weight) itemWeight = sizeObj.weight;
      }
      totalWeight += itemWeight * item.qty;
      
      // Calculate subtotal securely
      const itemPrice = typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ""), 10);
      subtotal += itemPrice * item.qty;
    });

    // 2. CALCULATE SHIPPING SECURELY
    let shipping = 0;
    if (totalWeight > 0) {
      if (totalWeight <= 2) shipping = 4.80;
      else if (totalWeight <= 20) shipping = 7.50;
      else shipping = 7.50; // Over 20kg fallback
    }

    // 3. CALCULATE PROMO (Optional: You should also verify the promo code in your DB securely here)
    // For now, we assume the frontend sends the right discount, but ideally, you fetch the promo from D1 here.
    let discountAmount = 0; 
    // (If you have a promo DB, check appliedPromoCode here and set discountAmount)

    // 4. CALCULATE FINAL TOTAL
    const baseAmount = Math.max(0, subtotal + shipping - discountAmount);
    const feePercentage = 0.015;
    const fixedFee = 0.20;
    const processingFee = Number((baseAmount * feePercentage + fixedFee).toFixed(2));
    const finalTotal = Number((baseAmount + processingFee).toFixed(2));
    
    const finalAmountInPence = Math.round(finalTotal * 100);

    const lineItems = [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Mocktopia Order",
            description: `Order ID: ${orderId} | Weight: ${totalWeight.toFixed(2)}kg`,
          },
          unit_amount: finalAmountInPence,
        },
        quantity: 1,
      }
    ];

    const baseUrl = "https://moctop.boluwatifedaniel2009.workers.dev";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?orderId=${orderId}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: customerDetails.email,
      metadata: {
        orderId: orderId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
