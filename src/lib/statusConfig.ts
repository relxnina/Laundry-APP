import { OrderStatus } from "@/lib/order";

export const statusLabel: Record<OrderStatus, string> = {
  queued: "Antri",
  processing: "Dikerjakan",
  waiting_payment: "Selesai (Menunggu Pembayaran)",
  payment_review: "Validasi Pembayaran",
  paid: "Transaksi Berhasil",
  payment_failed: "Transaksi Gagal (Ditinjau Admin)",
};

export const statusStyle: Record<OrderStatus, string> = {
  queued: "bg-yellow-100 text-yellow-600",
  processing: "bg-blue-100 text-blue-600",
  waiting_payment: "bg-purple-100 text-purple-600",
  payment_review: "bg-orange-100 text-orange-600",
  paid: "bg-green-100 text-green-600",
  payment_failed: "bg-red-100 text-red-600",
};