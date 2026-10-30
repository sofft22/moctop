import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) return NextResponse.json({ error: "Key missing" }, { status: 500 });

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json();
    const { items, customerDetails, orderId, orderData } = body;

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
      success_url: "https://moctop.boluwatifedaniel2009.workers.dev/success?order_id=" + orderId,
      cancel_url: "https://moctop.boluwatifedaniel2009.workers.dev/checkout",
      customer_email: customerDetails.email,
      // WE PASS EVERYTHING TO STRIPE METADATA HERE
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
