"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";

export default function HealthJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<{id:string, note:string, date:string}[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_journal_${user.id}`);
    if (saved) setEntries(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_journal_${user.id}`, JSON.stringify(entries));
  }, [entries, user]);

  const addEntry = () => {
    if (!note.trim()) return;
    setEntries([{ id: Date.now().toString(), note, date: new Date().toISOString() }, ...entries]);
    setNote("");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="text-green-600" /> Health Journal</h1>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Write about your health, symptoms, or feelings..." className="w-full border rounded-xl p-3 h-28 mb-2" />
        <button onClick={addEntry} className="bg-green-600 text-white px-4 py-2 rounded-xl mb-4"><Plus size={18} /> Add Entry</button>
        <div className="space-y-3">{entries.map(e=><div key={e.id} className="border-l-4 border-green-300 p-3 bg-gray-50 rounded-r-xl"><p className="text-xs text-gray-400">{new Date(e.date).toLocaleString()}</p><p className="text-gray-700">{e.note}</p><button onClick={()=>setEntries(entries.filter(i=>i.id!==e.id))} className="text-red-500 text-sm mt-1">Delete</button></div>)}</div>
      </div>
    </div>
  );
}
