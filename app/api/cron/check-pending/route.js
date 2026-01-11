export const runtime = "nodejs";

import { adminDB, adminMessaging } from "../../../lib/firebaseAdmin";

export async function GET() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const snapshot = await adminDB
    .collection("tasks")
    .where("deadline", ">=", start)
    .where("deadline", "<=", end)
    .where("completed", "==", false)
    .get();

  const count = snapshot.size;

  if (count <= 3) {
    return Response.json({ message: "No notification needed", count });
  }

  const tokenSnap = await adminDB.collection("fcmTokens").get();
  const tokens = tokenSnap.docs.map(d => d.data().token);

  if (!tokens.length) {
    return Response.json({ message: "No FCM tokens" });
  }

  await adminMessaging.sendEachForMulticast({
    tokens,
    notification: {
      title: "Task Alert 🚨",
      body: `You have ${count} pending tasks today`,
    },
  });

  return Response.json({ success: true, count });
}
