import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    
    // Read from the Cloudflare context directly
    const stripeSecret = (env as any).STRIPE_SECRET_KEY;

    if (!stripeSecret) {
      console.log("CLOUDFLARE ENV MISSING");
      return NextResponse.json({ error: "Key missing" }, { status: 500 });
    }

    // Ensure it's a clean string
    const cleanKey = String(stripeSecret).trim();

    const stripe = new Stripe(cleanKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // ... rest of the code ...
