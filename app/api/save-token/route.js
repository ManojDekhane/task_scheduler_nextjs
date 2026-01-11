import { adminDB } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Save token to Firestore
    await adminDB.collection("fcmTokens").doc(token).set({
      token,
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
