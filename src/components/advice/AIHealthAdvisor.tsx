"use client";
import { useEffect, useState } from "react";
import { Brain, Sparkles } from "lucide-react";

export default function AIHealthAdvisor({ userId }: { userId: string }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      try {
        // Gather last 7 days of data
        const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${userId}`) || "[]");
        const health = JSON.parse(localStorage.getItem(`mediverse_health_${userId}`) || "[]");
        const takenHistory = meds.flatMap((m:any) => m.taken || []).slice(-7);
        const avgSteps = health.filter((h:any)=>h.type==="steps").slice(-7).reduce((a,b)=>a+b.value,0)/7 || 0;
        const avgSleep = health.filter((h:any)=>h.type==="sleepHours").slice(-7).reduce((a,b)=>a+b.value,0)/7 || 0;
        const adherence = takenHistory.length > 0 ? (takenHistory.filter((t:any)=>t.taken).length / takenHistory.length) * 100 : 0;
        
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: `Based on this health data – steps: ${avgSteps}, sleep: ${avgSleep}h, medication adherence: ${adherence}%. Give one short, actionable health tip.` }] })
        });
        const data = await res.json();
        setAdvice(data.reply || "Keep up your healthy habits!");
      } catch { setAdvice("Stay consistent with your medications and movement."); }
      setLoading(false);
    };
    fetchAdvice();
  }, [userId]);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 mt-4">
      <div className="flex items-center gap-2 mb-2"><Brain className="w-5 h-5 text-purple-600" /><span className="font-semibold">AI Health Advisor</span></div>
      {loading ? <div className="animate-pulse">Loading advice...</div> : <p className="text-sm">{advice}</p>}
    </div>
  );
}
