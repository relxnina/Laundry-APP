import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order, OrderStatus } from "@/lib/order";

export async function getAllOrders(): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const raw = doc.data();

    return {
      id: doc.id,
      userId: raw.userId,
      name: raw.name,
      phone: raw.phone,
      address: raw.address,
      service: raw.service,
      serviceLabel: raw.serviceLabel,
      weight: raw.weight,
      totalPrice: raw.totalPrice,
      status: raw.status as OrderStatus,
      paymentProofUrl: raw.paymentProofUrl,
      paymentNote: raw.paymentNote,
      createdAt: raw.createdAt,
    };
  });
}