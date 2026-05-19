"use client";

let reminderInterval: NodeJS.Timeout | null = null;

export function startReminderService(userId: string) {
  if (reminderInterval) clearInterval(reminderInterval);
  
  reminderInterval = setInterval(() => {
    const meds = JSON.parse(localStorage.getItem(`mediverse_medications_${userId}`) || "[]");
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const today = now.toISOString().split("T")[0];
    
    meds.forEach((med: any) => {
      med.times?.forEach((time: string) => {
        const [hour, minute] = time.split(":").map(Number);
        if (hour === currentHour && minute === currentMinute) {
          const alreadyNotified = med.lastNotified === today && med.lastNotifiedTime === time;
          if (!alreadyNotified && Notification.permission === "granted") {
            new Notification("💊 Medication Reminder", {
              body: `Time to take ${med.name} (${med.dosage || "as prescribed"})`,
              icon: "/icon-192.png",
              tag: med.id,
            });
            med.lastNotified = today;
            med.lastNotifiedTime = time;
            localStorage.setItem(`mediverse_medications_${userId}`, JSON.stringify(meds));
          }
        }
      });
    });
  }, 60000); // Check every minute
}

export function stopReminderService() {
  if (reminderInterval) clearInterval(reminderInterval);
}
