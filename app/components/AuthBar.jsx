"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebaseClient";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AuthBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  async function logout() {
    await signOut(auth);
    router.push("/login"); 
  }

  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => router.push("/login")}>Login</button>
          <button onClick={() => router.push("/signup")}>Signup</button>
        </>
      )}
    </div>
  );
}
