export const runtime = "nodejs";

import { adminDB, adminMessaging } from "../../../lib/firebaseAdmin";

export async function GET() {
  try {
    console.log("🔔 check-pending API called");

    // 1️⃣ Date range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    console.log("📅 Date range", start.toISOString(), end.toISOString());

    // 2️⃣ Fetch pending tasks
    const snapshot = await adminDB
      .collection("tasks")
      .where("deadline", ">=", start)
      .where("deadline", "<=", end)
      .where("completed", "==", false)
      .get();

    console.log("📦 Tasks fetched:", snapshot.size);

    const count = snapshot.size;

    if (count <= 3) {
      console.log("ℹ️ Not enough tasks to notify");
      return Response.json({ message: "No notification needed", count });
    }

    // 3️⃣ Fetch FCM tokens
    const tokenSnap = await adminDB.collection("fcmTokens").get();

    console.log("📱 Token docs:", tokenSnap.size);

    const tokens = tokenSnap.docs
      .map((d) => d.data()?.token)
      .filter(Boolean);

    if (!tokens.length) {
      console.log("⚠️ No FCM tokens found");
      return Response.json({ message: "No FCM tokens" });
    }

    // 4️⃣ Send notification
    const response = await adminMessaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "Task Alert 🚨",
        body: `You have ${count} pending tasks today`,
      },
    });

    console.log("✅ Notification response:", response);

    return Response.json({
      success: true,
      count,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error("❌ check-pending ERROR:", error);

    return Response.json(
      {
        error: "check-pending failed",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
