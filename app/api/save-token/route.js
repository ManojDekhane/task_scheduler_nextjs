import { adminDB } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 });
  }

  await adminDB.collection("fcmTokens").doc(token).set({
    token,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
