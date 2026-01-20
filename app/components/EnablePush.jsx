"use client";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebaseClient";
import { firebaseApp } from "../lib/firebase";

export default function EnablePush() {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setMounted(true);
    import("firebase/messaging").then(({ isSupported }) => {
      isSupported().then(setSupported);
    });
  }, []);

  if (!mounted || !supported) return null;

  async function enableFCM() {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    const { getMessaging, getToken } = await import("firebase/messaging");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return;
    }

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
      body: JSON.stringify({
        token,
        userId: user.uid, // ✅ IMPORTANT
      }),
    });

    alert("Push notifications enabled ✅");
  }

  return <button onClick={enableFCM}>Enable Push Notifications</button>;
}
