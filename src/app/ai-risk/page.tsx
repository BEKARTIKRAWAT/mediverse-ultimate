"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Activity, Heart, Brain, AlertTriangle, Shield, Calendar, Phone, MessageCircle, TrendingUp, Loader2, CheckCircle, XCircle } from "lucide-react";

interface RiskScore {
  condition: string;
  risk: "low" | "medium" | "high";
  percentage: number;
  recommendation: string;
}

export default function AIRiskDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [risks, setRisks] = useState<RiskScore[]>([]);
  const [symptoms, setSymptoms] = useState("");
  const [triageResult, setTriageResult] = useState<string | null>(null);
  const [telemedicine, setTelemedicine] = useState(false);

  useEffect(() => {
    if (!user) return;
    const analyzeHealth = async () => {
      setLoading(true);
      const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user.id}`) || "[]");
      const health = JSON.parse(localStorage.getItem(`mediverse_health_${user.id}`) || "[]");
      const mood = JSON.parse(localStorage.getItem(`mediverse_mood_${user.id}`) || "[]");
      
      const hasHypertension = meds.some((m: any) => m.name.toLowerCase().includes("lisinopril") || m.name.toLowerCase().includes("amlodipine"));
      const hasDiabetes = meds.some((m: any) => m.name.toLowerCase().includes("metformin") || m.name.toLowerCase().includes("insulin"));
      const highBP = health.some((h: any) => h.type === "systolic" && h.value > 130);
      const steps = health.filter((h: any) => h.type === "steps").slice(-7).reduce((a: number, b: any) => a + b.value, 0) / 7;
      const sedentary = steps < 5000;
      const recentMood = mood.slice(-3).filter((m: any) => m.mood === "stressed" || m.mood === "sad").length;
      
      const newRisks: RiskScore[] = [
        {
          condition: "Diabetes",
          risk: hasDiabetes ? "high" : sedentary ? "medium" : "low",
          percentage: hasDiabetes ? 85 : sedentary ? 45 : 15,
          recommendation: hasDiabetes ? "Continue medication and monitor blood sugar." : sedentary ? "Increase daily steps to 8,000+" : "Maintain healthy diet.",
        },
        {
          condition: "Heart Disease",
          risk: highBP ? "high" : hasHypertension ? "medium" : "low",
          percentage: highBP ? 78 : hasHypertension ? 52 : 22,
          recommendation: highBP ? "Consult doctor immediately. Monitor BP daily." : hasHypertension ? "Take meds regularly, reduce salt." : "Exercise 30 min daily.",
        },
        {
          condition: "Hypertension",
          risk: highBP ? "high" : hasHypertension ? "medium" : "low",
          percentage: highBP ? 88 : hasHypertension ? 60 : 28,
          recommendation: highBP ? "Check BP twice daily. Limit sodium." : hasHypertension ? "Stay on medication, monitor weekly." : "Low salt diet, avoid stress.",
        },
        {
          condition: "Stress & Anxiety",
          risk: recentMood >= 2 ? "high" : recentMood === 1 ? "medium" : "low",
          percentage: recentMood >= 2 ? 72 : recentMood === 1 ? 45 : 18,
          recommendation: recentMood >= 2 ? "Practice meditation, talk to a therapist." : (recentMood === 1 ? "Try breathing exercises, walk daily." : "Good mental state. Keep journaling."),
        },
      ];
      setRisks(newRisks);
      setLoading(false);
    };
    analyzeHealth();
  }, [user]);

  const analyzeSymptoms = () => {
    if (!symptoms.trim()) return;
    const text = symptoms.toLowerCase();
    if (text.includes("chest") || text.includes("breath")) setTriageResult("🚨 URGENT: Possible cardiac issue. Seek immediate medical attention.");
    else if (text.includes("fever") || text.includes("cough")) setTriageResult("⚠️ Moderate: Likely viral infection. Monitor temperature, rest, hydrate.");
    else if (text.includes("headache")) setTriageResult("💡 Mild: Could be tension or dehydration. Drink water, rest in dark room.");
    else setTriageResult("ℹ️ General advice: Monitor symptoms. If persists, consult doctor.");
  };

  const getRiskColor = (risk: string) => {
    if (risk === "high") return "bg-red-100 text-red-800 border-red-300";
    if (risk === "medium") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">AI Health Risk Predictor</h1>
          <p className="text-gray-500 mt-2">Intelligent analysis of your health data</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {risks.map((risk: any) => (
                <div key={risk.condition} className={`rounded-xl p-5 border ${getRiskColor(risk.risk)} bg-white shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{risk.condition}</h3>
                    <span className="text-sm font-semibold uppercase">{risk.risk} risk</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full" style={{ width: `${risk.percentage}%` }} />
                  </div>
                  <p className="text-sm mt-2 text-gray-600">{risk.percentage}% likelihood</p>
                  <p className="text-sm mt-3 text-gray-700">{risk.recommendation}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-800"><Activity /> Symptom Triage</h2>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms... (e.g., chest pain, fever, headache)"
                  className="w-full bg-gray-50 text-gray-800 rounded-xl p-3 mb-3 h-28 border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={analyzeSymptoms} className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full hover:bg-blue-700">Analyze</button>
                {triageResult && <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{triageResult}</div>}
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-800"><Phone /> Telemedicine</h2>
                {!telemedicine ? (
                  <>
                    <p className="text-gray-500 mb-3">Book a virtual consultation with a doctor.</p>
                    <button onClick={() => setTelemedicine(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full hover:bg-purple-700">Book Appointment</button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-xl text-green-800 border border-green-200"><CheckCircle className="inline mr-2" size={16} /> Appointment confirmed! A doctor will call you within 15 minutes.</div>
                    <button onClick={() => setTelemedicine(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl w-full hover:bg-gray-300">Close</button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <p className="text-center text-xs text-gray-400 mt-8">⚠️ AI predictions are for educational purposes. Always consult a doctor.</p>
      </div>
    </div>
  );
}


