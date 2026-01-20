"use client";

import { useState, useEffect } from "react"; // ✅ ADD useEffect
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseClient";
import { useRouter } from "next/navigation";
import { enablePush } from "../lib/enablePush";

export default function Login() {
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

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await enablePush();
      router.push("/dashboard"); // ✅ redirect after login
    } catch (err) {
      setError(err.message);
    }

  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

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

      <button>Login</button>

      {error && <p>{error}</p>}
    </form>
  );
}
