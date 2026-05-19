"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Clock } from "lucide-react";

interface Reminder {
  id: string;
  medName: string;
  time: string;
  enabled: boolean;
}

export default function MedicationReminder() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newMed, setNewMed] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_reminders_${user?.id}`);
    if (saved) setReminders(JSON.parse(saved));
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_reminders_${user?.id}`, JSON.stringify(reminders));
    // Set up periodic check (every minute)
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
      reminders.forEach(r => {
        if (r.enabled && r.time === currentTime && Notification.permission === "granted") {
          new Notification("💊 Medication Reminder", { body: `Time to take ${r.medName}`, icon: "/icon-192.png" });
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [reminders, user]);

  const addReminder = () => {
    if (!newMed) return;
    setReminders([...reminders, { id: Date.now().toString(), medName: newMed, time: newTime, enabled: true }]);
    setNewMed("");
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id: string) => setReminders(reminders.filter(r => r.id !== id));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Bell className="text-blue-500" /> Medication Reminder</h1>
        <div className="flex gap-2 mb-4"><input type="text" placeholder="Medication name" value={newMed} onChange={e=>setNewMed(e.target.value)} className="border rounded p-2 flex-1" /><input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} className="border rounded p-2" /><button onClick={addReminder} className="bg-blue-600 text-white px-3 rounded-xl"><Plus size={18} /></button></div>
        <div className="space-y-2">{reminders.map(r=><div key={r.id} className="flex justify-between items-center p-2 border-b"><div className="flex items-center gap-2"><Clock size={14} /> <span className="font-medium">{r.medName}</span> at {r.time}</div><div className="flex gap-2"><button onClick={()=>toggleReminder(r.id)} className={r.enabled ? "text-green-600" : "text-gray-400"}>{r.enabled ? "ON" : "OFF"}</button><button onClick={()=>deleteReminder(r.id)} className="text-red-500"><Trash2 size={16} /></button></div></div>)}</div>
        <p className="text-xs text-gray-400 text-center mt-4">🔔 Browser notifications must be allowed. Reminders fire every minute.</p>
      </div>
    </div>
  );
}



