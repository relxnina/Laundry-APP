import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/lib/order";

export async function getUserOrders(
  userId: string
): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => {
    const raw = doc.data();

    // 🔥 Mapping status lama ke sistem baru
    let status: Order["status"];

    switch (raw.status) {
      case "pending":
        status = "queued";
        break;
      case "process":
        status = "processing";
        break;
      case "done":
        status = "waiting_payment";
        break;
      default:
        status = raw.status;
    }

    return {
      id: doc.id,
      ...raw,
      status,
    } as Order;
  });
}