export const runtime = "nodejs";

import { adminDB } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("🔥 save-token API HIT");

    console.log("ENV CHECK", {
      projectId: process.env.FIREBASE_PROJECT_ID,
      email: process.env.FIREBASE_CLIENT_EMAIL,
      keyExists: !!process.env.FIREBASE_PRIVATE_KEY,
    });

    const body = await req.json();
    console.log("REQUEST BODY", body);

    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 400 });
    }

    await adminDB.collection("fcmTokens").doc(token).set({
      token,
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ SAVE TOKEN ERROR", err);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}
