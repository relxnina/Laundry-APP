import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function createOrder(data: any) {
  return await addDoc(collection(db, "orders"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
