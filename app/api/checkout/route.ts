import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    // 1. Get the Cloudflare environment context
    const { env } = getCloudflareContext();

    // 2. Read the key directly
    const stripeSecret = (env as any).STRIPE_SECRET_KEY;

    if (!stripeSecret) {
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
    }

    // 3. Ensure it's a clean string
    const cleanKey = String(stripeSecret).trim();

    const stripe = new Stripe(cleanKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId, orderData } = body;

    // 4. Remove images from the payload to prevent Stripe crashes
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

    // 5. Hardcode the URLs
    const baseUrl = "https://moctop.boluwatifedaniel2009.workers.dev";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?order_id=${orderId}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: customerDetails.email,
      metadata: {
        orderId: orderId,
        customerName: orderData.customerName,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        items: JSON.stringify(orderData.items),
        subtotal: orderData.subtotal.toString(),
        deliveryFee: orderData.deliveryFee.toString(),
        discountAmount: orderData.discountAmount.toString(),
        promoCode: orderData.promoCode || "",
        total: orderData.total.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
