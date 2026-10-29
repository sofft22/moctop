import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();

    // FIX: Cast env as 'any' to bypass strict type checking
    const stripeSecret = (env as any).STRIPE_SECRET_KEY;

    if (!stripeSecret) {
      console.error("STRIPE_SECRET_KEY is missing in Cloudflare env");
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret as string, {
      apiVersion: "2024-06-20",
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
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Also cast env for the base URL
    const baseUrl = (env as any).NEXT_PUBLIC_BASE_URL || "https://moctop.boluwatifedaniel2009.workers.dev";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/order/${orderId}`,
      cancel_url: `${baseUrl}/checkout`,
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
