"use client";
import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import EnablePush from "../components/EnablePush";
import NotificationPermission from "../components/NotificationPermission";
import CheckPendingButton from "../components/CheckPendingButton";

export default function Dashboard() {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Local notification effect
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    tasks.forEach((task) => {
      if (!task.completed && task.deadline === new Date().toISOString().split("T")[0]) {
        // Trigger notification
        new Notification("Task Due Today!", {
          body: task.title
        });
      }
    });
  }, [tasks]);

  return (
    <>
      <NotificationPermission />
      <EnablePush />
      
      <CheckPendingButton />

      <TaskForm onAdd={(t) => setTasks([...tasks, t])} />
      <TaskList
        tasks={tasks}
        onToggle={(id) =>
          setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
        }
        onDelete={(id) => setTasks(tasks.filter((t) => t.id !== id))}
      />
    </>
  );
}
