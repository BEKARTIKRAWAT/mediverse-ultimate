"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Heart, Plus, Trash2 } from "lucide-react";

export default function BPTracker() {
  const { user } = useAuth();
  const [readings, setReadings] = useState<{id:string, systolic:number, diastolic:number, date:string}[]>([]);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_bp_${user.id}`);
    if (saved) setReadings(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_bp_${user.id}`, JSON.stringify(readings));
  }, [readings, user]);

  const addReading = () => {
    if (!systolic || !diastolic) return;
    setReadings([...readings, { id: Date.now().toString(), systolic: parseInt(systolic), diastolic: parseInt(diastolic), date: new Date().toISOString() }]);
    setSystolic(""); setDiastolic("");
  };

  const deleteReading = (id: string) => setReadings(readings.filter(r => r.id !== id));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Heart className="text-red-500" /> Blood Pressure Tracker</h1>
        <div className="flex gap-2 mb-4"><input type="number" placeholder="Systolic" value={systolic} onChange={e=>setSystolic(e.target.value)} className="border rounded p-2 w-1/2" /><input type="number" placeholder="Diastolic" value={diastolic} onChange={e=>setDiastolic(e.target.value)} className="border rounded p-2 w-1/2" /><button onClick={addReading} className="bg-blue-600 text-white px-4 rounded-xl"><Plus size={18} /></button></div>
        <div className="space-y-2">{readings.map(r=><div key={r.id} className="flex justify-between items-center p-2 border-b"><span>{new Date(r.date).toLocaleDateString()} – {r.systolic}/{r.diastolic} mmHg</span><button onClick={()=>deleteReading(r.id)} className="text-red-500"><Trash2 size={16} /></button></div>)}</div>
      </div>
    </div>
  );
}

