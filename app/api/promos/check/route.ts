import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { promos, promoUsage } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const { code, phone } = await request.json();
  const db = getDb();

  const promo = await db.select().from(promos).where(eq(promos.code, code.toUpperCase())).then(res => res[0]);

  if (!promo) return NextResponse.json({ error: "Invalid promo code." }, { status: 400 });
  if (promo.isActive === 0) return NextResponse.json({ error: "This promo code is no longer active." }, { status: 400 });
  
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return NextResponse.json({ error: "This promo code has expired." }, { status: 400 });
  }
  
  // Fixed: Added fallback || 0 to prevent TypeScript null errors
  if ((promo.maxUses || 0) > 0 && (promo.currentUses || 0) >= (promo.maxUses || 0)) {
    return NextResponse.json({ error: "This promo code has reached its usage limit." }, { status: 400 });
  }

  if (phone) {
    const usage = await db.select().from(promoUsage).where(
      and(eq(promoUsage.promoId, promo.id), eq(promoUsage.phone, phone))
    ).then(res => res[0]);

    if (usage) return NextResponse.json({ error: "You have already used this promo code." }, { status: 400 });
  }

  return NextResponse.json({ success: true, promo });
}
