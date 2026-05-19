"use client";
import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Heart, Activity } from 'lucide-react';

export default function AIHealthInsights({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      const health = JSON.parse(localStorage.getItem(`mediverse_healthMetrics_${userId}`) || '[]');
      const steps = health.filter((h: any) => h.type === 'steps').slice(-7);
      const avgSteps = steps.reduce((a: number, b: any) => a + b.value, 0) / (steps.length || 1);
      let insight = '';
      if (avgSteps < 5000) insight = '📉 Your average steps are below 5k. Try walking more!';
      else if (avgSteps > 10000) insight = '🏆 Amazing! You are exceeding 10k steps daily.';
      else insight = '✅ Good step count. Keep it up!';
      setInsights([insight, '🧠 AI: Stay hydrated and get 7-9 hours of sleep.']);
      setLoading(false);
    };
    fetchInsights();
  }, [userId]);

  if (loading) return <div className="animate-pulse bg-gray-200 h-24 rounded-xl"></div>;
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
      <div className="flex items-center gap-2 mb-2"><Brain className="w-5 h-5 text-purple-600" /><h3 className="font-semibold">AI Health Insights</h3></div>
      {insights.map((ins, i) => <p key={i} className="text-sm text-gray-700 mb-1">{ins}</p>)}
    </div>
  );
}
