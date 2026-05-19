"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Brain, Sparkles, Download, FileText, RefreshCw, Activity, Heart, Moon, Footprints, Apple, TrendingUp, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function HealthCoachPage() {
  const { user } = useAuth();
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateAdvice = async () => {
    setLoading(true);
    // Simulate AI analysis from stored health data
    if (!user) return;
    const health = JSON.parse(localStorage.getItem(`mediverse_health_${user.id}`) || "[]");
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user.id}`) || "[]");
    const mood = JSON.parse(localStorage.getItem(`mediverse_mood_${user.id}`) || "[]");
    const steps = health.filter((h: any) => h.type === "steps").slice(-7).reduce((a: any, b: any) => a + b.value, 0) / (health.filter((h: any) => h.type === "steps").length || 1);
    const sleep = health.filter((h: any) => h.type === "sleep").slice(-7).reduce((a: any, b: any) => a + b.value, 0) / (health.filter((h: any) => h.type === "sleep").length || 1);
    const recentMood = mood.slice(-3).filter((m: any) => m.mood === "stressed" || m.mood === "sad").length;
    
    const newAdvice = [
      steps < 5000 ? "🚶 Increase daily steps to 8,000+ for heart health." : "🏆 Great step count! Keep moving daily.",
      sleep < 7 ? "😴 Aim for 7-9 hours of sleep. Try a consistent bedtime." : "💤 Good sleep duration! Maintain your routine.",
      meds.length > 0 ? "💊 Take your medications as prescribed. Set reminders in the app." : "📋 No medications tracked. Add them for personalized reminders.",
      recentMood >= 2 ? "🧘 Practice deep breathing or meditation to manage stress." : "😊 Your mood is stable. Keep journaling to stay aware.",
      "🥗 Eat a balanced diet rich in vegetables, lean protein, and whole grains.",
      "💧 Drink at least 8 glasses of water daily."
    ];
    setAdvice(newAdvice);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => { if (user) generateAdvice(); }, [user]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("AI Health Coach Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated for ${user?.user_metadata?.full_name || user?.email?.split("@")[0]} (${user?.email})`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 38);
    autoTable(doc, { startY: 45, head: [["Wellness Tip", "Action"]], body: advice.map(a => [a, "✓ Follow daily"]) });
    doc.save("health_coach_report.pdf");
  };

  const exportJSON = () => {
    const data = { user: user?.user_metadata?.full_name || user?.email?.split("@")[0], date: new Date().toISOString(), advice };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health_coach_${user?.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg mb-4"><Brain className="w-8 h-8 text-white" /></div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">AI Health Coach</h1>
          <p className="text-gray-500 mt-2">Personalized daily wellness advice</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm"><Sparkles size={16} /> {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Generating advice..."}</div>
            <div className="flex gap-2">
              <button onClick={generateAdvice} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><RefreshCw size={16} /> Refresh Advice</button>
              <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><FileText size={16} /> PDF</button>
              <button onClick={exportJSON} className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Download size={16} /> JSON</button>
            </div>
          </div>
          {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div> : (
            <div className="space-y-3">
              {advice.map((tip: any, idx: any) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2"></div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 text-center mt-6">Advice is based on your recent health data (steps, sleep, mood, medications). Log more for better personalization.</p>
        </div>
      </div>
    </div>
  );
}





