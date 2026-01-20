import { adminDB, adminMessaging } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, taskTitle } = await req.json();

    if (!userId || !taskTitle) {
      return NextResponse.json(
        { error: "Missing userId or taskTitle" },
        { status: 400 }
      );
    }

    // 🔔 Get FCM tokens of the user
    const tokenSnap = await adminDB
      .collection("fcmTokens")
      .where("userId", "==", userId)
      .get();

    const tokens = tokenSnap.docs.map((d) => d.data().token);

    if (!tokens.length) {
      return NextResponse.json({
        message: "No tokens for this user",
      });
    }

    // 🔔 Send push notification
    await adminMessaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "⏰ Task Reminder",
        body: taskTitle,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("REMINDER ERROR", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
