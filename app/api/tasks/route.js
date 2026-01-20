import { adminDB } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    title,
    userId,
    deadlineDate,
    deadlineTime,
    reminderTime,
    completed,
    reminderSent,
    fcmToken,
  } = await req.json();

  if (!title || !userId || !deadlineDate || !deadlineTime || !reminderTime) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ref = await adminDB.collection("tasks").add({
    title,
    userId,
    deadlineDate,   // "YYYY-MM-DD"
    deadlineTime,   // "HH:mm"
    reminderTime,   // "HH:mm"
    completed: completed || false,
    reminderSent: reminderSent || false,
    fcmToken: fcmToken || "",
    createdAt: Date.now(),
  });

  return NextResponse.json({ id: ref.id });
}

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");

  const snap = await adminDB
    .collection("tasks")
    .where("userId", "==", userId)
    .get();

  return NextResponse.json(
    snap.docs.map(d => ({ id: d.id, ...d.data() }))
  );
}
