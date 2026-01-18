export default function AdminDashboard() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          Total Order
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          Order Aktif
        </div>
      </div>
    </main>
  );
}
