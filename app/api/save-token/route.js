export const runtime = "nodejs";

import { adminDB } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token, userId } = await req.json();

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Missing token or userId" },
        { status: 400 }
      );
    }

    await adminDB.collection("fcmTokens").doc(token).set({
      token,
      userId,              // ✅ STORED
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
