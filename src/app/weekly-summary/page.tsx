"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Mail, Copy, CheckCircle, FileText } from "lucide-react";

export default function WeeklySummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user?.id}`) || "[]");
    const vitals = JSON.parse(localStorage.getItem(`mediverse_vitals_${user?.id}`) || "[]");
    const mood = JSON.parse(localStorage.getItem(`mediverse_mood_${user?.id}`) || "[]");
    const lastWeekMeds = meds.length;
    const lastVital = vitals.slice(-1)[0];
    const recentMood = mood.slice(-3).filter(m => m.mood === "happy").length;
    const text = `📊 Mediverse Weekly Health Summary\n\nUser: ${user?.name || user?.email?.split("@")[0]}\nDate: ${new Date().toLocaleDateString()}\n\n✅ Medications tracked: ${lastWeekMeds}\n❤️ Latest vital: ${lastVital ? `${lastVital.type}: ${lastVital.value}` : "No vitals logged"}\n😊 Positive mood entries (last 3): ${recentMood}/3\n\n💡 Tip: Continue logging daily for better insights.\n\nStay healthy,\nMediverse AI`;
    setSummary(text);
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openEmail = () => {
    window.window.location.href = `mailto:?subject=Mediverse Weekly Health Summary&body=${encodeURIComponent(summary)}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="text-center mb-6"><Mail className="w-12 h-12 text-blue-500 mx-auto" /><h1 className="text-2xl font-bold text-gray-800">Weekly Health Summary</h1><p className="text-gray-500">Share your progress with your doctor or save it</p></div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4 whitespace-pre-wrap text-sm text-gray-700">{summary}</div>
        <div className="flex gap-3">
          <button onClick={copyToClipboard} className="flex-1 bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2">{copied ? <CheckCircle size={18} /> : <Copy size={18} />} {copied ? "Copied!" : "Copy Summary"}</button>
          <button onClick={openEmail} className="flex-1 bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"><Mail size={18} /> Email</button>
        </div>
      </div>
    </div>
  );
}






