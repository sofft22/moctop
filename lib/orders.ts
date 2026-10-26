// lib/orders.ts

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  size: string;
  image: string;
}

export interface Order {
  orderId: string;
  date: string;
  status: "Pending" | "In the Oven" | "Out for Delivery" | "Delivered";
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  // REMOVED token
}

const STORAGE_KEY = "mocktopia_orders";

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return;
  const existing = getOrders();
  const updated = [order, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}