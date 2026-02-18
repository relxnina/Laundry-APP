"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <section className="min-h-screen bg-[#0f0f17] text-white">
      <div className="max-w-7xl mx-auto p-8">
        {children}
      </div>
    </section>
  );
}