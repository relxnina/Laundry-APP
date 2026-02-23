"use client";

import { useEffect, useState } from "react";
import { listenAllUsers, listenAllOrders } from "@/lib/adminOrders";
import type { Order } from "@/lib/order";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubUsers = listenAllUsers(setUsers);
    const unsubOrders = listenAllOrders(setOrders);

    return () => {
      unsubUsers();
      unsubOrders();
    };
  }, []);

  function getUserOrders(uid: string) {
    return orders.filter(o => o.userId === uid);
  }

  function getTotalSpent(uid: string) {
    return getUserOrders(uid)
      .filter(o => o.status === "paid")
      .reduce((sum, o) => sum + o.totalPrice, 0);
  }

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <div className="bg-[#151520] rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Provider</th>
              <th className="p-4 text-left">Total Orders</th>
              <th className="p-4 text-left">Total Spent</th>
              <th className="p-4 text-left">Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => {
              const userOrders = getUserOrders(user.uid);

              return (
                <tr
                  key={user.uid}
                  className="border-t border-white/5"
                >
                  <td className="p-4">
                    <div className="font-semibold">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.email}
                    </div>
                  </td>

                  <td className="p-4">
                    {user.provider}
                  </td>

                  <td className="p-4">
                    {userOrders.length}
                  </td>

                  <td className="p-4">
                    Rp {getTotalSpent(user.uid).toLocaleString("id-ID")}
                  </td>

                  <td className="p-4">
                    {user.createdAt?.seconds
                      ? new Date(user.createdAt.seconds * 1000)
                          .toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}