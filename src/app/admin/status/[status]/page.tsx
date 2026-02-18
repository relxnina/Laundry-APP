"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrdersByStatus } from "@/lib/adminOrders";
import type { Order, OrderStatus } from "@/lib/order";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export default function StatusPage() {
  const { status } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!status) return;

    getOrdersByStatus(status as OrderStatus)
      .then(setOrders);
  }, [status]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Status: {status}
      </h1>

      {orders.map(order => (
        <div
          key={order.id}
          className="bg-[#151520] p-6 mb-4 rounded-2xl border border-white/10"
        >
          <p className="font-semibold">{order.name}</p>

          <p className="text-xs text-gray-400">
            {order.phone}
          </p>

          <p className="text-xs text-gray-500">
            Rp {order.totalPrice.toLocaleString()}
          </p>

          <OrderStatusSelect
            orderId={order.id}
            currentStatus={order.status}
            onUpdated={() => {
              setOrders(prev =>
                prev.filter(o => o.id !== order.id)
              );
            }}
          />
        </div>
      ))}
    </div>
  );
}