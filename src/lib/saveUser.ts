import { User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const saveUser = async (user: User) => {
  if (!user || !user.uid) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email ?? "",
      name: user.displayName ?? user.email?.split("@")[0] ?? "User",
      photoURL: user.photoURL ?? null,
      provider: user.providerData[0]?.providerId ?? "password",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};