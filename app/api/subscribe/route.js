import { NextResponse } from "next/server";
import { subscriptions } from "../_data/subscriptions";

export async function POST(req) {
  const sub = await req.json();

  // Check for duplicates
  if (!subscriptions.find((s) => s.endpoint === sub.endpoint)) {
    subscriptions.push(sub);
  }

  return NextResponse.json({ success: true });
}
