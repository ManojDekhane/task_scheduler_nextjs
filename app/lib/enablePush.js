import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "./firebaseClient"; // your existing firebase init

export async function enablePush() {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Notification permission denied");
    return;
  }

  const messaging = getMessaging(firebaseApp);

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      localStorage.setItem("fcmToken", token);
      console.log("✅ FCM Token saved:", token);
    }
  } catch (err) {
    console.error("❌ Error getting FCM token", err);
  }
}
