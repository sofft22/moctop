// app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const db = getDb();
  const result = await db.select().from(settings).where(eq(settings.id, 1));
  return NextResponse.json(result[0] || {});
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.update(settings)
    .set({
      deliveryZones: body.deliveryZones !== undefined ? body.deliveryZones : undefined,
      bannerText: body.bannerText !== undefined ? body.bannerText : undefined,
      bannerActive: body.bannerActive !== undefined ? body.bannerActive : undefined,
    })
    .where(eq(settings.id, 1));

  return NextResponse.json({ success: true });
}
