"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { TrendingUp, Calendar, Heart, Activity, Droplet, Moon, Footprints, Brain, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

export default function HealthPredictorPro() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const health = JSON.parse(localStorage.getItem(`mediverse_health_${user.id}`) || "[]");
    const steps = health.filter(h => h.type === "steps").sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
    const sleep = health.filter(h => h.type === "sleep").sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
    const weight = health.filter(h => h.type === "weight").sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Prepare chart data (last 14 days)
    const last14 = [...Array(14)].map((_, i) => {
      const date = new Date(); date.setDate(date.getDate() - (13 - i));
      const dateStr = date.toISOString().split("T")[0];
      const stepEntry = steps.find(s => s.date === dateStr);
      const sleepEntry = sleep.find(s => s.date === dateStr);
      const weightEntry = weight.find(s => s.date === dateStr);
      return {
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        steps: stepEntry?.value || 0,
        sleep: sleepEntry?.value || 0,
        weight: weightEntry?.value || 0,
      };
    });
    setTrendData(last14);
    
    // AI predictions (simple linear regression mock)
    const avgSteps = steps.slice(-7).reduce((a,b) => a + b.value, 0) / (steps.slice(-7).length || 1);
    const avgSleep = sleep.slice(-7).reduce((a,b) => a + b.value, 0) / (sleep.slice(-7).length || 1);
    const trendSteps = steps.length >= 2 ? steps[steps.length-1].value - steps[steps.length-2].value : 0;
    setPredictions({
      stepsPrediction: Math.max(0, Math.round(avgSteps + trendSteps)),
      sleepPrediction: Math.min(10, Math.max(4, Math.round(avgSleep + (trendSteps > 0 ? 0.2 : -0.2)))),
      insight: trendSteps > 500 ? "🚀 Your step count is rising! Keep it up." : trendSteps < -500 ? "⚠️ Steps decreasing. Try to move more." : "📊 Consistent activity. Maintain routine.",
    });
    setLoading(false);
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Health Predictor Pro</h1>
          <p className="text-gray-500 mt-2">AI-powered 7‑day trend forecast</p>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <Footprints className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Predicted Steps (next 7 days)</p>
                <p className="text-3xl font-bold text-gray-800">{predictions?.stepsPrediction?.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">based on recent trend</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <Moon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Predicted Sleep (hours)</p>
                <p className="text-3xl font-bold text-gray-800">{predictions?.sleepPrediction} hrs</p>
                <p className="text-xs text-gray-400 mt-1">optimal: 7‑9 hours</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 text-center border border-blue-100">
                <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-gray-700 text-sm font-medium">AI Insight</p>
                <p className="text-gray-800 text-sm mt-1">{predictions?.insight}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800"><Activity /> 14‑Day Health Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area type="monotone" dataKey="steps" stroke="#3b82f6" fill="#93c5fd" yAxisId="left" />
                    <Area type="monotone" dataKey="sleep" stroke="#8b5cf6" fill="#c4b5fd" yAxisId="right" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">📈 Steps (blue) and Sleep (purple) trends over the last 14 days</p>
            </div>
          </>
        )}
        <p className="text-center text-xs text-gray-400 mt-8">🔮 Predictions are based on your past 7 days of data. Log more health metrics for better accuracy.</p>
      </div>
    </div>
  );
}


