"use client";

import { useState } from "react";
import { auth } from "../lib/firebaseClient";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!title || !deadline) return;

    setLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        deadline,
        userId: user.uid,
      }),
    });

    const data = await res.json();

    const task = {
      id: data.id,
      title,
      deadline,
      completed: false,
      createdAt: Date.now(), // ✅ ADD THIS
    };

    onAdd(task);

    setTitle("");
    setDeadline("");
    setLoading(false);
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: "12px" }}>
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
