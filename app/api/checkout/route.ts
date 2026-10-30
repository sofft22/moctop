import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    // We use the new variable name here
    const stripeSecret = process.env.STRIPE_API_KEY;

    if (!stripeSecret) {
      console.error("STRIPE_API_KEY is missing");
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
    }

    // Ensure no weird characters or spaces
    const cleanStripeKey = stripeSecret.trim();

    const stripe = new Stripe(cleanStripeKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId } = body;

    const lineItems = items.map((item: any) => {
      const productName = item.title && item.title.trim() !== "" ? item.title : "Mocktopia Treat";
      const productImages = (item.image && item.image.trim() !== "") 
        ? [item.image] 
        : ["https://moctop.boluwatifedaniel2009.workers.dev/hero.PNG"];

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: productName,
            images: productImages,
            description: item.size ? `Size: ${item.size}` : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty || 1,
      };
    });

    const baseUrl = "https://moctop.boluwatifedaniel2009.workers.dev";

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
