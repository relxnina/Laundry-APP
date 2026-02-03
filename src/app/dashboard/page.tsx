"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
// import { UserOrder } from "@/lib/userOrders";
import { getUserOrders, type UserOrder } from "@/lib/userOrders";

export default function DashboardPage() {
  const router = useRouter();

  // nanti ganti dari AuthContext
  const { authUser, loading } = useAuth();

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
  if (!authUser) {
    setOrders([]);
    return;
  }

  setLoadingOrders(true);

  getUserOrders(authUser.uid)
    .then((data: any[]) => {
      setOrders(data);
    })
    .catch((err: unknown) => {
      console.error("Gagal ambil history:", err);
      setOrders([]);
    })
    .finally(() => {
      setLoadingOrders(false);
    });
}, [authUser]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Good Morning");
    else if (hour < 15) setGreeting("Good Afternoon");
    else if (hour < 18) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 pb-8">

      <section className="px-4 mt-6">
        <div className="h-[140px] rounded-[18px] overflow-hidden shadow-md">
          <img
            src="/images/banner/banner1.png"
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="px-4 mt-6 flex justify-center">
        <div className="w-[355px] h-[285px] bg-white rounded-[15px] shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-sm">History</p>
            <button
              className="text-xs text-sky-500"
              onClick={() => router.push("/dashboard/history")}>
              View all
            </button>
          </div>

          {!authUser ? (
            <div className="w-[325px] h-[191px] mx-auto flex flex-col items-center justify-center gap-4 text-sm">
              <p className="text-gray-500">Anda belum login</p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-sky-400 text-white rounded-xl text-xs"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 border border-sky-400 text-sky-400 rounded-xl text-xs"
                  onClick={() => router.push("/register")}
                >
                  Register
                </button>
              </div>
            </div>
          ) : (
            <div className="w-[325px] h-[191px] mx-auto bg-sky-50 rounded-[18px] p-3">
              {loadingOrders ? (
                <p className="text-xs text-gray-500 text-center mt-16">
                  Loading history...
                </p>
              ) : orders.length === 0 ? (
                <p className="text-xs text-gray-500 text-center mt-16">
                  Belum ada pesanan
                </p>
              ) : (
                <div className="space-y-2">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {order.serviceName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.status}
                        </p>
                      </div>
                  
                      <span className="text-xs text-gray-400">
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString("id-ID")
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
            </div>
          )}
        </div>
      </section>

      <section className="px-4 mt-8 flex justify-center">
        <div className="grid grid-cols-2 gap-4 w-[355px]">

          <button
            onClick={() => router.push("/dashboard/order/wash")}
            className="w-[171px] h-[116px] bg-sky-300 rounded-[15px] p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <img src="/images/icons/iconwash.svg" className="w-4 h-4" />
              <p className="font-semibold text-sm">Wash</p>
            </div>
            <div className="flex justify-end">
              <img
                src="/images/service/kaos.png"
                className="w-14 h-14 object-contain"
              />
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/order/dryclean")}
            className="w-[171px] h-[116px] bg-green-300 rounded-[15px] p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <img src="/images/icons/icondryclean.svg" className="w-4 h-4" />
              <p className="font-semibold text-sm">Dry Cleaning</p>
            </div>
            <div className="flex justify-end">
              <img
                src="/images/service/dryclean.png"
                className="w-14 h-14 object-contain"
              />
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/order/duvets")}
            className="col-span-2 w-[355px] h-[116px] bg-purple-300 rounded-[15px] p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <img src="/images/icons/duvets.png" className="w-4 h-4" />
              <p className="font-semibold text-sm">Duvets</p>
            </div>
            <div className="flex justify-end">
              <img
                src="/images/service/duvets.png"
                className="w-20 h-14 object-contain"
              />
            </div>
          </button>
        </div>
      </section>
    </main>
  );
}