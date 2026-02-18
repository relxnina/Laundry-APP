"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrdersByStatus } from "@/lib/adminOrders";
import type { OrderStatus } from "@/lib/order";

export default function AdminDashboard() {
  const router = useRouter();

  const [counts, setCounts] = useState<Record<string, number>>({});

  const statuses: { label: string; key: OrderStatus }[] = [
    { label: "Queued", key: "queued" },
    { label: "Processing", key: "processing" },
    { label: "Waiting Payment", key: "waiting_payment" },
    { label: "Payment Review", key: "payment_review" },
    { label: "Paid", key: "paid" },
    { label: "Payment Failed", key: "payment_failed" },
  ];

  useEffect(() => {
    const load = async () => {
      const results: Record<string, number> = {};

      for (const s of statuses) {
        const data = await getOrdersByStatus(s.key);
        results[s.key] = data.length;
      }

      setCounts(results);
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">
        Dashboard Overview
      </h1>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {statuses.map(stat => (
          <Stat
            key={stat.key}
            title={stat.label}
            value={counts[stat.key] ?? 0}
            onClick={() =>
              router.push(`/admin/status/${stat.key}`)
            }
          />
        ))}
      </section>
    </div>
  );
}

function Stat({
  title,
  value,
  onClick,
}: {
  title: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-[#151520] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition"
    >
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}