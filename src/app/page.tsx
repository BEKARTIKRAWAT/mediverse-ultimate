"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
    // Daily tip notification (once per day)
    const lastTip = localStorage.getItem("last_tip_date");
    const today = new Date().toDateString();
    if (lastTip !== today && Notification.permission === "granted") {
      const tips = ["Drink 8 glasses of water", "Take a 5 min walk", "Stretch your neck", "Practice deep breathing"];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      new Notification("💡 Daily Health Tip", { body: randomTip, icon: "/icon-192.png" });
      localStorage.setItem("last_tip_date", today);
    }
    if (Notification.permission !== "denied") Notification.requestPermission();
  }, []);
  return null;
}


