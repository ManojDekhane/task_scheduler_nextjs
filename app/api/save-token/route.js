import { adminDB } from "../../lib/firebaseAdmin";
import { addToken } from "../../lib/tokens";
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

  addToken(token); // update shared in-memory array

  return NextResponse.json({ success: true });
}
