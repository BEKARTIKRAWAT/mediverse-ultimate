"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Activity, Heart, Weight, Moon, Footprints, Plus, TrendingUp, LineChart } from "lucide-react";

export default function HealthAnalytics() {
  const { user, isLoading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMetric, setNewMetric] = useState({ type: "weight", value: "", date: new Date().toISOString().split("T")[0] });

  useEffect(() => { if (user) { const saved = localStorage.getItem(`mediverse_health_${user.id}`); if (saved) setMetrics(JSON.parse(saved)); } }, [user]);
  useEffect(() => { if (user) localStorage.setItem(`mediverse_health_${user.id}`, JSON.stringify(metrics)); }, [metrics, user]);

  const addMetric = () => { if (!newMetric.value) return; setMetrics([...metrics, { id: Date.now().toString(), ...newMetric, value: parseFloat(newMetric.value) }]); setNewMetric({ type: "weight", value: "", date: new Date().toISOString().split("T")[0] }); setShowForm(false); };
  const latestWeight = metrics.filter(m => m.type === "weight").sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())[0];
  const latestSteps = metrics.filter(m => m.type === "steps").sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())[0];

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"><div className="max-w-4xl mx-auto"><div className="text-center mb-6"><div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3"><Activity className="w-8 h-8 text-white" /></div><h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Health Analytics</h1><p className="text-gray-500">Track your wellness journey</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"><div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex justify-between"><div><p className="text-gray-500 text-sm">Latest Weight</p><p className="text-2xl font-bold">{latestWeight ? `${latestWeight.value} kg` : "Not tracked"}</p></div><Weight className="w-8 h-8 text-purple-500"/></div></div><div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex justify-between"><div><p className="text-gray-500 text-sm">Latest Steps</p><p className="text-2xl font-bold">{latestSteps ? latestSteps.value.toLocaleString() : "Not tracked"}</p></div><Footprints className="w-8 h-8 text-green-500"/></div></div></div>
      <button onClick={()=>setShowForm(true)} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18}/> Add Health Data</button>
      {showForm && (<div className="bg-white rounded-2xl shadow-lg p-6 mb-6"><h2 className="text-xl font-semibold mb-4">Log Health Metric</h2><select value={newMetric.type} onChange={e=>setNewMetric({...newMetric, type:e.target.value})} className="w-full border rounded-xl p-2 mb-2"><option value="weight">Weight (kg)</option><option value="steps">Steps</option><option value="sleep">Sleep (hours)</option><option value="systolic">Blood Pressure - Systolic</option></select><input type="number" step="any" placeholder="Value" value={newMetric.value} onChange={e=>setNewMetric({...newMetric, value:e.target.value})} className="w-full border rounded-xl p-2 mb-2" /><input type="date" value={newMetric.date} onChange={e=>setNewMetric({...newMetric, date:e.target.value})} className="w-full border rounded-xl p-2 mb-2" /><div className="flex gap-2"><button onClick={addMetric} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Save</button><button onClick={()=>setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded-xl">Cancel</button></div></div>)}
      <div className="bg-white rounded-2xl shadow-lg p-4"><h2 className="font-semibold mb-2">Recent Entries</h2>{metrics.length===0 ? <p className="text-gray-400 text-center py-4">No data yet. Start tracking your health!</p> : <div className="space-y-2 max-h-96 overflow-y-auto">{metrics.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).map(m=><div key={m.id} className="flex justify-between border-b py-2"><span className="capitalize">{m.type}</span><span>{m.value} {m.type==='weight'?'kg':m.type==='steps'?'steps':m.type==='sleep'?'hrs':'mmHg'}</span><span className="text-gray-400 text-sm">{m.date}</span></div>)}</div>}</div>
    </div></div>
  );
}

