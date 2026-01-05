"use client";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      setRole(snap.exists() ? snap.data().role : null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { role, loading };
}
