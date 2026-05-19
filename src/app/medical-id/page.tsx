"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { IdCard, Save } from "lucide-react";

export default function MedicalID() {
  const { user } = useAuth();
  const [info, setInfo] = useState({ bloodType: "", allergies: "", conditions: "", emergencyContact: "" });

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_medicalid_${user.id}`);
    if (saved) setInfo(JSON.parse(saved));
  }, [user]);

  const saveInfo = () => {
    if (user) localStorage.setItem(`mediverse_medicalid_${user.id}`, JSON.stringify(info));
    alert("Medical ID saved!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <IdCard className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center mb-4">Medical ID</h1>
        <div className="space-y-3"><input type="text" placeholder="Blood Type" value={info.bloodType} onChange={e=>setInfo({...info, bloodType:e.target.value})} className="w-full border rounded p-2" /><input type="text" placeholder="Allergies" value={info.allergies} onChange={e=>setInfo({...info, allergies:e.target.value})} className="w-full border rounded p-2" /><input type="text" placeholder="Chronic Conditions" value={info.conditions} onChange={e=>setInfo({...info, conditions:e.target.value})} className="w-full border rounded p-2" /><input type="text" placeholder="Emergency Contact" value={info.emergencyContact} onChange={e=>setInfo({...info, emergencyContact:e.target.value})} className="w-full border rounded p-2" /><button onClick={saveInfo} className="w-full bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"><Save size={16} /> Save Medical ID</button></div>
      </div>
    </div>
  );
}

