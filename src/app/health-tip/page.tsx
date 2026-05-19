"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";

const tips = [
  "Drink 8 glasses of water daily.",
  "Take a 5-minute walk after meals.",
  "Stretch every hour if sitting long.",
  "Practice deep breathing for 2 minutes.",
  "Eat at least one green vegetable per meal.",
  "Get 7-9 hours of sleep.",
  "Limit screen time before bed.",
];

export default function HealthTip() {
  const { user } = useAuth();
  const [tip, setTip] = useState(tips[0]);

  const refreshTip = () => setTip(tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => { refreshTip(); }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-6 text-center">
        <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Daily Health Tip</h1>
        <p className="text-gray-700 text-lg mb-4">{tip}</p>
        <button onClick={refreshTip} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 mx-auto"><RefreshCw size={16} /> New Tip</button>
      </div>
    </div>
  );
}

