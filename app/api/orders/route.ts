import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { orders, promos, promoUsage } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

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
    state: body.state,
    items: JSON.stringify(body.items),
    subtotal: body.subtotal,
    deliveryFee: body.deliveryFee,
    discountAmount: body.discountAmount || 0,
    promoCode: body.promoCode || null,
    total: body.total,
    paymentMethod: body.paymentMethod,
    status: "Pending",
    date: new Date().toISOString(),
  });

  // If a promo was used, log the usage and increment the count
  if (body.promoCode) {
    const promo = await db.select().from(promos).where(eq(promos.code, body.promoCode)).then(res => res[0]);
    if (promo) {
      await db.update(promos)
        .set({ currentUses: sql`${promos.currentUses} + 1` })
        .where(eq(promos.id, promo.id));
        
      await db.insert(promoUsage).values({
        id: `usage-${Date.now()}`,
        promoId: promo.id,
        phone: body.phone,
        date: new Date().toISOString(),
      });
    }
  }

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
