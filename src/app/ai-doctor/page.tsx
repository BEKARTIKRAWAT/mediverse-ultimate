"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Stethoscope, Send, Loader2, User, Bot } from "lucide-react";

export default function AIDoctorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");

  useEffect(() => {
    if (!user) return;
    // Load user's health data for context
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user.id}`) || "[]");
    const health = JSON.parse(localStorage.getItem(`mediverse_health_${user.id}`) || "[]");
    const vitals = JSON.parse(localStorage.getItem(`mediverse_vitals_${user.id}`) || "[]");
    const contextStr = `User health profile:
- Medications: ${meds.map((m:any)=>m.name).join(", ") || "None"}
- Latest vitals: ${vitals.slice(-1)[0]?.type || "None"} ${vitals.slice(-1)[0]?.value || ""}
- Recent health entries: ${health.length} records.
Provide personalized, empathetic medical advice. Never diagnose but give helpful suggestions.`;
    setContext(contextStr);
    setMessages([{ role: "assistant", content: "Hello! I'm Mediverse AI Doctor. I can analyze your symptoms and health data to give personalized advice. Describe your symptoms or ask a health question." }]);
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "system", content: context }, ...messages, userMsg] })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6"><Stethoscope className="w-12 h-12 text-blue-600 mx-auto" /><h1 className="text-3xl font-bold text-gray-800">AI Doctor Consultation</h1><p className="text-gray-500">Personalized medical advice using your health data</p></div>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg: any, idx: any) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Bot className="w-4 h-4 text-blue-600" /></div>}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white border text-gray-800"}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-4 h-4 text-gray-600" /></div>}
              </div>
            ))}
            {loading && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Bot className="w-4 h-4 text-blue-600" /></div><div className="bg-white border rounded-2xl px-4 py-2"><Loader2 className="animate-spin" /></div></div>}
          </div>
          <div className="border-t bg-white p-4">
            <div className="flex gap-2"><input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==="Enter"&&sendMessage()} placeholder="Describe your symptoms..." className="flex-1 border rounded-xl p-2" disabled={loading} /><button onClick={sendMessage} disabled={!input.trim()||loading} className="bg-blue-600 text-white px-5 py-2 rounded-xl">{loading?<Loader2 className="animate-spin"/>:<Send size={18}/>}</button></div>
            <p className="text-xs text-gray-400 text-center mt-2">⚠️ AI advice is informational. Always consult a real doctor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


