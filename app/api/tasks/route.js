import { adminDB } from "../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { title, deadline, userId } = await req.json();

  if (!title || !deadline || !userId) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const ref = await adminDB.collection("tasks").add({
    title,
    deadline,
    userId,
    completed: false,
    createdAt: Date.now(), // ✅ ADD THIS
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
