import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";

export async function createOrder(data: any) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  return await addDoc(collection(db, "orders"), {
    ...data,
    userId: user.uid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}