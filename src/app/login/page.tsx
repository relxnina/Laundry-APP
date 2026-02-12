"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { saveUser } from "@/lib/saveUser";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, loading: authLoading } = useAuth();

useEffect(() => {
  if (authLoading) return;
  if (!user) return;

  if (user.role === "admin") {
    router.replace("/admin");
  } else {
    router.replace("/dashboard");
  }
}, [user, authLoading, router]);

  const afterLogin = async () => {
    if (!auth.currentUser) return;
    await saveUser(auth.currentUser);
  };

  const loginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await afterLogin();
    } catch (err) {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await afterLogin();
    } catch (err) {
      setError("Login Google gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={loginEmail}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-2 rounded-lg mb-3 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          type="button"
          onClick={loginGoogle}
          disabled={loading}
          className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <img src="/icons/google.svg"
          alt=""
          className="w-5 h-5" />
          Login with Google
        </button>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-green-600 font-medium">
            Register
          </Link>
        </p>

      </form>
    </main>
  );
}