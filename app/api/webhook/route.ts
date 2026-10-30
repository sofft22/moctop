import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/schema";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  // You must get this webhook secret from your Stripe Dashboard later
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const metadata = session.metadata;

    // Save the order to your database
    try {
      const db = getDb();
      await db.insert(orders).values({
        id: metadata.orderId,
        customerName: metadata.customerName,
        phone: metadata.phone,
        address: metadata.address,
        city: metadata.city,
        items: metadata.items, // JSON string of items
        subtotal: Number(metadata.subtotal),
        deliveryFee: Number(metadata.deliveryFee),
        discountAmount: Number(metadata.discountAmount),
        promoCode: metadata.promoCode || null,
        total: Number(metadata.total),
        paymentMethod: "Stripe",
        status: "Pending",
        date: new Date().toISOString(),
      });
      console.log("Order saved to database successfully!");
    } catch (error) {
      console.error("Failed to save order to DB:", error);
    }
  }

  return NextResponse.json({ received: true });
}
