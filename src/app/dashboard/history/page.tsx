"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/lib/userOrders";

/* =======================
   TYPES
======================= */

type OrderStatus =
  | "pending"
  | "processing"
  | "done"
  | "waiting_payment";

type Order = {
  id: string;
  name: string;
  weight: number;
  serviceName: string;
  notes?: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Timestamp;
};

/* =======================
   STATUS MAP
======================= */

const statusStyle: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  waiting_payment: "bg-yellow-100 text-yellow-700",
};

const statusLabel: Record<OrderStatus, string> = {
  pending: "Menunggu Antrian",
  processing: "Dikerjakan",
  done: "Selesai",
  waiting_payment: "Menunggu Pembayaran",
};

/* =======================
   PAGE
======================= */

export default function HistoryPage() {
  const router = useRouter();
  const { authUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    setLoadingOrders(true);

    getUserOrders(authUser.uid)
      .then(data => setOrders(data as Order[]))
      .finally(() => setLoadingOrders(false));
  }, [authUser]);

  return (
    <main className="min-h-screen bg-gray-100 pb-6">

      <section className="px-4 mt-6 space-y-6">
        <h1 className="text-lg font-semibold text-center">
          History
        </h1>

        {/* LOADING */}
        {loadingOrders && (
          <p className="text-center text-sm text-gray-500 mt-20">
            Loading history...
          </p>
        )}

        {/* EMPTY */}
        {!loadingOrders && orders.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-20">
            Belum ada pesanan
          </p>
        )}

        {/* LIST */}
        <div className="space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto pb-10">
          {orders.map(order => (
            <div key={order.id}>
              <p className="text-sm text-gray-500 mb-2">
                {order.createdAt?.toDate().toLocaleDateString("id-ID")}
              </p>

              <div className="bg-white rounded-2xl shadow p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Image
                    src="/placeholder-shirt.png"
                    alt="Laundry Item"
                    width={80}
                    height={80}
                  />
                </div>

                <div className="flex-1 space-y-1 text-sm">
                  <p className="font-medium">👤 {order.name}</p>
                  <p>⚖️ {order.weight} Kg</p>
                  <p>🧺 {order.serviceName}</p>

                  {order.notes && (
                    <p>📝 {order.notes}</p>
                  )}

                  <p className="font-semibold">
                    💰 Rp {order.totalPrice.toLocaleString("id-ID")}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}
                  >
                    {statusLabel[order.status]}
                  </span>

                  {order.status === "waiting_payment" && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="file"
                        className="text-xs file:mr-3 file:px-3 file:py-1 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700"
                      />
                      <button className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium">
                        Kirim Bukti
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}