"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Activity, Heart, Footprints, Moon, Zap, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LiveDashboard() {
  const { user } = useAuth();
  const [liveData, setLiveData] = useState({ heartRate: 72, steps: 0, sleep: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    // Simulate real‑time data every 5 seconds
    const interval = setInterval(() => {
      const newHeart = Math.floor(60 + Math.random() * 30);
      const newSteps = Math.floor(Math.random() * 200);
      const newSleep = Math.random() * 2;
      setLiveData({ heartRate: newHeart, steps: newSteps, sleep: newSleep });
      setHistory(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), heartRate: newHeart, steps: newSteps, sleep: newSleep }]);
      // Smart alert
      if (newHeart > 100) setAlert("⚠️ High heart rate detected (>100 bpm). Please rest.");
      else if (newHeart < 50) setAlert("⚠️ Low heart rate detected (<50 bpm). Consult a doctor.");
      else setAlert(null);
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6"><Zap className="w-12 h-12 text-yellow-500 mx-auto" /><h1 className="text-3xl font-bold text-gray-800">Real‑Time Health Dashboard</h1><p className="text-gray-500">Live simulated health metrics</p></div>
        {alert && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"><AlertTriangle /> {alert}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 text-center"><Heart className="w-8 h-8 text-red-500 mx-auto" /><p className="text-gray-500">Heart Rate</p><p className="text-3xl font-bold">{liveData.heartRate} bpm</p></div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center"><Footprints className="w-8 h-8 text-green-500 mx-auto" /><p className="text-gray-500">Steps (last 5s)</p><p className="text-3xl font-bold">{liveData.steps}</p></div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center"><Moon className="w-8 h-8 text-indigo-500 mx-auto" /><p className="text-gray-500">Sleep (last 5s hrs)</p><p className="text-3xl font-bold">{liveData.sleep.toFixed(1)}</p></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-6"><h2 className="text-xl font-semibold mb-4">Heart Rate Trend (last 20 updates)</h2><div className="h-64"><ResponsiveContainer><LineChart data={history}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis domain={[40, 140]} /><Tooltip /><Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
        <p className="text-xs text-gray-400 text-center mt-8">⚠️ Simulated data for demo. Connect real wearables via API for actual readings.</p>
      </div>
    </div>
  );
}




