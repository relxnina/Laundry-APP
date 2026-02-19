"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllOrders } from "@/lib/adminOrders";
import type { Order, OrderStatus } from "@/lib/order";

export default function AdminDashboard() {
  const router = useRouter();

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [todayReceived, setTodayReceived] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [revenueData, setRevenueData] = useState<
    { label: string; value: number }[]
  >([]);

  const statuses: { label: string; key: OrderStatus; gradient: string }[] = [
    { label: "Queued", key: "queued", gradient: "from-yellow-400 to-orange-400" },
    { label: "Processing", key: "processing", gradient: "from-blue-400 to-cyan-400" },
    { label: "Waiting Payment", key: "waiting_payment", gradient: "from-indigo-400 to-purple-400" },
    { label: "Payment Review", key: "payment_review", gradient: "from-pink-400 to-rose-400" },
    { label: "Paid", key: "paid", gradient: "from-green-400 to-emerald-400" },
    { label: "Payment Failed", key: "payment_failed", gradient: "from-red-400 to-orange-500" },
  ];

  useEffect(() => {
    const load = async () => {
      const orders = await getAllOrders();

      // count by status
      const result: Record<string, number> = {};
      statuses.forEach(s => {
        result[s.key] = orders.filter(o => o.status === s.key).length;
      });
      setCounts(result);

      calculateToday(orders);
      calculateRevenue(orders);
    };

    load();
  }, []);

  function getDate(order: Order) {
    if (!order.createdAt?.seconds) return null;
    return new Date(order.createdAt.seconds * 1000);
  }

  function calculateToday(orders: Order[]) {
    const todayStr = new Date().toDateString();

    const todayOrders = orders.filter(o => {
      const date = getDate(o);
      return date && date.toDateString() === todayStr;
    });

    setTodayReceived(todayOrders.length);

    const completed = todayOrders.filter(o => o.status === "paid");
    setTodayCompleted(completed.length);
  }

  function calculateRevenue(orders: Order[]) {
    const now = new Date();

    const ranges = [
      { label: "1 Day", days: 1 },
      { label: "1 Week", days: 7 },
      { label: "2 Weeks", days: 14 },
      { label: "3 Weeks", days: 21 },
      { label: "4 Weeks", days: 28 },
    ];

    const data = ranges.map(r => {
      const start = new Date();
      start.setDate(now.getDate() - r.days);

      const total = orders
        .filter(o => {
          const date = getDate(o);
          return date && date >= start && o.status === "paid";
        })
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      return { label: r.label, value: total };
    });

    setRevenueData(data);
  }

  const maxRevenue =
    revenueData.length > 0
      ? Math.max(...revenueData.map(r => r.value))
      : 1;

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Dashboard
          </h1>

          {/* STATUS CARDS */}
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
            {statuses.map(stat => (
              <Stat
                key={stat.key}
                title={stat.label}
                value={counts[stat.key] ?? 0}
                gradient={stat.gradient}
                onClick={() => router.push(`/admin/status/${stat.key}`)}
              />
            ))}
          </section>

          {/* CHART SECTION */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card title="Orders Performance (Today)">
              <ChartBar
                label="Orders Received"
                value={todayReceived}
                max={todayReceived + 5 || 5}
                gradient="from-blue-400 to-cyan-400"
              />
              <ChartBar
                label="Orders Completed"
                value={todayCompleted}
                max={todayReceived + 5 || 5}
                gradient="from-green-400 to-emerald-400"
              />
            </Card>

            <Card title="Revenue Overview">
              {revenueData.map(item => (
                <ChartBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={maxRevenue}
                  gradient="from-purple-400 to-pink-500"
                  formatCurrency
                />
              ))}
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Sidebar() {
  return (
    <aside className="w-64 bg-[#11111a] border-r border-white/10 p-6 hidden md:flex flex-col">
      <div className="text-xl font-bold mb-10 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Laundry Admin
      </div>

      <nav className="space-y-3 text-sm">
        <NavItem label="Dashboard" active />
        <NavItem label="Orders" />
        <NavItem label="Users" />
        <NavItem label="Reports" />
        <NavItem label="Settings" />
      </nav>
    </aside>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`px-4 py-2 rounded-xl cursor-pointer transition ${
        active
          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </div>
  );
}

function Topbar() {
  return (
    <div className="h-16 border-b border-white/10 px-8 flex items-center justify-end bg-[#0f0f17]">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
    </div>
  );
}

function Stat({
  title,
  value,
  gradient,
  onClick,
}: {
  title: string;
  value: number;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-[#151520] p-6 rounded-3xl border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
    >
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        {title}
      </p>
      <p className={`text-4xl font-bold mt-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-[#151520] rounded-3xl border border-white/10 p-8 space-y-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function ChartBar({
  label,
  value,
  max,
  gradient,
  formatCurrency,
}: any) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold">
          {formatCurrency
            ? `Rp ${value.toLocaleString("id-ID")}`
            : value}
        </span>
      </div>

      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} origin-left`}
          style={{ transform: `scaleX(${percentage / 100})` }}
        />
      </div>
    </div>
  );
}
