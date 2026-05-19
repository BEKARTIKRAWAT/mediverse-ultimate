import { NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails("mailto:admin@mediverse.com", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export async function POST(request: Request) {
  const subscription = await request.json();
  // Store subscription in localStorage or database
  return NextResponse.json({ success: true });
}
