"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/adminOrders";

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
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const total = orders.length;
  const antri = orders.filter(o => o.status === "Antri").length;
  const proses = orders.filter(o => o.status === "Dikerjakan").length;
  const selesai = orders.filter(o => o.status === "Selesai").length;

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

      {/* STAT CARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat title="Total Order" value={total} />
        <Stat title="Antri" value={antri} />
        <Stat title="Diproses" value={proses} />
        <Stat title="Selesai" value={selesai} />
      </div>

      {/* LIST ORDER */}
      <section className="bg-white rounded-xl shadow">
        <div className="px-5 py-4 border-b font-semibold">
          Daftar Order
        </div>

        {loading ? (
          <p className="p-5 text-sm text-gray-500">Loading order...</p>
        ) : orders.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">Belum ada order</p>
        ) : (
          <div className="divide-y">
            {orders.map(order => (
              <div
                key={order.id}
                className="px-5 py-4 flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium">
                    {order.serviceName ?? "Service"}
                  </p>
                  <p className="text-gray-500">
                    {order.userName ?? "User"}
                  </p>
                </div>

                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
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
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}