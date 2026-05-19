"use client";
export async function subscribeToPush() {
  if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  });
  await fetch("/api/subscribe", { method: "POST", body: JSON.stringify(subscription), headers: { "Content-Type": "application/json" } });
}
