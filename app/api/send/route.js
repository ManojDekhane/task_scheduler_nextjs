import { subscriptions } from "../_data/subscriptions";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:novabeats0710@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST() {
  const payload = JSON.stringify({
    title: "Task Reminder",
    body: "You have pending tasks!",
  });

  await Promise.all(
    subscriptions.map((sub) => webpush.sendNotification(sub, payload))
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
