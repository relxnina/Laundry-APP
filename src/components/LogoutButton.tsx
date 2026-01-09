"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-xl bg-red-500 px-4 py-2 text-white"
    >
      Logout
    </button>
  );
}