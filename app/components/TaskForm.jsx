"use client";
import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!title || !deadline) return;

    const task = {
      id: Date.now(), // for local UI only
      title,
      deadline,
      completed: false,
    };

    // 1️⃣ Update UI immediately (optimistic UI)
    onAdd(task);

    // 2️⃣ Save to Firestore (server)
    try {
      setLoading(true);
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          deadline,
        }),
      });
    } catch (err) {
      console.error("Failed to save task", err);
    } finally {
      setLoading(false);
    }

    setTitle("");
    setDeadline("");
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        gap: "12px",
        background: "var(--card)",
        padding: "20px",
        borderRadius: "var(--radius)",
        marginBottom: "24px",
      }}
    >
      <input
        placeholder="Task name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button disabled={loading}>
        {loading ? "Saving..." : "Add"}
      </button>
    </form>
  );
}
