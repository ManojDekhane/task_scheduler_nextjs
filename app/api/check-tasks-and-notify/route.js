import { adminDB, adminMessaging } from "../../lib/firebaseAdmin";

export async function POST() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const snapshot = await adminDB
      .collection("tasks")
      .where("createdAt", ">=", startOfDay.getTime())
      .get();

    if (snapshot.size <= 3) {
      return new Response(
        JSON.stringify({ message: "Less than or equal to 3 tasks, no notification sent" }),
        { status: 200 }
      );
    }

    // Fetch FCM tokens
    const tokenSnap = await adminDB.collection("fcmTokens").get();
    const tokens = tokenSnap.docs.map(doc => doc.data().token);

    await Promise.all(
      tokens.map(token =>
        adminMessaging.send({
          token,
          notification: {
            title: "Too many tasks today 🚨",
            body: `You have ${snapshot.size} tasks scheduled today`,
          },
        })
      )
    );

    return new Response(
      JSON.stringify({ success: true, tasksToday: snapshot.size }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
