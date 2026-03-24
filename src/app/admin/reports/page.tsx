"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/adminOrders";
import type { Order } from "@/lib/order";

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topServices, setTopServices] = useState<
    { name: string; count: number }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllOrders();
      setOrders(data);
      calculate(data);
    };

    load();
  }, []);

  function calculate(data: Order[]) {
    const paidOrders = data.filter(o => o.status === "paid");

    const totalRevenue = paidOrders.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    );

    setRevenue(totalRevenue);
    setTotalOrders(data.length);

    const serviceMap: Record<string, number> = {};

    data.forEach(o => {
      if (!o.service) return;
      serviceMap[o.service] = (serviceMap[o.service] || 0) + 1;
    });

    const sorted = Object.entries(serviceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopServices(sorted);
  }

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Revenue">
          <p className="text-3xl font-bold text-green-400">
            Rp {revenue.toLocaleString("id-ID")}
          </p>
        </Card>

        <Card title="Total Orders">
          <p className="text-3xl font-bold text-blue-400">
            {totalOrders}
          </p>
        </Card>

        <Card title="Paid Orders">
          <p className="text-3xl font-bold text-purple-400">
            {orders.filter(o => o.status === "paid").length}
          </p>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Top Services">
          <div className="space-y-4">
            {topServices.map(s => (
              <div key={s.name} className="flex justify-between text-sm">
                <span className="text-gray-300">{s.name}</span>
                <span className="font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Revenue (Last 7 Days)">
          <div className="space-y-4">
            {generateLast7Days(orders).map(d => (
              <Bar
                key={d.label}
                label={d.label}
                value={d.value}
                max={1000000}
              />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function generateLast7Days(orders: Order[]) {
  const days: { label: string; value: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const label = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    const total = orders
      .filter(o => {
        if (!o.createdAt?.seconds) return false;
        const d = new Date(o.createdAt.seconds * 1000);
        return (
          d.toDateString() === date.toDateString() &&
          o.status === "paid"
        );
      })
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    days.push({ label, value: total });
  }

  return days;
}

function Card({ title, children }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
      <h2 className="text-sm text-gray-400">{title}</h2>
      {children}
    </div>
  );
}

function Bar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>Rp {value.toLocaleString("id-ID")}</span>
      </div>

      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}