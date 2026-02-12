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
    <main className="min-h-screen bg-[#0b0b12] text-white relative overflow-hidden p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Pantau dan kelola semua order laundry
          </p>
        </header>

  <section className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12 p-6 rounded-3xl bg-[#151520] border border-white/10 shadow-[8px_8px_0px_#000000]">
    <Stat title="Total Order" value={total} gradient="from-purple-500 to-pink-500" />
    <Stat title="Queued" value={queued} gradient="from-yellow-400 to-orange-400" />
    <Stat title="Processing" value={processing} gradient="from-blue-400 to-cyan-400" />
    <Stat title="Waiting Payment" value={waitingPayment} gradient="from-indigo-400 to-purple-400" />
    <Stat title="Paid" value={paid} gradient="from-green-400 to-emerald-400" />
  </section>

    <section className="bg-[#151520] rounded-3xl border border-white/10 overflow-hidden shadow-[8px_8px_0px_#000000]">
  <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
    <h2 className="text-lg font-semibold text-white">Daftar Order</h2>
    <span className="text-xs text-gray-400">
      {orders.length} order
    </span>
  </div>

    {loading ? (
      <div className="p-8 text-gray-400 text-sm">
        Loading order...
      </div>
    ) : orders.length === 0 ? (
      <div className="p-8 text-gray-400 text-sm">
        Belum ada order masuk 👀
      </div>
    ) : (
      <div className="max-h-[65vh] overflow-y-auto divide-y divide-white/10">
        {orders.map(order => (
          <div
            key={order.id}
            className="px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-all duration-200"
          >
            <div>
              <p className="font-semibold text-white">
                {order.serviceLabel ?? order.service}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {order.name ?? "Customer"}
              </p>

              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                {statusLabel[order.status]}
              </span>
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

      </div>
    </main>
  );
}

function Stat({
  title,
  value,
  gradient,
}: {
  title: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="bg-[#151520] rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
      <p className="text-xs uppercase tracking-wider text-gray-400">
        {title}
      </p>

      <p className={`text-4xl font-bold mt-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  );
}