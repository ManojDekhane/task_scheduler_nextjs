import { adminDB } from "../../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function PATCH(req, ctx) {
  const { id } = await ctx.params; // ✅ IMPORTANT
  const { completed } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  await adminDB.collection("tasks").doc(id).update({
    completed,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req, ctx) {
  const { id } = await ctx.params; // ✅ IMPORTANT

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  await adminDB.collection("tasks").doc(id).delete();

  return NextResponse.json({ success: true });
}
