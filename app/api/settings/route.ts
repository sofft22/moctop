// app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const db = getDb(process.env);
  const result = await db.select().from(settings).where(eq(settings.id, 1));
  return NextResponse.json(result[0] || {});
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb(process.env);
  
  await db.update(settings)
    .set({
      deliveryFee: body.deliveryFee,
      deliveryZones: body.deliveryZones, // NEW
      whatsappNumber: body.whatsappNumber,
      bankName: body.bankName,
      accountName: body.accountName,
      accountNumber: body.accountNumber,
    })
    .where(eq(settings.id, 1));

  return NextResponse.json({ success: true });
}