"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Good Morning");
    else if (hour < 15) setGreeting("Good Afternoon");
    else if (hour < 18) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-sky-400 text-white px-4 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">{greeting} 👋</p>
            <p className="font-bold text-lg">Guest</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center"
              onClick={() => router.push("/dashboard")}
            >
              <img src="/images/icons/iconhome.svg" className="w-4 h-4" />
            </button>

            <button
              className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center"
            >
              <img src="/images/icons/iconnotif.svg" className="w-4 h-4" />
            </button>

            <button
              className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center"
              onClick={() => router.push("/dashboard/history")}
            >
              <img src="/images/icons/iconhistory.svg" className="w-4 h-4" />
            </button>

            <button className="w-9 h-9 rounded-full bg-white overflow-hidden">
              <div className="w-full h-full bg-gray-200" />
            </button>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
}
