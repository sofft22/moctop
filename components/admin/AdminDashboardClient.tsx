"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenuePoint {
  date: string;
  revenue: number;
}

export function AdminDashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    outOfStock: 0,
    activePromos: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);

  useEffect(() => {
    // 1. Auth Check
    if (typeof window !== "undefined" && localStorage.getItem("mocktopia_admin_logged_in") !== "true") {
      router.push("/admin/login");
      return;
    }

    // 2. Fetch Real Data from APIs
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, promosRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
          fetch("/api/promos")
        ]);

        const orders = await ordersRes.json();
        const products = await productsRes.json();
        const promos = await promosRes.json();

        // 3. Calculate Stats
        const totalRev = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const pendingOrders = orders.filter((o: any) => o.status === "Pending").length;
        const outOfStock = products.filter((p: any) => p.inStock === 0).length;
        const activePromos = promos.filter((p: any) => p.isActive === 1).length;

        setStats({
          revenue: totalRev,
          orders: orders.length,
          pendingOrders,
          outOfStock,
          activePromos,
        });

        // 4. Recent Orders (Top 5)
        // Sort by date descending just in case
        const sortedOrders = [...orders].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentOrders(sortedOrders.slice(0, 5));

        // 5. Build Chart Data (Last 30 days)
        const byDay: Record<string, number> = {};
        orders.forEach((o: any) => {
          const day = new Date(o.date).toISOString().slice(0, 10);
          byDay[day] = (byDay[day] ?? 0) + o.total;
        });

        const chartData: RevenuePoint[] = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          chartData.push({ date: key, revenue: byDay[key] ?? 0 });
        }

        setRevenueData(chartData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF9F5]">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#2C1A1D]/20 border-t-[#2C1A1D]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 min-h-screen bg-[#FBF9F5]">
      
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Mocktopia Admin
        </p>
        <h1 className="mt-1 text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
          Dashboard
        </h1>
        <p className="mt-2 text-[13px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Here is what is happening with your store today.
        </p>
      </div>

      {/* TOP STATS ROW */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        
        {/* Main Revenue Card */}
        <div className="relative overflow-hidden rounded-xl bg-[#2C1A1D] p-6 text-[#FBF9F5] shadow-sm lg:col-span-2">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Total Revenue
          </p>
          <p className="mt-3 text-[38px] font-semibold leading-none" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            £{stats.revenue.toLocaleString()}
          </p>
          <p className="mt-4 text-[13px] text-[#FBF9F5]/80" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            From {stats.orders} total orders
          </p>
        </div>

        {/* Pending Orders Card */}
        <button 
          onClick={() => router.push("/admin/orders")}
          className={`rounded-xl border p-6 text-left transition-colors ${stats.pendingOrders > 0 ? "border-[#2C1A1D]/30 bg-white shadow-sm hover:border-[#2C1A1D]" : "border-[#2C1A1D]/10 bg-[#FBF9F5]"}`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${stats.pendingOrders > 0 ? "text-[#2C1A1D]" : "text-[#2C1A1D]/40"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Pending Orders
          </p>
          <p className={`mt-3 text-[34px] font-semibold leading-none ${stats.pendingOrders > 0 ? "text-[#2C1A1D]" : "text-[#2C1A1D]/20"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {stats.pendingOrders}
          </p>
          {stats.pendingOrders > 0 && <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]">Needs attention →</p>}
        </button>

        {/* Active Promos Card */}
        <button 
          onClick={() => router.push("/admin/promos")}
          className={`rounded-xl border p-6 text-left transition-colors ${stats.activePromos > 0 ? "border-[#2C1A1D]/30 bg-white shadow-sm hover:border-[#2C1A1D]" : "border-[#2C1A1D]/10 bg-[#FBF9F5]"}`}
        >
          <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${stats.activePromos > 0 ? "text-[#2C1A1D]" : "text-[#2C1A1D]/40"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Active Promos
          </p>
          <p className={`mt-3 text-[34px] font-semibold leading-none ${stats.activePromos > 0 ? "text-[#2C1A1D]" : "text-[#2C1A1D]/20"}`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {stats.activePromos}
          </p>
          {stats.activePromos > 0 && <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-[#2C1A1D]">View Promos →</p>}
        </button>
      </div>

      {/* OUT OF STOCK NOTIFICATION */}
      <div className="mb-6 rounded-xl border border-[#2C1A1D]/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Out of Stock</span>
            <span className="text-[15px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{stats.outOfStock}</span>
          </div>
          <button onClick={() => router.push("/admin/products")} className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D] hover:underline" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Manage →
          </button>
        </div>
      </div>

      {/* CHART */}
      <div className="mb-6 rounded-xl border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-[16px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Sales Performance (Last 30 Days)
        </h2>
        
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: "#888" }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "#888" }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(v) => v >= 1000 ? `£${v/1000}k` : `£${v}`}
              />
              <Tooltip 
                contentStyle={{ background: "#2C1A1D", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px" }}
                formatter={(value: any) => [`£${value.toLocaleString()}`, "Revenue"]}
                labelFormatter={(label: any) => new Date(label).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2C1A1D" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: "#2C1A1D", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="rounded-xl border border-[#2C1A1D]/10 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-[16px] font-semibold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Recent Orders
          </h2>
          <button onClick={() => router.push("/admin/orders")} className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D] hover:underline" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            View All →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            No orders yet. Your first sale will show up here.
          </div>
        ) : (
          <ul className="flex flex-col border-t border-[#2C1A1D]/5">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <button 
                  onClick={() => router.push("/admin/orders")}
                  className="flex w-full items-center justify-between gap-4 border-b border-[#2C1A1D]/5 py-4 text-left last:border-0 hover:bg-[#FBF9F5] px-2 transition-colors"
                >
                  <div>
                    <p className="text-[13px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{o.id}</p>
                    <p className="mt-0.5 text-[12px] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      {o.customerName} · {new Date(o.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-bold text-[#2C1A1D]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      £{o.total.toLocaleString()}
                    </span>
                    <span className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                      o.status === "Delivered" ? "bg-green-100 text-green-700" : 
                      o.status === "Shipping" ? "bg-blue-100 text-blue-700" :
                      "bg-[#EBE0D3] text-[#2C1A1D]"
                    }`} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      {o.status || "Pending"}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
