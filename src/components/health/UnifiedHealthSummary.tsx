"use client";
import { useEffect, useState } from "react";
import { Pill, Calendar, Heart } from "lucide-react";

export default function UnifiedHealthSummary({ userId }: { userId: string }) {
  const [summary, setSummary] = useState({ medsToday: 0, upcomingApts: 0, latestHR: null });
  useEffect(() => {
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${userId}`) || "[]");
    const apts = JSON.parse(localStorage.getItem(`mediverse_appointments_${userId}`) || "[]");
    const vitals = JSON.parse(localStorage.getItem(`mediverse_vitals_${userId}`) || "[]");
    const today = new Date().toISOString().split("T")[0];
    const medsToday = meds.filter((m: any) => m.times?.length).length;
    const upcomingApts = apts.filter((a: any) => a.date >= today).length;
    const latestHR = vitals.filter((v: any) => v.type === "heartRate").pop()?.value || null;
    setSummary({ medsToday, upcomingApts, latestHR });
  }, [userId]);
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30">
      <h2 className="font-semibold text-gray-800 mb-2">Health Snapshot</h2>
      <div className="flex justify-between">
        <div><Pill size={20} className="text-green-500" /><p className="text-sm">Today's meds</p><p className="text-lg font-bold">{summary.medsToday}</p></div>
        <div><Calendar size={20} className="text-orange-500" /><p className="text-sm">Appointments</p><p className="text-lg font-bold">{summary.upcomingApts}</p></div>
        {summary.latestHR && <div><Heart size={20} className="text-red-500" /><p className="text-sm">Heart rate</p><p className="text-lg font-bold">{summary.latestHR} bpm</p></div>}
      </div>
    </div>
  );
}
