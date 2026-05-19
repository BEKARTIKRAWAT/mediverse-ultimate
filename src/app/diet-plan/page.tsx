"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Apple, Loader2, Sparkles, Target } from "lucide-react";

export default function DietPlanPage() {
  const { user } = useAuth();
  const [goal, setGoal] = useState("weight loss");
  const [dietary, setDietary] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: `Generate a detailed 7-day diet plan for ${goal}. Dietary restrictions: ${dietary || "none"}. Include breakfast, lunch, dinner, snacks.` }] })
      });
      const data = await res.json();
      setPlan(data.reply || "Generated plan. Consult a nutritionist.");
    } catch { setPlan("Unable to generate plan. Try again."); }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="text-center mb-6"><Apple className="w-12 h-12 text-green-600 mx-auto" /><h1 className="text-3xl font-bold">AI Diet Plan Generator</h1><p className="text-gray-500">Personalized meal plans using AI</p></div>
        <div className="space-y-4">
          <div><label className="block font-medium">Goal</label><select value={goal} onChange={e=>setGoal(e.target.value)} className="w-full border rounded-xl p-2"><option>weight loss</option><option>muscle gain</option><option>maintenance</option><option>diabetes control</option></select></div>
          <div><label className="block font-medium">Dietary restrictions (optional)</label><input type="text" value={dietary} onChange={e=>setDietary(e.target.value)} placeholder="e.g., vegetarian, gluten-free, lactose-free" className="w-full border rounded-xl p-2" /></div>
          <button onClick={generatePlan} disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} Generate Diet Plan</button>
          {plan && <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm mt-4">{plan}</div>}
        </div>
      </div>
    </div>
  );
}


