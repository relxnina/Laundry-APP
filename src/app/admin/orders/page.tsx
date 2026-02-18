"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/adminOrders";
import type { Order } from "@/lib/order";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getAllOrders().then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Orders</h1>

      {orders.map(order => (
        <div
          key={order.id}
          className="bg-[#151520] p-6 mb-6 rounded-2xl border border-white/10"
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
              {order.createdAt?.toDate().toLocaleString()}
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
  );
}