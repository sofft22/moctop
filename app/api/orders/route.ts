import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const db = getDb();
  const allOrders = await db.select().from(orders).orderBy(desc(orders.date));
  return NextResponse.json(allOrders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.insert(orders).values({
    id: body.orderId,
    customerName: body.customerName,
    phone: body.phone,
    address: body.address,
    city: body.city,
    items: JSON.stringify(body.items),
    subtotal: body.subtotal,
    deliveryFee: body.deliveryFee,
    discountAmount: body.discountAmount || 0,
    promoCode: body.promoCode || null,
    processingFee: body.processingFee || 0, // SAVES THE PROCESSING FEE
    total: body.total,
    paymentMethod: body.paymentMethod,
    status: "Pending",
    date: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.update(orders)
    .set({ status: body.status })
    .where(eq(orders.id, body.orderId));

  return NextResponse.json({ success: true });
}
