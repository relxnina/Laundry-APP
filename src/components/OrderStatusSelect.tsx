"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/updateOrderStatus";
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
  onUpdated: (status: OrderStatus) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as OrderStatus;
    setLoading(true);

    // optimistic update
    onUpdated(newStatus);

    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert("Gagal update status");
      onUpdated(currentStatus); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {STATUS_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}