"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Dumbbell, Loader2, Sparkles } from "lucide-react";

export default function FitnessPlanPage() {
  const { user } = useAuth();
  const [goal, setGoal] = useState("weight loss");
  const [duration, setDuration] = useState("4 weeks");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: `Generate a detailed ${duration} fitness plan for ${goal}. Include daily exercises, diet tips, and rest days.` }] })
      });
      const data = await res.json();
      setPlan(data.reply || "Plan generated. Consult a trainer for best results.");
    } catch { setPlan("Unable to generate plan. Please try later."); }
    setLoading(false);
  };

  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4"><Dumbbell className="w-8 h-8 text-blue-600" /><h1 className="text-2xl font-bold">AI Fitness Plan Generator</h1></div>
        <div className="space-y-4">
          <div><label className="block font-medium">Goal</label><select value={goal} onChange={e=>setGoal(e.target.value)} className="w-full border rounded-xl p-2"><option>weight loss</option><option>muscle gain</option><option>endurance</option><option>flexibility</option></select></div>
          <div><label className="block font-medium">Duration</label><select value={duration} onChange={e=>setDuration(e.target.value)} className="w-full border rounded-xl p-2"><option>2 weeks</option><option>4 weeks</option><option>8 weeks</option></select></div>
          <button onClick={generatePlan} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-xl w-full">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Generate Plan"}</button>
          {plan && <div className="bg-gray-50 p-4 rounded-xl whitespace-pre-wrap text-sm">{plan}</div>}
        </div>
      </div>
    </div>
  );
}

