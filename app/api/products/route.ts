import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const db = getDb();
  
  const allProducts = await db.select({
    id: products.id,
    title: products.title,
    price: products.price,
    category: products.category,
    image: products.image,
    inStock: products.inStock,
    sizes: products.sizes,
    featured: products.featured,
    isBulk: products.isBulk,
    weight: products.weight, // <-- NEW: Fetch weight
  }).from(products);

  return NextResponse.json(allProducts, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
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
    images: JSON.stringify(body.images),
    sizes: JSON.stringify(body.sizes),
    inStock: body.inStock ? 1 : 0,
    featured: body.featured ? 1 : 0,
    isBulk: body.isBulk ? 1 : 0,
    weight: body.weight || 0, // <-- NEW: Save weight
  });

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
      images: JSON.stringify(body.images),
      sizes: JSON.stringify(body.sizes),
      inStock: body.inStock ? 1 : 0,
      featured: body.featured ? 1 : 0,
      isBulk: body.isBulk ? 1 : 0,
      weight: body.weight || 0, // <-- NEW: Update weight
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
