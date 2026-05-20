"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Activity, Loader2, Send, Brain } from "lucide-react";

export default function AISymptomChecker() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: `I have these symptoms: ${symptoms}. Give me a brief, non‑alarming possible cause and home care advice. Do NOT diagnose, just suggest.` }] })
      });
      const data = await res.json();
      setAnalysis(data.reply || "Could not analyze. Please consult a doctor.");
    } catch { setAnalysis("Error. Please try again."); }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Brain className="text-purple-500" /> AI Symptom Checker (Advanced)</h1>
        <textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} placeholder="Describe your symptoms (e.g., 'headache, fatigue, mild fever for 2 days')" className="w-full border rounded-xl p-3 h-28 mb-2" />
        <button onClick={analyze} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <Send size={16} />} Analyze</button>
        {analysis && <div className="mt-4 p-4 bg-purple-50 rounded-xl whitespace-pre-wrap">{analysis}</div>}
        <p className="text-xs text-gray-400 mt-4">⚠️ Not a medical diagnosis. Always consult a doctor.</p>
      </div>
    </div>
  );
}




