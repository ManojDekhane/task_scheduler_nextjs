"use client";
import { useEffect, useState } from "react";

export default function NotificationPermission() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function requestPermission() {
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Local notifications enabled ✅");
    } else {
      alert("Permission denied ❌");
    }
  }

  if (!mounted) return null;

  return (
    <button
      onClick={requestPermission}
      style={{ marginBottom: "12px" }}
    >
      Enable Local Notifications
    </button>
  );
}
