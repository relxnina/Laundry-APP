"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/adminOrders";
import type { Order } from "@/lib/order";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAllOrders();
      setOrders(data);
      setLoading(false);
    };

    load();
  }, []);

  const total = orders.length;
  const queued = orders.filter(o => o.status === "queued").length;
  const processing = orders.filter(o => o.status === "processing").length;
  const waitingPayment = orders.filter(o => o.status === "waiting_payment").length;
  const paid = orders.filter(o => o.status === "paid").length;


  const statusLabel: Record<string, string> = {
    queued: "Antri",
    processing: "Dikerjakan",
    waiting_payment: "Menunggu Pembayaran",
    paid: "Selesai",
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Pantau dan kelola semua order laundry
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat title="Total Order" value={total} />
        <Stat title="Queued" value={queued} accent="yellow" />
        <Stat title="Processing" value={processing} accent="blue" />
        <Stat title="Waiting Payment" value={waitingPayment} accent="gray" />
        <Stat title="Paid" value={paid} accent="green" />
      </section>

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
                className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium">
                    {order.serviceLabel ?? order.service}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.name ?? "Customer"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {statusLabel[order.status]}
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