"use client";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks.length) return null;

  return (
    <ul style={{ display: "grid", gap: "12px" }}>
      {tasks.map(t => (
        <li key={t.id} style={{ display: "flex", gap: "12px" }}>
          <input
            type="checkbox"
            checked={t.completed}
            onChange={async () => {
              onToggle(t.id);

              await fetch(`/api/tasks/${t.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !t.completed }),
              });
            }}
          />

          <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
            {t.title}
          </span>

          <button
            onClick={async () => {
              onDelete(t.id);
              await fetch(`/api/tasks/${t.id}`, { method: "DELETE" });
            }}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
