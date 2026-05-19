"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Smile, Frown, Meh, Brain, Loader2 } from "lucide-react";

export default function MoodCheckPage() {
  const { user } = useAuth();
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_mood_${user.id}`);
    if (saved) setHistory(JSON.parse(saved));
  }, [user]);

  const saveMood = async () => {
    if (!mood) return;
    const entry = { date: new Date().toISOString().split("T")[0], mood, note };
    const newHistory = [entry, ...history].slice(0, 30);
    setHistory(newHistory);
    localStorage.setItem(`mediverse_mood_${user.id}`, JSON.stringify(newHistory));
    // Get AI advice
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: `I'm feeling ${mood}. ${note ? `Reason: ${note}` : ""} Give one short mental health tip.` }] })
    });
    const data = await res.json();
    setAdvice(data.reply || "Take deep breaths and stay hydrated.");
    setMood("");
    setNote("");
  };

  const getMoodIcon = (m: string) => {
    if (m === "happy") return <Smile className="text-green-500" />;
    if (m === "sad") return <Frown className="text-blue-500" />;
    return <Meh className="text-yellow-500" />;
  };

  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4"><Brain className="w-8 h-8 text-purple-600" /><h1 className="text-2xl font-bold">Mental Health Check‑in</h1></div>
        <div className="flex gap-4 mb-4">
          {["happy", "neutral", "sad"].map(m => (
            <button key={m} onClick={() => setMood(m)} className={`px-4 py-2 rounded-full flex items-center gap-2 ${mood === m ? "bg-purple-600 text-white" : "bg-gray-100"}`}>
              {m === "happy" && <Smile size={16} />}{m === "neutral" && <Meh size={16} />}{m === "sad" && <Frown size={16} />}{m}
            </button>
          ))}
        </div>
        <textarea placeholder="Optional note (what caused this?)" value={note} onChange={e=>setNote(e.target.value)} className="w-full border rounded-xl p-2 mb-4" rows={2} />
        <button onClick={saveMood} className="bg-purple-600 text-white px-6 py-2 rounded-xl w-full">Save Mood</button>
        {advice && <div className="mt-4 p-3 bg-purple-50 rounded-xl"><strong>💡 Tip:</strong> {advice}</div>}
        <h2 className="font-semibold mt-6 mb-2">Recent check‑ins</h2>
        {history.length === 0 ? <p className="text-gray-400">No entries yet.</p> : history.map((h,i)=><div key={i} className="border-b py-2 flex justify-between"><span>{h.date}</span><span className="flex items-center gap-1">{getMoodIcon(h.mood)} {h.mood}</span><span className="text-xs text-gray-400">{h.note?.substring(0,40)}</span></div>)}
      </div>
    </div>
  );
}
