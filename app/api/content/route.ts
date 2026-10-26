import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { content } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET content
export async function GET() {
  const db = getDb(process.env);
  const result = await db.select().from(content).where(eq(content.id, 1));
  return NextResponse.json(result[0] || {});
}

// POST update content
export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb(process.env);
  
  await db.update(content)
    .set({
      heroImage: body.heroImage,
      heroHeadline: body.heroHeadline,
      aboutText: body.aboutText,
      catBanana: body.catBanana,
      catPuff: body.catPuff,
      catMocktail: body.catMocktail,
    })
    .where(eq(content.id, 1));

  return NextResponse.json({ success: true });
}