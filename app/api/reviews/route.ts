import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { reviews } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

// GET all reviews
export async function GET() {
  const db = getDb();
  const allReviews = await db.select().from(reviews).orderBy(desc(reviews.date));
  return NextResponse.json(allReviews);
}

// POST new review
export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.insert(reviews).values({
    id: `rev-${Date.now()}`,
    productId: body.productId,
    customerName: body.customerName,
    rating: body.rating,
    comment: body.comment,
    approved: 0,
    date: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

// PUT approve/unapprove review
export async function PUT(request: Request) {
  const body = await request.json();
 const db = getDb();
  
  await db.update(reviews)
    .set({ approved: body.approved ? 1 : 0 })
    .where(eq(reviews.id, body.id));

  return NextResponse.json({ success: true });
}

// DELETE review
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const db = getDb();
  await db.delete(reviews).where(eq(reviews.id, id));
  
  return NextResponse.json({ success: true });
}
