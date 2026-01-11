import { adminDB } from "../../lib/firebaseAdmin";

export async function POST(req) {
  const { title, deadline } = await req.json();

  await adminDB.collection("tasks").add({
    title,
    deadline: new Date(deadline), // timestamp
    completed: false,
    createdAt: new Date(),
  });

  return Response.json({ success: true });
}
