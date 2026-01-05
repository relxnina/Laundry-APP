import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

export async function getUser(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data() as UserProfile;
}