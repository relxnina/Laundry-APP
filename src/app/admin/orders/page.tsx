"use client";

import { useEffect, useMemo, useState } from "react";
import { listenAllOrders } from "@/lib/adminOrders";
import type { Order, OrderStatus } from "@/lib/order";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  useEffect(() => {
    const unsubscribe = listenAllOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch =
        order.name.toLowerCase().includes(search.toLowerCase()) ||
        order.phone?.includes(search);

      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );
  }, [filteredOrders]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">All Orders</h1>

      {/* SUMMARY */}
      <div className="bg-[#151520] p-6 rounded-2xl border border-white/10">
        <p className="text-gray-400 text-sm">Total Orders</p>
        <p className="text-2xl font-bold">{filteredOrders.length}</p>

        <p className="text-gray-400 text-sm mt-4">Total Revenue</p>
        <p className="text-2xl font-bold">
          Rp {totalRevenue.toLocaleString()}
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search name / phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#151520] border border-white/10 w-64"
        />

        <select
          value={statusFilter}
          onChange={e =>
            setStatusFilter(e.target.value as any)
          }
          className="px-4 py-2 rounded-lg bg-[#151520] border border-white/10"
          aria-label="Filter orders by status"
        >
          <option value="all">All Status</option>
          <option value="queued">Queued</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="bg-[#151520] p-6 rounded-2xl border border-white/10"
          >
            <div className="mb-3">
              <p className="font-semibold text-lg">
                {order.serviceLabel ?? order.service}
              </p>
              <p className="text-sm text-gray-400">
                {order.name}
              </p>
              {order.phone && (
                <p className="text-xs text-gray-500">
                  📞 {order.phone}
                </p>
              )}
              {order.address && (
                <p className="text-xs text-gray-500">
                  📍 {order.address}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-300 space-y-1 mb-3">
              <p>Weight: {order.weight} kg</p>
              <p>Total: Rp {order.totalPrice.toLocaleString()}</p>
              <p>
                Created:{" "}
                {order.createdAt?.toDate?.().toLocaleString?.() ?? "-"}
              </p>
            </div>

            {order.paymentProofUrl && (
              <a
                href={order.paymentProofUrl}
                target="_blank"
                className="text-xs text-blue-400 underline"
              >
                View Payment Proof
              </a>
            )}

            <div className="mt-4">
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
          </div>
        ))}
      </div>
    </div>
  );
}