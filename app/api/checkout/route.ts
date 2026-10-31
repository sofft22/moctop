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
    // READ TOTAL DIRECTLY
    const { customerDetails, orderId, total } = body;

    // Safety check: if total is missing, default to 0
    const safeTotal = total || 0;
    const finalAmountInPence = Math.round(safeTotal * 100);

    const lineItems = [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Mocktopia Order",
            description: `Order ID: ${orderId}`,
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
