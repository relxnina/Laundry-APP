"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  listenOrdersByStatus,
} from "@/lib/adminOrders";
import type { Order, OrderStatus } from "@/lib/order";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export default function StatusPage() {
  const { status } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!status) return;

    const unsubscribe = listenOrdersByStatus(
      status as OrderStatus,
      data => {
        setOrders(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [status]);

  function formatDate(order: Order) {
    if (!order.createdAt?.seconds) return "-";
    return new Date(order.createdAt.seconds * 1000)
      .toLocaleString("id-ID");
  }

  const prettyStatus =
    typeof status === "string"
      ? status.replaceAll("_", " ")
      : status;

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white p-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        Orders — {prettyStatus}
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading orders...</p>
      ) : (
        <div className="bg-[#151520] rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr
                  key={order.id}
                  className="border-t border-white/5"
                >
                  <td className="p-4">{order.name}</td>
                  <td className="p-4">{order.phone}</td>
                  <td className="p-4">
                    Rp {(order.totalPrice || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">{formatDate(order)}</td>

                  <td className="p-4">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-400"
                  >
                    No orders in this status
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}