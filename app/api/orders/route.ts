import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

// GET all orders (Admin & My Orders page)
export async function GET() {
  const db = getDb();
  const allOrders = await db.select().from(orders).orderBy(desc(orders.date));
  return NextResponse.json(allOrders);
}

// POST new order (from Checkout)
export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.insert(orders).values({
    id: body.orderId,
    customerName: body.customerName,
    phone: body.phone,
    address: body.address,
    city: body.city,
    state: body.state,
    items: JSON.stringify(body.items),
    subtotal: body.subtotal,
    deliveryFee: body.deliveryFee,
    total: body.total,
    paymentMethod: body.paymentMethod,
    status: "Pending",
    date: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

// PUT update order status (from Admin)
export async function PUT(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.update(orders)
    .set({ status: body.status })
    .where(eq(orders.id, body.orderId));

  return NextResponse.json({ success: true });
}
