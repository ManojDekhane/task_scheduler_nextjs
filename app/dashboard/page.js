"use client";

import { useEffect, useState, useRef } from "react";
import { auth } from "../lib/firebaseClient";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import EnablePush from "../components/EnablePush";
import NotificationPermission from "../components/NotificationPermission";
import CheckPendingButton from "../components/CheckPendingButton";
import AuthBar from "../components/AuthBar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const notifiedRef = useRef(new Set());

  // 🔐 Auth
  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  // 📥 Load tasks
  const loadTasks = async (uid) => {
    const res = await fetch(`/api/tasks?userId=${user.uid}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (!user) return;
    loadTasks(user.uid);
  }, [user]);

  // 🔔 Local notifications (ONCE per task)
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const today = new Date().toISOString().split("T")[0];

    tasks.forEach((task) => {
      if (
        !task.completed &&
        task.deadline === today &&
        !notifiedRef.current.has(task.id)
      ) {
        new Notification("Task Due Today", {
          body: task.title,
        });
        notifiedRef.current.add(task.id);
      }
    });
  }, [tasks]);

  if (!user) return <p>Please login</p>;

  return (
    <>
      <AuthBar />
      <NotificationPermission />
      <EnablePush />
      <CheckPendingButton />

      <TaskForm onAdd={() => loadTasks(user.uid)} />

      <TaskList
        tasks={tasks}
        onToggle={(id) =>
          setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ))
        }
        onDelete={(id) =>
          setTasks(tasks.filter(t => t.id !== id))
        }
      />
    </>
  );
}
