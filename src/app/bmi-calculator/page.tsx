"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Activity, Plus, Trash2 } from "lucide-react";

export default function BMICalculator() {
  const { user } = useAuth();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [history, setHistory] = useState<{id:string, bmi:number, date:string}[]>([]);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_bmi_${user.id}`);
    if (saved) setHistory(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_bmi_${user.id}`, JSON.stringify(history));
  }, [history, user]);

  const calculate = () => {
    if (!weight || !height) return;
    const heightM = parseFloat(height) / 100;
    const bmiValue = parseFloat(weight) / (heightM * heightM);
    setBmi(bmiValue);
    setHistory([{ id: Date.now().toString(), bmi: bmiValue, date: new Date().toISOString() }, ...history]);
    setWeight(""); setHeight("");
  };

  const getCategory = (b: number) => {
    if (b < 18.5) return "Underweight";
    if (b < 25) return "Normal";
    if (b < 30) return "Overweight";
    return "Obese";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Activity className="text-purple-500" /> BMI Calculator</h1>
        <div className="space-y-3"><input type="number" placeholder="Weight (kg)" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full border rounded p-2" /><input type="number" placeholder="Height (cm)" value={height} onChange={e=>setHeight(e.target.value)} className="w-full border rounded p-2" /><button onClick={calculate} className="w-full bg-purple-600 text-white py-2 rounded-xl">Calculate BMI</button></div>
        {bmi && <div className="mt-4 p-3 bg-purple-50 rounded-xl"><p className="text-center text-2xl font-bold">{bmi.toFixed(1)}</p><p className="text-center text-gray-600">{getCategory(bmi)}</p></div>}
        {history.length > 0 && <div className="mt-4"><h3 className="font-semibold mb-2">History</h3>{history.slice(0,5).map(h=><div key={h.id} className="flex justify-between items-center p-2 border-b"><span>{new Date(h.date).toLocaleDateString()}</span><span>{h.bmi.toFixed(1)} ({getCategory(h.bmi)})</span><button onClick={()=>setHistory(history.filter(i=>i.id!==h.id))} className="text-red-500"><Trash2 size={14} /></button></div>)}</div>}
      </div>
    </div>
  );
}


