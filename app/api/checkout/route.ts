import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const stripeSecret = (env as any).STRIPE_SECRET_KEY;

    if (!stripeSecret) return NextResponse.json({ error: "Stripe Secret Key missing" }, { status: 500 });

    const stripe = new Stripe(String(stripeSecret).trim(), {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId } = body;

    let totalWeight = 0;
    let subtotal = 0;

    // Loop through cart items
    items.forEach((item: any) => {
      let itemWeight = Number(item.weight) || 0;
      
      // BULLETPROOF SIZE CHECK: Do not assume it's an array, try to parse it.
      if (item.size && item.sizes) {
        try {
          // If it's a string, parse it. If it's already an array, keep it.
          const parsedSizes = typeof item.sizes === "string" ? JSON.parse(item.sizes) : item.sizes;
          
          if (Array.isArray(parsedSizes)) {
            // Find the selected size
            const matchedSize = parsedSizes.find((s: any) => s.name === item.size || s.size === item.size);
            if (matchedSize && matchedSize.weight !== undefined) {
              itemWeight = Number(matchedSize.weight);
            }
          }
        } catch (error) {
          // If parsing fails, just ignore and use the base weight
          console.log("Could not parse sizes for item:", item.title);
        }
      }
      
      totalWeight += itemWeight * item.qty;
      
      // Calculate subtotal
      const itemPrice = typeof item.price === "number" ? item.price : parseInt(String(item.price).replace(/[^0-9.]/g, ""), 10) || 0;
      subtotal += itemPrice * item.qty;
    });

    // Calculate shipping based on weight
    let shipping = 0;
    if (totalWeight > 0) {
      if (totalWeight <= 2) shipping = 4.80;
      else if (totalWeight <= 20) shipping = 7.50;
      else shipping = 7.50;
    }

    // Calculate total
    const baseAmount = Math.max(0, subtotal + shipping);
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
            description: `Order ID: ${orderId} | Est. Weight: ${totalWeight.toFixed(2)}kg`,
          },
          unit_amount: finalAmountInPence,
        },
        quantity: 1,
      }
    ];

    const baseUrl = "https://mocktopiatreats.com";

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
    console.error("Stripe Backend Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
