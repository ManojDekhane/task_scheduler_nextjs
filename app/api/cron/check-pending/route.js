export const runtime = "nodejs";

import { adminDB, adminMessaging } from "../../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // const start = new Date();
    // start.setHours(0, 0, 0, 0);

    // const end = new Date();
    // end.setHours(23, 59, 59, 999);

    const today = new Date().toISOString().split("T")[0];

    // 🔥 ONLY USER TASKS
    const snapshot = await adminDB
      .collection("tasks")
      .where("userId", "==", userId)
      .where("deadline", "==", today)
      .where("completed", "==", false)
      .get();

    const count = snapshot.size;

    if (count <= 3) {
      return NextResponse.json({
        message: "Pending tasks are not more than 3. No notification sent.",
        count,
      });
    }


    // 🔔 Only this user's tokens
    const tokenSnap = await adminDB
      .collection("fcmTokens")
      .where("userId", "==", userId)
      .get();

    const tokens = tokenSnap.docs.map(d => d.data().token);

    if (!tokens.length) {
      return NextResponse.json({
        message: "No tokens for this user",
        count,
      });
    }

    await adminMessaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "Task Alert 🚨",
        body: `You have ${count} pending tasks today`,
      },
    });

    return NextResponse.json({ success: true, count });
  } catch (err) {
    console.error("CHECK PENDING ERROR", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
