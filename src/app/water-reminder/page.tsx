export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Droplet, Plus, Trash2, TrendingUp } from "lucide-react";

export default function WaterReminder() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<{id:string, cups:number, date:string}[]>([]);
  const [cups, setCups] = useState("");

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_water_${user?.id}`);
    if (saved) setLogs(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_water_${user?.id}`, JSON.stringify(logs));
  }, [logs, user]);

  const addLog = () => {
    if (!cups) return;
    setLogs([...logs, { id: Date.now().toString(), cups: parseInt(cups), date: new Date().toISOString() }]);
    setCups("");
  };

  const totalToday = logs.filter(l => new Date(l.date).toDateString() === new Date().toDateString()).reduce((s,l)=>s+l.cups,0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Droplet className="text-blue-500" /> Water Reminder</h1>
        <div className="text-center mb-4"><p className="text-gray-600">Today's intake</p><p className="text-4xl font-bold text-blue-600">{totalToday} cups</p><p className="text-sm text-gray-500">Goal: 8 cups</p></div>
        <div className="flex gap-2 mb-4"><input type="number" placeholder="Cups drunk" value={cups} onChange={e=>setCups(e.target.value)} className="border rounded p-2 flex-1" /><button onClick={addLog} className="bg-blue-600 text-white px-4 rounded-xl"><Plus size={18} /></button></div>
        <div className="space-y-2">{logs.slice().reverse().slice(0,10).map(l=><div key={l.id} className="flex justify-between items-center p-2 border-b"><span>{new Date(l.date).toLocaleString()} – {l.cups} cup(s)</span><button onClick={()=>setLogs(logs.filter(i=>i.id!==l.id))} className="text-red-500"><Trash2 size={16} /></button></div>)}</div>
      </div>
    </div>
  );
}




