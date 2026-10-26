import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { promos } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  const db = getDb();
  const allPromos = await db.select().from(promos);
  return NextResponse.json(allPromos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.insert(promos).values({
    id: `promo-${Date.now()}`,
    code: body.code.toUpperCase(),
    type: body.type,
    value: body.value,
    minSpend: body.minSpend || 0,
    maxUses: body.maxUses || 0,
    expiresAt: body.expiresAt || null,
    isActive: 1,
  });

  revalidatePath("/admin/promos");
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const db = getDb();
  await db.delete(promos).where(eq(promos.id, id));
  
  revalidatePath("/admin/promos");
  return NextResponse.json({ success: true });
}
