"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginWithGoogle } from "@/lib/auth";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading akun...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6">

      <section className="bg-white rounded-[18px] p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {user?.photo ? (
            <img
              src={user.photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm">👤</span>
          )}
        </div>

        <div>
          <p className="font-semibold text-base">
            {user?.name ?? "Guest User"}
          </p>
          <p className="text-sm text-gray-500">
            {user?.email ?? "Anda belum login"}
          </p>
        </div>
      </section>

      <section className="mt-6 bg-white rounded-[18px] shadow-sm divide-y">
        <button
          onClick={() => router.push("/dashboard/history")}
          className="w-full flex items-center justify-between px-5 py-4 text-sm"
        >
          <span>Riwayat Pesanan</span>
          <span>›</span>
        </button>

        <button
          disabled
          className="w-full flex items-center justify-between px-5 py-4 text-sm text-gray-400"
        >
          <span>Edit Profil</span>
          <span>›</span>
        </button>

        {user ? (
          <button
            onClick={logout}
            className="w-full px-5 py-4 text-sm text-red-500"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="w-full px-5 py-4 text-sm text-sky-500"
          >
            Login / Register (Google)
          </button>
        )}
      </section>
    </main>
  );
}