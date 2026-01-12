"use client";

import { useState, useEffect } from "react"; // ✅ ADD useEffect
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (user) router.push("/dashboard");
    });
    return () => unsub();
  }, [router]);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // ✅ redirect after signup
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button>Create Account</button>

      {error && <p>{error}</p>}
    </form>
  );
}
