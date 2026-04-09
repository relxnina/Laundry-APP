import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "@/types/product";

//  GET ALL
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
}

//  GET BY SLUG
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const q = query(
    collection(db, "products"),
    where("slug", "==", slug),
    where("isActive", "==", true)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  };
}

//  ADD PRODUCT
export async function addProduct(data: any) {
  const slug = data.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  await addDoc(collection(db, "products"), {
    ...data,
    slug,
    createdAt: serverTimestamp(),
  });
}