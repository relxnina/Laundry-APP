"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/adminOrders";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

type Order = {
  id: string;
  userName?: string;
  serviceName?: string;
  status: string;
  createdAt?: any;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAllOrders();
      setOrders(data as Order[]);
      setLoading(false);
    };

    load();
  }, []);

  const total = orders.length;
  const antri = orders.filter(o => o.status === "Antri").length;
  const proses = orders.filter(o => o.status === "Dikerjakan").length;
  const selesai = orders.filter(o => o.status === "Selesai").length;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Pantau dan kelola semua order laundry
        </p>
      </header>

      {/* STAT */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat title="Total Order" value={total} />
        <Stat title="Antri" value={antri} accent="yellow" />
        <Stat title="Diproses" value={proses} accent="blue" />
        <Stat title="Selesai" value={selesai} accent="green" />
      </section>

      {/* ORDER LIST */}
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Daftar Order</h2>
          <span className="text-xs text-gray-500">
            {orders.length} order
          </span>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">
            Loading order...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            Belum ada order masuk 👀
          </div>
        ) : (
          <div className="max-h-[65vh] overflow-y-auto divide-y">
            {orders.map(order => (
              <div
                key={order.id}
                className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
              >
                <div>
                  <p className="font-medium">
                    {order.serviceName ?? "Service Laundry"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.userName ?? "Customer"}
                  </p>
                </div>

                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                  onUpdated={(newStatus) => {
                    setOrders(prev =>
                      prev.map(o =>
                        o.id === order.id
                          ? { ...o, status: newStatus }
                          : o
                      )
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ===== COMPONENTS ===== */

function Stat({
  title,
  value,
  accent = "gray",
}: {
  title: string;
  value: number;
  accent?: "gray" | "yellow" | "blue" | "green";
}) {
  const accentMap: Record<string, string> = {
    gray: "text-gray-700",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${accentMap[accent]}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Antri: "bg-yellow-100 text-yellow-700",
    Dikerjakan: "bg-blue-100 text-blue-700",
    Selesai: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-xs font-medium ${
        map[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}