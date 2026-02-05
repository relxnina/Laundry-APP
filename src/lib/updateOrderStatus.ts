import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, { status });
}