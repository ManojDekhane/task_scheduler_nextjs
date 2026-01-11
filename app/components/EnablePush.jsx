"use client";

import { useEffect, useState } from "react";
import { firebaseApp } from "../lib/firebase";

export default function EnablePush() {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);

  // Ensure component only renders AFTER hydration
  useEffect(() => {
    setMounted(true);

    import("firebase/messaging").then(({ isSupported }) => {
      isSupported().then(setSupported);
    });
  }, []);

  // 🚫 Server & pre-hydration render NOTHING
  if (!mounted || !supported) return null;

  async function enableFCM() {
    const { getMessaging, getToken } = await import("firebase/messaging");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const messaging = getMessaging(firebaseApp);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    await fetch("/api/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    alert("Push notifications enabled ✅");
  }

  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
      <button onClick={enableFCM}>Enable Push Notifications</button>
    </div>
  );
}
