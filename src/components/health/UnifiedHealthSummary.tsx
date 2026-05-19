"use client";
import { useEffect, useState } from "react";
import { Activity, Heart, Brain, TrendingUp, Calendar, Pill } from "lucide-react";

export default function UnifiedHealthSummary({ userId }: { userId: string }) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const meds = JSON.parse(localStorage.getItem(`mediverse_medications_${userId}`) || "[]");
      const appointments = JSON.parse(localStorage.getItem(`mediverse_appointments_${userId}`) || "[]");
      const health = JSON.parse(localStorage.getItem(`mediverse_healthMetrics_${userId}`) || "[]");
      const today = new Date().toISOString().split("T")[0];
      const upcomingAppointments = appointments.filter((a: any) => a.date >= today).length;
      const medsToday = meds.filter((m: any) => m.times?.length).length;
      const latestWeight = health.filter((h: any) => h.type === "weight").sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      const latestSteps = health.filter((h: any) => h.type === "steps").sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      setSummary({ medsToday, upcomingAppointments, latestWeight, latestSteps, totalHealthEntries: health.length });
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) return <div className="bg-white rounded-xl p-4 shadow animate-pulse h-32"></div>;
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <h3 className="font-semibold flex items-center gap-2 mb-3"><Activity className="w-5 h-5 text-blue-500" /> Health Snapshot</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-2 bg-blue-50 rounded-lg"><Pill className="w-5 h-5 text-blue-600 mx-auto" /><p className="text-xs text-gray-500">Today's Meds</p><p className="text-xl font-bold">{summary?.medsToday}</p></div>
        <div className="text-center p-2 bg-green-50 rounded-lg"><Calendar className="w-5 h-5 text-green-600 mx-auto" /><p className="text-xs text-gray-500">Upcoming</p><p className="text-xl font-bold">{summary?.upcomingAppointments}</p></div>
        {summary?.latestWeight && <div className="text-center p-2 bg-purple-50 rounded-lg"><Heart className="w-5 h-5 text-purple-600 mx-auto" /><p className="text-xs text-gray-500">Weight</p><p className="text-sm font-bold">{summary.latestWeight.value} kg</p></div>}
        {summary?.latestSteps && <div className="text-center p-2 bg-orange-50 rounded-lg"><TrendingUp className="w-5 h-5 text-orange-600 mx-auto" /><p className="text-xs text-gray-500">Steps</p><p className="text-sm font-bold">{summary.latestSteps.value.toLocaleString()}</p></div>}
      </div>
    </div>
  );
}
