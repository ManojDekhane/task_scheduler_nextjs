import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp =
  !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// 🔐 Auth
export const auth = getAuth(firebaseApp);

// 📡 Messaging (ONLY in browser)
export const messaging =
  typeof window !== "undefined" ? getMessaging(firebaseApp) : null;

// 🔔 Foreground push notification handler
if (typeof window !== "undefined" && messaging) {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground push message:", payload);

    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
      });
    }
  });
}

export default firebaseApp;
