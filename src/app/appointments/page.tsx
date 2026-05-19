"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Phone, Plus, Trash2, Edit } from "lucide-react";

export default function Appointments() {
  const { user, isLoading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ doctorName: "", specialty: "", date: "", time: "", location: "", phone: "", notes: "" });

  useEffect(() => { if (user) { const saved = localStorage.getItem(`mediverse_appointments_${user.id}`); if (saved) setAppointments(JSON.parse(saved)); } }, [user]);
  useEffect(() => { if (user) localStorage.setItem(`mediverse_appointments_${user.id}`, JSON.stringify(appointments)); }, [appointments, user]);

  const saveAppointment = () => { if (!form.doctorName || !form.date || !form.time) return; setAppointments([...appointments, { id: Date.now().toString(), ...form }]); setForm({ doctorName: "", specialty: "", date: "", time: "", location: "", phone: "", notes: "" }); setShowForm(false); };
  const deleteAppointment = (id: string) => setAppointments(appointments.filter(a => a.id !== id));

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"><div className="max-w-4xl mx-auto"><div className="text-center mb-6"><div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-3"><Calendar className="w-8 h-8 text-white" /></div><h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Appointment Scheduler</h1><p className="text-gray-500">Manage your doctor visits</p></div>
      <button onClick={()=>setShowForm(true)} className="mb-4 bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18}/> New Appointment</button>
      {showForm && (<div className="bg-white rounded-2xl shadow-lg p-6 mb-6"><h2 className="text-xl font-semibold mb-4">Add Appointment</h2><div className="grid grid-cols-2 gap-3"><input placeholder="Doctor Name" value={form.doctorName} onChange={e=>setForm({...form, doctorName:e.target.value})} className="border rounded-xl p-2" /><input placeholder="Specialty" value={form.specialty} onChange={e=>setForm({...form, specialty:e.target.value})} className="border rounded-xl p-2" /><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="border rounded-xl p-2" /><input type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} className="border rounded-xl p-2" /><input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="border rounded-xl p-2 col-span-2" /><input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="border rounded-xl p-2 col-span-2" /><textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className="border rounded-xl p-2 col-span-2" rows={2} /></div><div className="flex gap-2 mt-4"><button onClick={saveAppointment} className="bg-orange-500 text-white px-4 py-2 rounded-xl">Save</button><button onClick={()=>setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded-xl">Cancel</button></div></div>)}
      <div className="space-y-3">{appointments.map(a=><div key={a.id} className="bg-white rounded-xl shadow-md p-4"><div className="flex justify-between"><div><h3 className="font-bold">{a.doctorName}</h3><p className="text-sm text-gray-600">{a.specialty}</p></div><button onClick={()=>deleteAppointment(a.id)} className="text-red-500"><Trash2 size={18}/></button></div><div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600"><div className="flex items-center gap-1"><Calendar size={14}/> {a.date}</div><div className="flex items-center gap-1"><Clock size={14}/> {a.time}</div>{a.location && <div className="flex items-center gap-1 col-span-2"><MapPin size={14}/> {a.location}</div>}{a.phone && <div className="flex items-center gap-1 col-span-2"><Phone size={14}/> {a.phone}</div>}</div></div>)}</div></div></div>
  );
}

