"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Moon, Plus, Trash2, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SleepTracker() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<{id:string, hours:number, date:string}[]>([]);
  const [hours, setHours] = useState("");

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_sleep_${user.id}`);
    if (saved) setEntries(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_sleep_${user.id}`, JSON.stringify(entries));
  }, [entries, user]);

  const addEntry = () => {
    if (!hours) return;
    setEntries([...entries, { id: Date.now().toString(), hours: parseFloat(hours), date: new Date().toISOString() }]);
    setHours("");
  };

  const chartData = [...entries].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()).slice(-7).map(e=>({ date: new Date(e.date).toLocaleDateString(), hours: e.hours }));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Moon className="text-indigo-500" /> Sleep Tracker</h1>
        <div className="flex gap-2 mb-4"><input type="number" step="0.5" placeholder="Hours slept" value={hours} onChange={e=>setHours(e.target.value)} className="border rounded p-2 flex-1" /><button onClick={addEntry} className="bg-blue-600 text-white px-4 rounded-xl"><Plus size={18} /></button></div>
        {chartData.length > 0 && <div className="h-48 mb-4"><ResponsiveContainer><LineChart data={chartData}><XAxis dataKey="date" /><YAxis domain={[0,12]} /><Tooltip /><Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} /></LineChart></ResponsiveContainer></div>}
        <div className="space-y-2">{entries.slice().reverse().map(e=><div key={e.id} className="flex justify-between items-center p-2 border-b"><span>{new Date(e.date).toLocaleDateString()} – {e.hours} hrs</span><button onClick={()=>setEntries(entries.filter(i=>i.id!==e.id))} className="text-red-500"><Trash2 size={16} /></button></div>)}</div>
      </div>
    </div>
  );
}

