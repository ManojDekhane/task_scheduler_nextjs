"use client";
import { useState } from "react";

export default function CheckPendingButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/cron/check-pending");
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
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: "10px 16px",
          backgroundColor: loading ? "#999" : "#000",
          color: "#fff",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Checking..." : "Check Pending Tasks"}
      </button>

      {/* {result && (
        <pre
          style={{
            marginTop: "8px",
            background: "#f4f4f4",
            padding: "8px",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )} */}
    </div>
  );
}
