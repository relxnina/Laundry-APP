type OrderCardProps = {
  service: string;
  status: string;
  price: number;
};

export default function OrderCard({ service, status, price }: OrderCardProps) {
  const statusColor =
    status === "Antri"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Proses"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="rounded-2xl border p-4 flex flex-col gap-3 shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{service}</h3>
        <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-500">Total</p>
      <p className="text-lg font-bold text-gray-900">Rp {price}</p>
    </div>
  );
}