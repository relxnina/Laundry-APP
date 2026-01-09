"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveUser } from "@/lib/saveUser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const afterAuth = async () => {
    if (!auth.currentUser) return;
    await saveUser(auth.currentUser);
    router.replace("/dashboard");
  };

  const registerEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await afterAuth();
    } catch (err) {
      setError("Register gagal");
    } finally {
      setLoading(false);
    }
  };

  const registerGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await afterAuth();
    } catch (err: any) {
  console.error(err);
  setError(err.code ?? "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={registerEmail}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

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
          className="w-full bg-green-600 text-white py-2 rounded-lg mb-3 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <button
          type="button"
          onClick={registerGoogle}
          disabled={loading}
          className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 mb-4 disabled:opacity-60"
        >
          <img src="/icons/google.svg" className="w-5 h-5" />
          Register with Google
        </button>

        <p className="text-sm text-center">
          Udah punya akun?{" "}
          <Link href="/login" className="text-sky-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}