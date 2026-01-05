import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";

export async function saveUser(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return ;
  
  
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName ?? "",
      email: user.email ?? "",
      photo: user.photoURL ?? "",
      provider: user.providerData[0]?.providerId ?? "password",
      createdAt: serverTimestamp()
    });
}
