// "use client";

// import { useState } from "react";
// import { auth } from "../lib/firebaseClient";

// export default function TaskForm({ onAdd }) {
//   const [title, setTitle] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function submit(e) {
//     e.preventDefault();

//     const user = auth.currentUser;
//     if (!user) {
//       alert("Please login first");
//       return;
//     }

//     if (!title || !deadline) return;

//     setLoading(true);

//     const res = await fetch("/api/tasks", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title,
//         deadline,
//         userId: user.uid,
//       }),
//     });

//     const data = await res.json();

//     const task = {
//       id: data.id,
//       title,
//       deadline,
//       completed: false,
//       createdAt: Date.now(), // ✅ ADD THIS
//     };

//     onAdd(task);

//     setTitle("");
//     setDeadline("");
//     setLoading(false);
//   }

//   return (
//     <form onSubmit={submit} style={{ display: "flex", gap: "12px" }}>
//       <input
//         placeholder="Task name"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <input
//         type="date"
//         value={deadline}
//         onChange={(e) => setDeadline(e.target.value)}
//       />
//       <button disabled={loading}>
//         {loading ? "Saving..." : "Add"}
//       </button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { auth } from "../lib/firebaseClient";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!title || !deadlineDate || !deadlineTime || !reminderTime) {
      alert("Please fill all fields");
      return;
    }

    const fcmToken = localStorage.getItem("fcmToken");

    if (!fcmToken) {
      alert("Please enable notifications first");
      setLoading(false);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        userId: user.uid,
        deadlineDate,
        deadlineTime,
        reminderTime,
        completed: false,
        reminderSent: false,
        fcmToken,
      }),
    });

    const data = await res.json();

    const task = {
      id: data.id,
      title,
      userId: user.uid,
      deadlineDate,
      deadlineTime,
      reminderTime,
      completed: false,
      reminderSent: false,
      fcmToken,
      createdAt: Date.now(),
    };

    onAdd(task);

    // Reset form
    setTitle("");
    setDeadlineDate("");
    setDeadlineTime("");
    setReminderTime("");
    setLoading(false);
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: "var(--card)",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
      }}
    >
      <label>
        Task Name
        <input
          placeholder="Enter task name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        Deadline Date
        <input
          type="date"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
        />
      </label>

      <label>
        Deadline Time
        <input
          type="time"
          value={deadlineTime}
          onChange={(e) => setDeadlineTime(e.target.value)}
        />
      </label>

      <label>
        Reminder Time
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
      </label>

      <button disabled={loading} style={{ padding: "10px" }}>
        {loading ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
}
