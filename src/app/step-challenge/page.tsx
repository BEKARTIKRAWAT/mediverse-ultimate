"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Footprints, Trophy } from "lucide-react";

export default function StepChallenge() {
  const { user } = useAuth();
  const [goal, setGoal] = useState(10000);
  const [todaySteps, setTodaySteps] = useState(0);

  useEffect(() => {
    if (!user) return;
    const savedGoal = localStorage.getItem(`mediverse_stepgoal_${user?.id}`);
    if (savedGoal) setGoal(parseInt(savedGoal));
    const steps = JSON.parse(localStorage.getItem(`mediverse_health_${user?.id}`) || "[]");
    const today = new Date().toISOString().split("T")[0];
    const todayEntry = steps.find(s => s.type === "steps" && s.date === today);
    if (todayEntry) setTodaySteps(todayEntry.value);
  }, [user]);

  const updateGoal = () => {
    localStorage.setItem(`mediverse_stepgoal_${user?.id}`, goal.toString());
    alert("Goal updated!");
  };

  if (!user) return null;

  const progress = Math.min(100, (todaySteps / goal) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-6 text-center">
        <Footprints className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Step Challenge</h1>
        <p className="text-gray-500 mb-4">Today's steps: {todaySteps.toLocaleString()}</p>
        <div className="h-4 bg-gray-200 rounded-full mb-2"><div className="h-4 bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div></div>
        <p className="text-sm text-gray-600 mb-4">{progress.toFixed(0)}% of goal</p>
        <div className="flex gap-2"><input type="number" value={goal} onChange={e=>setGoal(parseInt(e.target.value))} className="border rounded p-2 w-full" /><button onClick={updateGoal} className="bg-blue-600 text-white px-4 rounded-xl">Set Goal</button></div>
        {progress >= 100 && <div className="mt-4 bg-yellow-100 p-3 rounded-xl flex items-center gap-2"><Trophy className="text-yellow-600" /> Congratulations! Goal achieved!</div>}
      </div>
    </div>
  );
}





