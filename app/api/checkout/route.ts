import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    // 1. Read the key but force it to be a plain string to bypass Cloudflare's URL parser
    const rawKey = process.env.STRIPE_API_KEY;
    
    if (!rawKey) {
      return NextResponse.json({ error: "Key missing" }, { status: 500 });
    }

    // 2. Strip out any hidden characters Cloudflare might have added
    const stripeSecret = String(rawKey).replace(/[^\x20-\x7E]/g, '').trim();

    const stripe = new Stripe(stripeSecret, {
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
          images: [item.image || "https://moctop.boluwatifedaniel2009.workers.dev/hero.PNG"],
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
