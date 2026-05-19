"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Dumbbell, Search } from "lucide-react";

const exercises = [
  { name: "Push-ups", category: "Strength", difficulty: "Intermediate" },
  { name: "Squats", category: "Legs", difficulty: "Beginner" },
  { name: "Plank", category: "Core", difficulty: "Intermediate" },
  { name: "Lunges", category: "Legs", difficulty: "Beginner" },
  { name: "Burpees", category: "Cardio", difficulty: "Advanced" },
  { name: "Jumping Jacks", category: "Cardio", difficulty: "Beginner" },
  { name: "Pull-ups", category: "Strength", difficulty: "Advanced" },
  { name: "Mountain Climbers", category: "Cardio", difficulty: "Intermediate" },
];

export default function ExerciseLibrary() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = exercises.filter(e => (category==="All" || e.category===category) && e.name.toLowerCase().includes(search.toLowerCase()));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Dumbbell className="text-orange-500" /> Exercise Library</h1>
        <div className="flex flex-wrap gap-2 mb-4"><input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="border rounded p-2 flex-1" /><select value={category} onChange={e=>setCategory(e.target.value)} className="border rounded p-2"><option>All</option><option>Strength</option><option>Cardio</option><option>Legs</option><option>Core</option></select></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{filtered.map(e=><div key={e.name} className="border rounded-xl p-3"><h3 className="font-semibold">{e.name}</h3><p className="text-sm text-gray-500">{e.category} • {e.difficulty}</p></div>)}</div>
      </div>
    </div>
  );
}


