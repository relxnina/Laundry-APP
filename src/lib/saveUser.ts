import { User } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const saveUser = async (user: User) => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) return;

  await setDoc(ref,
    {
      uid: user.uid,
      email: user.email ?? "",
      name: user.displayName ?? user.email?.split("@")[0] ?? "User",
      photoURL: user.photoURL ?? null,
      provider: user.providerData[0]?.providerId ?? "password",
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
};