// lib/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Find the products table in lib/schema.ts and update it:
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  image: text("image").notNull(),
  inStock: integer("inStock").default(1),
  sizes: text("sizes").notNull(),
  featured: integer("featured").default(0), // 1 = Show on Home, 0 = Hide
  isBulk: integer("isBulk").default(0),     // 1 = Bulk Order Form, 0 = Normal Cart
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  customerName: text("customerName").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  items: text("items").notNull(),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("deliveryFee").notNull(),
  total: integer("total").notNull(),
  paymentMethod: text("paymentMethod").notNull(),
  status: text("status").default("Pending"),
  date: text("date").notNull(),
});

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  productId: text("productId").notNull(),
  customerName: text("customerName").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  approved: integer("approved").default(0),
  date: text("date").notNull(),
});

// lib/schema.ts
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey(),
  deliveryFee: integer("deliveryFee").default(0), // We'll keep this as a fallback
  deliveryZones: text("deliveryZones"), // NEW: Will store a JSON string like '[{"name":"London","price":5}]'
  whatsappNumber: text("whatsappNumber"),
  bankName: text("bankName"),
  accountName: text("accountName"),
  accountNumber: text("accountNumber"),
});

export const content = sqliteTable("content", {
  id: integer("id").primaryKey(),
  heroImage: text("heroImage"),
  heroHeadline: text("heroHeadline"),
  aboutText: text("aboutText"),
  catBanana: text("catBanana"),
  catPuff: text("catPuff"),
  catMocktail: text("catMocktail"),
});