"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Pill, Plus, Trash2, CheckCircle, Clock } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  taken: { date: string; time: string; taken: boolean }[];
  startDate: string;
}

export default function MedicationTracker() {
  const { user } = useAuth();
  const [meds, setMeds] = useState<Medication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", times: ["09:00"] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_meds_${user.id}`);
    if (saved) setMeds(JSON.parse(saved));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_meds_${user.id}`, JSON.stringify(meds));
  }, [meds, user]);

  const addMed = () => {
    if (!newMed.name) return;
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage,
      times: newMed.times,
      taken: [],
      startDate: new Date().toISOString().split("T")[0],
    };
    setMeds([...meds, newMedication]);
    setNewMed({ name: "", dosage: "", times: ["09:00"] });
    setShowForm(false);
  };

  const deleteMed = (id: string) => setMeds(meds.filter(m => m.id !== id));

  const toggleTaken = (medId: string, time: string) => {
    const today = new Date().toISOString().split("T")[0];
    setMeds(prev => prev.map(med => {
      if (med.id !== medId) return med;
      const existing = med.taken.find(t => t.date === today && t.time === time);
      let newTaken;
      if (existing) {
        newTaken = med.taken.filter(t => !(t.date === today && t.time === time));
      } else {
        newTaken = [...med.taken, { date: today, time, taken: true }];
      }
      return { ...med, taken: newTaken };
    }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-3">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Medication Tracker</h1>
          <p className="text-gray-500">Your medications, stored locally</p>
        </div>
        <button onClick={() => setShowForm(true)} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18}/> Add Medication</button>
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">New Medication</h2>
            <input type="text" placeholder="Name" value={newMed.name} onChange={e=>setNewMed({...newMed, name:e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <input type="text" placeholder="Dosage (e.g., 500mg)" value={newMed.dosage} onChange={e=>setNewMed({...newMed, dosage:e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <div><label>Times</label><div className="flex gap-2 mt-1">{newMed.times.map((t,i)=> <span key={i} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">{t}<button onClick={()=>setNewMed({...newMed, times: newMed.times.filter((_,idx)=>idx!==i)})}>✕</button></span>)}<button onClick={()=>setNewMed({...newMed, times: [...newMed.times, "12:00"]})} className="text-blue-500 text-sm">+ Add time</button></div></div>
            <div className="flex gap-2 mt-4"><button onClick={addMed} className="bg-green-500 text-white px-4 py-2 rounded-xl">Save</button><button onClick={()=>setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded-xl">Cancel</button></div>
          </div>
        )}
        <div className="space-y-4">
          {meds.map(m => (
            <div key={m.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between"><div><h3 className="font-bold">{m.name}</h3><p className="text-sm text-gray-600">{m.dosage}</p></div><button onClick={()=>deleteMed(m.id)} className="text-red-500"><Trash2 size={18}/></button></div>
              <div className="mt-2"><p className="text-sm font-medium">Today's doses:</p><div className="flex gap-2 mt-1">{m.times.map(t=> { const taken = m.taken.some(tk=>tk.date===new Date().toISOString().split("T")[0] && tk.time===t); return <button key={t} onClick={()=>toggleTaken(m.id,t)} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${taken ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{taken ? <CheckCircle size={14}/> : <Clock size={14}/>}{t}</button>;})}</div></div>
            </div>
          ))}
          {meds.length === 0 && !loading && <p className="text-center text-gray-500 py-8">No medications added. Click "Add Medication".</p>}
        </div>
      </div>
    </div>
  );
}


