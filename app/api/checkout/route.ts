import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecret) {
      return NextResponse.json({ error: "Key missing" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId } = body;

    const lineItems = items.map((item: any) => {
      // Completely remove images from the Stripe payload
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.title || "Mocktopia Treat",
            description: item.size ? `Size: ${item.size}` : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty || 1,
      };
    });

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
