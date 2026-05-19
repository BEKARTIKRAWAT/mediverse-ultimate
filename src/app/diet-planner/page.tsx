"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Utensils, Loader2, Apple, Salad, Coffee, Cake, Download } from "lucide-react";

export default function DietPlanner() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({ goal: "weight loss", diet: "balanced", allergies: "", mealsPerDay: 3 });
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const prompt = `Create a detailed daily meal plan for ${preferences.goal} with ${preferences.diet} diet. Allergies: ${preferences.allergies || "none"}. ${preferences.mealsPerDay} meals per day. Include breakfast, lunch, dinner, and snacks. Provide portion sizes and preparation tips.`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setPlan(data.reply || "Unable to generate plan. Please try again.");
    } catch (err) {
      setPlan("Error generating plan. Please check your connection.");
    }
    setLoading(false);
  };

  const copyPlan = () => {
    navigator.clipboard.writeText(plan);
    alert("Plan copied to clipboard!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6"><Utensils className="w-12 h-12 text-green-600 mx-auto" /><h1 className="text-3xl font-bold text-gray-800">AI Diet Planner</h1><p className="text-gray-500">Personalized meal plans by AI</p></div>
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Goal</label><select value={preferences.goal} onChange={e=>setPreferences({...preferences, goal:e.target.value})} className="w-full border rounded-xl p-2"><option>weight loss</option><option>muscle gain</option><option>maintenance</option><option>energy boost</option></select></div>
            <div><label className="block text-sm font-medium">Diet Type</label><select value={preferences.diet} onChange={e=>setPreferences({...preferences, diet:e.target.value})} className="w-full border rounded-xl p-2"><option>balanced</option><option>vegetarian</option><option>vegan</option><option>keto</option><option>mediterranean</option></select></div>
            <div><label className="block text-sm font-medium">Allergies / Restrictions</label><input type="text" placeholder="e.g., nuts, dairy, gluten" value={preferences.allergies} onChange={e=>setPreferences({...preferences, allergies:e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-medium">Meals per Day</label><input type="number" min={1} max={6} value={preferences.mealsPerDay} onChange={e=>setPreferences({...preferences, mealsPerDay:parseInt(e.target.value)})} className="w-full border rounded-xl p-2" /></div>
          </div>
          <button onClick={generatePlan} disabled={loading} className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin" /> : "Generate Meal Plan"}</button>
        </div>
        {plan && (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-3"><h2 className="text-xl font-semibold">Your Personalized Plan</h2><button onClick={copyPlan} className="text-blue-600 flex items-center gap-1"><Download size={16}/> Copy</button></div>
            <div className="prose max-w-none whitespace-pre-wrap text-gray-700">{plan}</div>
          </div>
        )}
      </div>
    </div>
  );
}
