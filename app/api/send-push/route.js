import { adminDB, adminMessaging } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST() {
  const snapshot = await adminDB.collection("fcmTokens").get();

  const tokens = snapshot.docs.map((doc) => doc.id);

  if (tokens.length === 0) {
    return NextResponse.json({ message: "No tokens" });
  }

  await adminMessaging.sendEachForMulticast({
    tokens,
    notification: {
      title: "Task Reminder ⏰",
      body: "You have pending tasks!",
    },
  });

  return NextResponse.json({ success: true });
}
