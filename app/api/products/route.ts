import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Tell Next.js to cache the GET request at the edge
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const db = getDb();
  const allProducts = await db.select().from(products);
  return NextResponse.json(allProducts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.insert(products).values({
    id: `p-${Date.now()}`,
    title: body.title,
    price: body.price,
    description: body.description,
    category: body.category,
    image: body.image,
    sizes: JSON.stringify(body.sizes),
    inStock: body.inStock ? 1 : 0,
    featured: body.featured ? 1 : 0,
    isBulk: body.isBulk ? 1 : 0,
  });

  // FORCE THE CACHE TO CLEAR INSTANTLY
  revalidatePath("/", "layout");
  revalidatePath("/shop", "layout");

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const db = getDb();
  
  await db.update(products)
    .set({
      title: body.title,
      price: body.price,
      description: body.description,
      category: body.category,
      image: body.image,
      sizes: JSON.stringify(body.sizes),
      inStock: body.inStock ? 1 : 0,
      featured: body.featured ? 1 : 0,
      isBulk: body.isBulk ? 1 : 0,
    })
    .where(eq(products.id, body.id));

  revalidatePath("/", "layout");
  revalidatePath("/shop", "layout");

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const db = getDb();
  await db.delete(products).where(eq(products.id, id));
  
  revalidatePath("/", "layout");
  revalidatePath("/shop", "layout");

  return NextResponse.json({ success: true });
}
