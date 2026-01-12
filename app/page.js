"use client";

import Link from "next/link";
import { auth } from "./lib/firebaseClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Scheduler</h1>

      {!user ? (
        <>
          <Link href="/login">
            <button>Login</button>
          </Link>

          <Link href="/signup">
            <button style={{ marginLeft: "10px" }}>Signup</button>
          </Link>
        </>
      ) : (
        <>
          <p>Welcome, {user.email}</p>
          <Link href="/dashboard">
            <button>Go to Dashboard</button>
          </Link>
        </>
      )}
    </div>
  );
}
