import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
}

export async function addProduct(data: any) {
  const slug = data.name
    .toLowerCase()
    .trim()``
    .replace(/\s+/g, "-");

  await addDoc(collection(db, "products"), {
    ...data,
    slug, // 🔥 INI YANG PENTING
    createdAt: serverTimestamp(),
  });
}