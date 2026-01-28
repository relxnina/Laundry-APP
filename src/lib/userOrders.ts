import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getUserOrders(userId: string) {
  console.log("QUERY USER ID:", userId);

  const snap = await getDocs(collection(db, "orders"));

  console.log(
    "ALL ORDERS:",
    snap.docs.map(d => d.data())
  );

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}