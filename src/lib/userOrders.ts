import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserOrder = {
  id: string;
  userId: string;

  name: string;
  phone?: string;
  address?: string;

  service: string;
  serviceLabel?: string;

  weight: number;
  totalPrice: number;

  status: "pending" | "paid" | "process" | "done";
  createdAt: Timestamp;
};

export async function getUserOrders(
  userId: string
): Promise<UserOrder[]> {
  console.log("QUERY USER ID:", userId);

  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(3)
  );

  const snap = await getDocs(q);

  console.log(
    "USER ORDERS:",
    snap.docs.map(d => d.data())
  );

  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<UserOrder, "id">),
  }));
}