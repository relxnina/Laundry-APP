"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/adminOrders";
import type { OrderStatus } from "@/lib/order";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "queued", label: "Antri" },
  { value: "processing", label: "Dikerjakan" },
  { value: "waiting_payment", label: "Menunggu Pembayaran" },
  { value: "payment_review", label: "Review Pembayaran" },
  { value: "paid", label: "Lunas" },
  { value: "payment_failed", label: "Gagal Bayar" },
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  onUpdated,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdated?: (status: OrderStatus) => void; // sekarang optional
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as OrderStatus;

    setLoading(true);

    try {
      await updateOrderStatus(orderId, newStatus);

      // kalau parent mau handle sesuatu
      onUpdated?.(newStatus);

    } catch (err) {
      alert("Gagal update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <select
        aria-label="Ubah status order"
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className="
          appearance-none
          bg-[#1f1f2a]
          text-gray-200
          text-xs
          px-4 py-2
          pr-8
          rounded-xl
          border border-white/10
          focus:outline-none
          focus:ring-2 focus:ring-purple-500/50
          focus:border-purple-500
          transition-all duration-200
          hover:border-white/20
          disabled:opacity-60
          cursor-pointer
        "
      >
        {STATUS_OPTIONS.map(option => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#1f1f2a] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
        {loading ? "..." : "▼"}
      </div>
    </div>
  );
}