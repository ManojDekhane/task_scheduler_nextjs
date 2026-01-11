import admin from "../../lib/firebaseAdmin";
import { tokens } from "../../lib/tokens"; // <-- import shared module

export async function POST(req) {
  const { title, body } = await req.json();

  if (!tokens.length) {
    return new Response("No tokens", { status: 400 });
  }

  await Promise.all(
    tokens.map((token) =>
      admin.messaging().send({
        token,
        notification: { title, body },
      })
    )
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
