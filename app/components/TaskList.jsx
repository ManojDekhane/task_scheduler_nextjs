"use client";

import { useEffect, useState } from "react";

export default function TaskList({ tasks = [], onToggle, onDelete }) {
  // Ensure component renders only after hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // IMPORTANT: server + first client render must match
  if (!mounted) {
    return <ul style={{ display: "grid", gap: "12px" }} />;
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <ul style={{ display: "grid", gap: "12px" }} />;
  }

  return (
    <ul style={{ display: "grid", gap: "12px" }}>
      {tasks.map((t) => (
        <li
          key={String(t.id)} // stable key
          style={{
            background: "var(--card)",
            padding: "16px",
            borderRadius: "var(--radius)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="checkbox"
              checked={!!t.completed}
              onChange={() => onToggle(t.id)}
            />

            <div>
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  fontWeight: "600",
                }}
              >
                {t.title}
              </span>

              <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                Due: {String(t.deadline)}
              </div>
            </div>
          </div>

          {/* Right side */}
          <button
            onClick={() => onDelete(t.id)}
            style={{
              background: "var(--danger)",
              padding: "6px 12px",
              borderRadius: "var(--radius)",
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
