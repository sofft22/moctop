import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    // 1. Get the Cloudflare environment context
    const { env } = getCloudflareContext();

    // 2. Read the key from the environment
    const stripeSecret = (env as any).STRIPE_SECRET_KEY;

    // 3. If it's missing, log it and return the error
    if (!stripeSecret) {
      console.log("CLOUDFLARE DID NOT PASS THE KEY");
      return NextResponse.json({ error: "Key missing" }, { status: 500 });
    }

    // 4. Ensure it's a clean string (removes any accidental spaces)
    const cleanKey = String(stripeSecret).trim();

    const stripe = new Stripe(cleanKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId } = body;

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.title || "Mocktopia Treat",
          description: item.size ? `Size: ${item.size}` : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://moctop.boluwatifedaniel2009.workers.dev/order/" + orderId,
      cancel_url: "https://moctop.boluwatifedaniel2009.workers.dev/checkout",
      customer_email: customerDetails.email,
      metadata: {
        orderId: orderId,
        customerName: customerDetails.customerName,
        phone: customerDetails.phone,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
