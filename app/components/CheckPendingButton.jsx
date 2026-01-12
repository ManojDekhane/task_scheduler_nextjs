"use client";

import { useState } from "react";
import { auth } from "../lib/firebaseClient";

export default function CheckPendingButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    try {
      setLoading(true);
      setResult(null);

      const user = auth.currentUser;
      if (!user) {
        setResult({ error: "User not logged in" });
        return;
      }

      const res = await fetch("/api/cron/check-pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid, // ✅ SEND USER ID
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Checking..." : "Check Pending Tasks"}
      </button>

      {result && (
        <pre style={{ marginTop: "8px", fontSize: "12px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
