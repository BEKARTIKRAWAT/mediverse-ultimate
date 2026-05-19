"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Brain, Calendar, TrendingUp, Smile, Meh, Frown, Angry, Battery, Sparkles, BarChart, List, Plus, Trash2, Heart, Wind, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  note: string;
}

const moodIcons: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  happy: { icon: Smile, color: "text-green-500", bg: "bg-green-100", label: "Happy" },
  neutral: { icon: Meh, color: "text-gray-500", bg: "bg-gray-100", label: "Neutral" },
  sad: { icon: Frown, color: "text-blue-500", bg: "bg-blue-100", label: "Sad" },
  stressed: { icon: Angry, color: "text-red-500", bg: "bg-red-100", label: "Stressed" },
  tired: { icon: Battery, color: "text-yellow-500", bg: "bg-yellow-100", label: "Tired" },
};

const affirmations = [
  "You are enough, just as you are.",
  "This feeling will pass. You are stronger than you think.",
  "Take a deep breath. You’ve got this.",
  "It's okay to not be okay. You are not alone.",
  "Small steps every day lead to big changes.",
];

export default function MentalHealthPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [note, setNote] = useState("");
  const [view, setView] = useState<"log" | "history">("log");
  const [streak, setStreak] = useState(0);
  const [insight, setInsight] = useState("");
  const [affirmation, setAffirmation] = useState(affirmations[0]);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_mood_${user.id}`);
    if (saved) setEntries(JSON.parse(saved));
    // Random affirmation on load
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_mood_${user.id}`, JSON.stringify(entries));
    calculateStreak();
    generateInsight();
  }, [entries, user]);

  const calculateStreak = () => {
    if (entries.length === 0) { setStreak(0); return; }
    const sorted = [...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streakCount = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = new Date(sorted[i].date);
      const prev = new Date(sorted[i+1].date);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000*3600*24);
      if (diffDays === 1) streakCount++;
      else break;
    }
    setStreak(streakCount);
  };

  const generateInsight = () => {
    if (entries.length < 3) { setInsight("Keep logging to see mood patterns!"); return; }
    const moodCount: Record<string, number> = {};
    entries.forEach(e => moodCount[e.mood] = (moodCount[e.mood] || 0) + 1);
    const mostFrequent = Object.entries(moodCount).sort((a,b) => b[1] - a[1])[0];
    const latest = entries[entries.length-1]?.mood;
    const latestLabel = moodIcons[latest]?.label || latest;
    const mostLabel = moodIcons[mostFrequent[0]]?.label || mostFrequent[0];
    if (mostFrequent[0] === latest) setInsight(`✨ You've been feeling ${mostLabel} most often. Keep tracking!`);
    else setInsight(`📊 Your most common mood is ${mostLabel}. Today you feel ${latestLabel}.`);
  };

  const saveMood = () => {
    const today = new Date().toISOString().split("T")[0];
    if (entries.some(e => e.date === today)) {
      alert("You already logged today's mood. Edit the existing entry if needed.");
      return;
    }
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: today,
      mood: selectedMood,
      note: note.trim(),
    };
    setEntries([...entries, newEntry]);
    setNote("");
    alert("Mood saved! 🎉");
  };

  const deleteEntry = (id: string) => {
    if (confirm("Delete this entry?")) setEntries(entries.filter(e => e.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mood_journal_${user?.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = [...entries]
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(e => ({
      date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      moodValue: ["happy","neutral","sad","stressed","tired"].indexOf(e.mood) + 1,
      moodName: moodIcons[e.mood]?.label || e.mood,
    }));

  const startBreathingExercise = () => {
    alert("🌬️ Breathe in for 4 seconds... hold for 4... breathe out for 4... repeat 5 times.");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3"><Brain className="w-8 h-8 text-purple-600" /><h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Mental Health & Mood Tracker</h1></div>
            <div className="flex gap-2">
              <button onClick={() => setView("log")} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${view === "log" ? "bg-purple-600 text-white" : "bg-gray-200"}`}><Plus size={16} /> Log Mood</button>
              <button onClick={() => setView("history")} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${view === "history" ? "bg-purple-600 text-white" : "bg-gray-200"}`}><List size={16} /> History</button>
              <button onClick={exportData} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center gap-2"><Download size={16} /> Export</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-purple-100 rounded-xl px-4 py-2"><span className="font-semibold">🔥 Streak:</span> {streak} day{streak !== 1 ? 's' : ''}</div>
            <div className="bg-purple-100 rounded-xl px-4 py-2 flex items-center gap-2"><Sparkles size={16} /> {insight}</div>
            <button onClick={startBreathingExercise} className="bg-green-100 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-green-200"><Wind size={16} /> Breathing Exercise</button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-center italic">💬 {affirmation}</div>
        </div>

        {view === "log" ? (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Heart className="text-pink-500" /> How are you feeling today?</h2>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {Object.entries(moodIcons).map(([key, { icon: Icon, color, label }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMood(key)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedMood === key ? "bg-purple-100 ring-2 ring-purple-400 scale-105" : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <Icon className={`w-8 h-8 ${color}`} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
            <textarea placeholder="Optional: Write a note about your day..." value={note} onChange={e => setNote(e.target.value)} className="w-full border rounded-xl p-3 mb-4 h-24 resize-none" />
            <button onClick={saveMood} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl w-full font-semibold">Save Today's Mood</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BarChart /> Mood History & Trends</h2>
            {entries.length === 0 ? <p className="text-gray-500 text-center py-8">No entries yet. Log your first mood!</p> : (
              <>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1,5]} tickFormatter={(val) => ["Happy","Neutral","Sad","Stressed","Tired"][val-1]} />
                      <Tooltip formatter={(val) => ["Happy","Neutral","Sad","Stressed","Tired"][val-1]} />
                      <Line type="monotone" dataKey="moodValue" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => {
                    const moodInfo = moodIcons[entry.mood];
                    if (!moodInfo) return null; // fallback for unknown mood
                    const { icon: Icon, color, bg, label } = moodInfo;
                    return (
                      <div key={entry.id} className={`flex justify-between items-center p-3 rounded-xl ${bg}`}>
                        <div className="flex items-center gap-3"><Icon className={`w-6 h-6 ${color}`} /><div><p className="font-medium">{label}</p><p className="text-sm text-gray-600">{entry.note || "No note"}</p></div></div>
                        <div className="flex items-center gap-3"><span className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</span><button onClick={() => deleteEntry(entry.id)} className="text-red-500"><Trash2 size={16} /></button></div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
