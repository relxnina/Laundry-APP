import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OrderStatus } from "@/lib/order";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, { status });
}