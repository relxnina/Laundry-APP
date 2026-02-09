"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/lib/userOrders";
import { Order } from "@/lib/order";
import { statusLabel, statusStyle } from "@/lib/statusConfig";

export default function HistoryPage() {
  const { authUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    setLoadingOrders(true);

    getUserOrders(authUser.uid)
      .then(setOrders)
      .finally(() => setLoadingOrders(false));
  }, [authUser]);

  return (
    <main className="min-h-screen bg-gray-100 pb-6">
      <section className="px-4 mt-6 space-y-6">
        <h1 className="text-lg font-semibold text-center">
          History
        </h1>

        {loadingOrders && (
          <p className="text-center text-sm text-gray-500 mt-20">
            Loading history...
          </p>
        )}

        {!loadingOrders && orders.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-20">
            Belum ada pesanan
          </p>
        )}

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow p-4">
              <p className="text-sm text-gray-500 mb-2">
                {order.createdAt?.toDate().toLocaleDateString("id-ID")}
              </p>

              <p>👤 {order.name}</p>
              <p>⚖️ {order.weight} Kg</p>
              <p>🧺 {order.serviceLabel ?? order.service}</p>

              <p className="font-semibold">
                💰 Rp {order.totalPrice.toLocaleString("id-ID")}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}
              >
                {statusLabel[order.status]}
              </span>

              {/* Upload bukti hanya muncul di waiting_payment */}
              {order.status === "waiting_payment" && (
                <div className="mt-3 space-y-2">
                  <input type="file" className="text-xs" />
                  <button className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium">
                    Upload Bukti Pembayaran
                  </button>
                </div>
              )}

              {/* Kalau gagal tampilkan note admin */}
              {order.status === "payment_failed" && order.paymentNote && (
                <p className="mt-2 text-red-500 text-xs">
                  ❌ {order.paymentNote}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}