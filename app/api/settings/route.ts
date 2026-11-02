import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";

// 1. FORCE NEXT.JS TO NEVER CACHE THIS API ROUTE
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const result = await db.select().from(settings).where(eq(settings.id, 1));
  
  // 2. TELL BROWSER AND CLOUDFLARE NOT TO CACHE THE RESPONSE
  return NextResponse.json(result[0] || {}, {
    headers: {
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.update(settings)
    .set({
      deliveryZones: body.deliveryZones,
      bannerText: body.bannerText,
      bannerActive: body.bannerActive,
      boxBuilderConfig: body.boxBuilderConfig, 
    })
    .where(eq(settings.id, 1));

  return NextResponse.json({ success: true });
}
