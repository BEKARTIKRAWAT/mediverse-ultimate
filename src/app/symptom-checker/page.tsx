export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Stethoscope, AlertCircle, CheckCircle, Thermometer, Activity, Loader2, Plus, Trash2 } from "lucide-react";

interface Symptom { id: string; name: string; severity: number; duration: string; }

export default function SymptomChecker() {
  const { user, isLoading: authLoading } = useAuth();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [severity, setSeverity] = useState(3);
  const [duration, setDuration] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const symptomOptions = ["Headache","Fever","Cough","Fatigue","Nausea","Chest pain","Shortness of breath","Sore throat","Muscle pain","Dizziness"];

  const addSymptom = () => { if (!currentSymptom) return; setSymptoms([...symptoms, { id: Date.now().toString(), name: currentSymptom, severity, duration: duration || "1-3 days" }]); setCurrentSymptom(""); setSeverity(3); setDuration(""); setAnalysis(null); };
  const removeSymptom = (id: string) => { setSymptoms(symptoms.filter(s => s.id !== id)); setAnalysis(null); };
  const analyze = () => {
    if (symptoms.length === 0) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const hasChest = symptoms.some(s => s.name === "Chest pain" || s.name === "Shortness of breath");
      const hasFever = symptoms.some(s => s.name === "Fever" && s.severity >= 3);
      if (hasChest) setAnalysis({ urgency: "high", conditions: ["Cardiac issue","Anxiety","Respiratory infection"], recommendations: ["Seek immediate medical attention","Do not drive yourself","Stay calm"], disclaimer: "⚠️ Urgent: Call emergency services." });
      else if (hasFever) setAnalysis({ urgency: "medium", conditions: ["Viral infection","Flu","COVID-19"], recommendations: ["Monitor temperature","Stay hydrated","Rest","Consult doctor if fever >103°F"], disclaimer: "Monitor symptoms. See doctor if worsens." });
      else setAnalysis({ urgency: "low", conditions: ["Mild viral illness","Stress","Allergies"], recommendations: ["Rest","Hydrate","Monitor for 48 hours"], disclaimer: "Self-care is likely sufficient." });
      setIsAnalyzing(false);
    }, 1000);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto"><div className="text-center mb-6"><div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3"><Stethoscope className="w-8 h-8 text-white" /></div><h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Symptom Checker</h1><p className="text-gray-500">Initial assessment – Not a diagnosis</p></div>
        <div className="grid md:grid-cols-2 gap-6"><div className="bg-white rounded-2xl shadow-lg p-6"><h2 className="text-xl font-semibold mb-4">Add Symptoms</h2><select value={currentSymptom} onChange={e=>setCurrentSymptom(e.target.value)} className="w-full border rounded-xl p-2 mb-2"><option value="">Select symptom</option>{symptomOptions.map(opt=><option key={opt}>{opt}</option>)}</select><div className="mb-2"><label>Severity (1-5)</label><div className="flex gap-2 mt-1">{[...Array(5)].map((_,i)=><button key={i} onClick={()=>setSeverity(i+1)} className={`flex-1 py-1 rounded ${severity===i+1?'bg-purple-500 text-white':'bg-gray-100'}`}>{i+1}</button>)}</div></div><input placeholder="Duration (e.g., 2 days)" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full border rounded-xl p-2 mb-2" /><button onClick={addSymptom} className="w-full bg-purple-500 text-white py-2 rounded-xl mb-4">+ Add Symptom</button>{symptoms.map(s=><div key={s.id} className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"><div><strong>{s.name}</strong> (Severity {s.severity}/5) - {s.duration}</div><button onClick={()=>removeSymptom(s.id)} className="text-red-500"><Trash2 size={16}/></button></div>)}<button onClick={analyze} disabled={symptoms.length===0||isAnalyzing} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl">{isAnalyzing?<Loader2 className="animate-spin mx-auto"/>:"Analyze Symptoms"}</button></div>
          <div className="bg-white rounded-2xl shadow-lg p-6"><h2 className="text-xl font-semibold mb-4">AI Analysis</h2>{!analysis?(<div className="text-center text-gray-400 py-12"><AlertCircle className="w-12 h-12 mx-auto mb-2"/>Add symptoms and analyze</div>):(<div><div className={`p-3 rounded-xl mb-4 ${analysis.urgency==='high'?'bg-red-100 text-red-800':analysis.urgency==='medium'?'bg-yellow-100 text-yellow-800':'bg-green-100 text-green-800'}`}><strong>Urgency: {analysis.urgency}</strong></div><div><strong>Possible conditions</strong><ul className="list-disc ml-6 mt-1">{analysis.conditions.map((c,i)=><li key={i}>{c}</li>)}</ul></div><div className="mt-3"><strong>Recommendations</strong><ul className="list-disc ml-6 mt-1">{analysis.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul></div><div className="text-xs text-gray-400 italic mt-3">{analysis.disclaimer}</div></div>)}</div></div>
        <p className="text-center text-xs text-gray-400 mt-6">⚕️ This is not a medical diagnosis. Always consult a doctor.</p>
      </div>
    </div>
  );
}



