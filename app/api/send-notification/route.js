import { adminDB, adminMessaging } from "../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { title, body, userId } = await req.json();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshot = await adminDB
      .collection("fcmTokens")
      .where("userId", "==", userId)
      .get();

    const tokens = snapshot.docs.map(d => d.data().token);

    if (!tokens.length) {
      return Response.json({ message: "No tokens" });
    }

    await adminMessaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
