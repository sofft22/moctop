import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    // 1. Initialize Stripe INSIDE the function, not at the top of the file
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-04-10",
      // 2. This is REQUIRED for Cloudflare Workers
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId } = body;

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.title,
          images: [item.image],
          description: `Size: ${item.size}`,
        },
        unit_amount: Math.round(item.price * 100), // Amount in pence
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
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
