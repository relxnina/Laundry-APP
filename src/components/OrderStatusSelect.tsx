"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/updateOrderStatus";

const STATUS_OPTIONS = ["Antri", "Dikerjakan", "Selesai"];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  onUpdated,
}: {
  orderId: string;
  currentStatus: string;
  onUpdated: (status: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
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
      {STATUS_OPTIONS.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}