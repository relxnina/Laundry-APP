"use client";

import { useState } from "react";
import Image from "next/image";

type OrderStatus =
  | "menunggu_antrian"
  | "dikerjakan"
  | "selesai"
  | "menunggu_pembayaran";

type Order = {
  id: string;
  date: string;
  customerName: string;
  weight: number;
  items: string[];
  notes: string;
  price: number;
  status: OrderStatus;
};

const dummyOrders: Order[] = [
  {
    id: "1",
    date: "1 Des 2025",
    customerName: "Nnnnnn",
    weight: 1.9999,
    items: ["Setrika", "dll"],
    notes: "Notes",
    price: 19999,
    status: "dikerjakan",
  },
  {
    id: "2",
    date: "1 Des 2025",
    customerName: "Nnnnnn",
    weight: 1.9999,
    items: ["Setrika"],
    notes: "Notes",
    price: 19999,
    status: "menunggu_pembayaran",
  },
  {
    id: "3",
    date: "1 Des 2025",
    customerName: "Nnnnnn",
    weight: 1.9999,
    items: ["dll"],
    notes: "Notes",
    price: 19999,
    status: "selesai",
  },
];

const statusStyle: Record<OrderStatus, string> = {
  menunggu_antrian: "bg-gray-100 text-gray-700",
  dikerjakan: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  menunggu_pembayaran: "bg-yellow-100 text-yellow-700",
};

const statusLabel: Record<OrderStatus, string> = {
  menunggu_antrian: "Menunggu Antrian",
  dikerjakan: "Dikerjakan",
  selesai: "Selesai",
  menunggu_pembayaran: "Menunggu Pembayaran",
};

export default function HistoryPage() {
  const [orders] = useState(dummyOrders);

  return (
    <div className="px-4 py-4 space-y-6">
      <h1 className="text-lg font-semibold">History</h1>

      {orders.map((order) => (
        <div key={order.id}>
          <p className="text-sm text-gray-500 mb-2">{order.date}</p>

          <div className="bg-white rounded-2xl shadow p-4 flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
              <Image
                src="/placeholder-shirt.png"
                alt="Laundry Item"
                width={80}
                height={80}
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1 text-sm">
              <p className="font-medium flex items-center gap-1">
                👤 {order.customerName}
              </p>
              <p>⚖️ {order.weight} Kg</p>
              <p>➕ {order.items.join(", ")}</p>
              <p>📝 {order.notes}</p>
              <p className="font-semibold">💰 Rp {order.price.toLocaleString()}</p>

              {/* Status */}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}
              >
                {statusLabel[order.status]}
              </span>

              {/* Upload bukti pembayaran */}
              {order.status === "menunggu_pembayaran" && (
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
  );
}
