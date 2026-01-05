"use client";

export default function AccountPage() {
  const user = null;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6">
      <section className="bg-white rounded-[18px] p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          {user?.photo && (
            <img
              src={user.photo}
              className="w-full h-full object-cover"
            />
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
        <button className="w-full flex items-center justify-between px-5 py-4 text-sm">
          <span>Riwayat Pesanan</span>
          <span>›</span>
        </button>

        <button className="w-full flex items-center justify-between px-5 py-4 text-sm">
          <span>Edit Profil</span>
          <span>›</span>
        </button>

        {user ? (
          <button className="w-full px-5 py-4 text-sm text-red-500">
            Logout
          </button>
        ) : (
          <button className="w-full px-5 py-4 text-sm text-sky-500">
            Login / Register
          </button>
        )}
      </section>
    </main>
  );
}
