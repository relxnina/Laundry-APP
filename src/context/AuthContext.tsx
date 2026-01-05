"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveUser } from "@/lib/saveUser";
import { getUser } from "@/lib/getUser";
import { UserProfile } from "@/types/user";

type AuthContextType = {
  authUser: User | null;
  user: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthUser(null);
        setUser(null);
        setLoading(false);
        return;
      }

      await saveUser(firebaseUser); // ensure exists
      const userData = await getUser(firebaseUser.uid);

      setAuthUser(firebaseUser);
      setUser(userData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);