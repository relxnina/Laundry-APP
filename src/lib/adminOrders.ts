import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order, OrderStatus } from "@/lib/order";

function mapDocToOrder(doc: any): Order {
  const raw = doc.data();

  return {
    id: doc.id,
    userId: raw.userId ?? "",
    name: raw.name ?? "Unknown",
    phone: raw.phone ?? "",
    address: raw.address ?? "",
    service: raw.service ?? "",
    serviceLabel: raw.serviceLabel ?? "",
    weight: raw.weight ?? 0,
    totalPrice: raw.totalPrice ?? 0,
    status: (raw.status ?? "queued") as OrderStatus,
    paymentProofUrl: raw.paymentProofUrl ?? "",
    paymentNote: raw.paymentNote ?? "",
    createdAt: raw.createdAt,
  };
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(mapDocToOrder);
}

export async function getOrdersByStatus(
  status: OrderStatus
): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(mapDocToOrder);
}