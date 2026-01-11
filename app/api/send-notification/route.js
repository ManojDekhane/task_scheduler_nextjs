import { adminDB, adminMessaging } from "../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { title, body } = await req.json();

    // Fetch all tokens from Firestore
    const snapshot = await adminDB.collection("fcmTokens").get();
    const tokens = snapshot.docs.map(doc => doc.data().token);

    if (!tokens.length) {
      return new Response(JSON.stringify({ error: "No tokens found" }), { status: 400 });
    }

    // Send notifications
    await Promise.all(
      tokens.map(token =>
        adminMessaging.send({
          token,
          notification: { title, body },
        })
      )
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
