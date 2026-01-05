"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [orders] = useState(dummyOrders);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Good Morning");
    else if (hour < 15) setGreeting("Good Afternoon");
    else if (hour < 18) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 pb-6">
      {/* Navbar */}
      <header className="bg-sky-400 text-white px-4 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">{greeting} 👋</p>
            <p className="font-bold text-lg">John</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center"
              onClick={() => router.push("/dashboard")}
            >
              <img src="/images/icons/iconhome.svg" className="w-4 h-4" />
            </button>

            <button className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">
              <img src="/images/icons/iconnotif.svg" className="w-4 h-4" />
            </button>

            <button className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">
              <img src="/images/icons/iconhistory.svg" className="w-4 h-4" />
            </button>

            <button className="w-9 h-9 rounded-full bg-white overflow-hidden">
              <div className="w-full h-full bg-gray-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="px-4 mt-6 space-y-6">
        <h1 className="text-lg font-semibold text-center">History</h1>

        {orders.map((order) => (
          <div key={order.id}>
            <p className="text-sm text-gray-500 mb-2">{order.date}</p>

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
                <p className="font-medium">👤 {order.customerName}</p>
                <p>⚖️ {order.weight} Kg</p>
                <p>➕ {order.items.join(", ")}</p>
                <p>📝 {order.notes}</p>
                <p className="font-semibold">
                  💰 Rp {order.price.toLocaleString("id-ID")}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}
                >
                  {statusLabel[order.status]}
                </span>

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
      </section>
    </main>
  );
}