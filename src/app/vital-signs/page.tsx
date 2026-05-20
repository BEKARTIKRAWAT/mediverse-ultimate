export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Heart, Activity, Thermometer, Droplet, Plus, Trash2, LineChart, Calendar } from "lucide-react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Vital {
  id: string;
  type: "heartRate" | "bpSystolic" | "bpDiastolic" | "temperature" | "oxygen";
  value: number;
  date: string;
  notes?: string;
}

export default function VitalSignsPage() {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newVital, setNewVital] = useState({ type: "heartRate", value: "", date: new Date().toISOString().split("T")[0], notes: "" });

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_vitals_${user?.id}`);
    if (saved) setVitals(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_vitals_${user?.id}`, JSON.stringify(vitals));
  }, [vitals, user]);

  const addVital = () => {
    if (!newVital.value) return;
    setVitals([...vitals, { id: Date.now().toString(), type: newVital.type as any, value: parseFloat(newVital.value), date: newVital.date, notes: newVital.notes }]);
    setNewVital({ type: "heartRate", value: "", date: new Date().toISOString().split("T")[0], notes: "" });
    setShowForm(false);
  };

  const deleteVital = (id: string) => setVitals(vitals.filter(v => v.id !== id));

  const chartData = vitals.filter(v => v.type === "heartRate").sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(v => ({ date: new Date(v.date).toLocaleDateString(), value: v.value }));
  const latestHR = vitals.filter(v => v.type === "heartRate").sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 shadow-lg mb-4"><Heart className="w-8 h-8 text-white" /></div><h1 className="text-3xl md:text-4xl font-bold text-gray-800">Vital Signs Monitor</h1><p className="text-gray-500">Track heart rate, BP, temperature, oxygen</p></div>
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <button onClick={() => setShowForm(true)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={16} /> Add Reading</button>
          {showForm && (<div className="border rounded-xl p-4 mb-4 bg-gray-50"><select value={newVital.type} onChange={e => setNewVital({...newVital, type: e.target.value})} className="w-full border rounded p-2 mb-2"><option value="heartRate">Heart Rate (bpm)</option><option value="bpSystolic">Blood Pressure - Systolic</option><option value="bpDiastolic">Blood Pressure - Diastolic</option><option value="temperature">Temperature (°C)</option><option value="oxygen">Oxygen Saturation (%)</option></select><input type="number" placeholder="Value" value={newVital.value} onChange={e => setNewVital({...newVital, value: e.target.value})} className="w-full border rounded p-2 mb-2" /><input type="date" value={newVital.date} onChange={e => setNewVital({...newVital, date: e.target.value})} className="w-full border rounded p-2 mb-2" /><input type="text" placeholder="Notes (optional)" value={newVital.notes} onChange={e => setNewVital({...newVital, notes: e.target.value})} className="w-full border rounded p-2 mb-2" /><div className="flex gap-2"><button onClick={addVital} className="bg-green-600 text-white px-4 py-2 rounded">Save</button><button onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button></div></div>)}
          {latestHR && <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"><div className="bg-red-50 rounded-xl p-3 text-center"><Heart className="w-6 h-6 text-red-500 mx-auto" /><p className="text-sm text-gray-600">Latest Heart Rate</p><p className="text-2xl font-bold">{latestHR.value} bpm</p><p className="text-xs text-gray-400">{new Date(latestHR.date).toLocaleDateString()}</p></div></div>}
          {chartData.length > 0 && <div className="h-64 mb-6"><ResponsiveContainer width="100%" height="100%"><ReLineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={['auto', 'auto']} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} /></ReLineChart></ResponsiveContainer></div>}
          <div className="space-y-2 max-h-96 overflow-y-auto">{vitals.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(v => (<div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><p className="font-medium capitalize">{v.type.replace("bp", "BP ")}: {v.value} {v.type === "heartRate" ? "bpm" : v.type.includes("bp") ? "mmHg" : v.type === "temperature" ? "°C" : "%"}</p><p className="text-xs text-gray-400">{new Date(v.date).toLocaleDateString()} {v.notes && `• ${v.notes}`}</p></div><button onClick={() => deleteVital(v.id)} className="text-red-500"><Trash2 size={16} /></button></div>))}</div>
        </div>
      </div>
    </div>
  );
}





