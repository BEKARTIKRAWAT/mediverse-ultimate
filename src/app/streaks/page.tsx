export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Trophy, Flame, Star, Target, Award } from "lucide-react";import { CheckCircle } from "lucide-react";

export default function StreaksPage() {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState({ login: 0, steps: 0, medication: 0 });
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_streaks_${user?.id}`);
    if (saved) setStreaks(JSON.parse(saved));
    else setStreaks({ login: 1, steps: 0, medication: 0 });
  }, [user]);
  const achievements = [
    { name: "First Step", condition: streaks.steps >= 1, icon: <Target size={20} /> },
    { name: "7‑Day Warrior", condition: streaks.login >= 7, icon: <Flame size={20} /> },
    { name: "Medication Master", condition: streaks.medication >= 5, icon: <Award size={20} /> },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4"><Trophy className="w-8 h-8 text-yellow-500" /><h1 className="text-2xl font-bold">Your Streaks</h1></div>
        <div className="grid grid-cols-3 gap-3 mb-6"><div className="bg-amber-50 p-3 rounded-xl text-center"><Flame className="w-6 h-6 text-orange-500 mx-auto" /><p className="text-2xl font-bold">{streaks.login}</p><p className="text-xs">Login days</p></div>
        <div className="bg-amber-50 p-3 rounded-xl text-center"><Target className="w-6 h-6 text-green-500 mx-auto" /><p className="text-2xl font-bold">{streaks.steps}</p><p className="text-xs">Steps days</p></div>
        <div className="bg-amber-50 p-3 rounded-xl text-center"><Award className="w-6 h-6 text-blue-500 mx-auto" /><p className="text-2xl font-bold">{streaks.medication}</p><p className="text-xs">Medication days</p></div></div>
        <h2 className="font-semibold mb-2">Achievements</h2>{achievements.map(a=><div key={a.name} className={`flex items-center gap-2 p-2 rounded ${a.condition ? "bg-green-100" : "bg-gray-100"}`}>{a.icon}<span>{a.name}</span>{a.condition && <CheckCircle size={16} className="text-green-600 ml-auto"/>}</div>)}
      </div>
    </div>
  );
}





