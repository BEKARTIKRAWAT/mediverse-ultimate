"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Mic, Paperclip, Bot, User, Sparkles, Volume2, VolumeX, Settings } from "lucide-react";

export default function AIChatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<{ id: number; role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const lastRequestTime = useRef(0);
  const RATE_LIMIT_MS = 15000;
  let currentRecognition: any = null;

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      const hindiVoice = available.find(v => v.lang.includes("hi-IN") && v.localService);
      const defaultVoice = hindiVoice || available.find(v => v.lang.includes("hi")) || available[0];
      if (defaultVoice && !selectedVoice) {
        setSelectedVoice(defaultVoice.voiceURI);
        localStorage.setItem("mediverse_voice_uri", defaultVoice.voiceURI);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  useEffect(() => {
    const muted = localStorage.getItem("mediverse_voice_muted") === "true";
    setIsMuted(muted);
    const savedVoice = localStorage.getItem("mediverse_voice_uri");
    if (savedVoice) setSelectedVoice(savedVoice);
  }, []);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`mediverse_chat_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const sanitized = parsed.map((msg: any, idx: number) => ({ ...msg, id: idx + 1 }));
        setMessages(sanitized);
        nextId.current = sanitized.length + 1;
      } else {
        setMessages([{ id: nextId.current++, role: "assistant", content: "Hello! I can speak English, Hindi, or Hinglish. Aap Hindi, English ya Hinglish mein poochh sakte hain. How can I help you?" }]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && messages.length) localStorage.setItem(`mediverse_chat_${user.id}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, user]);

  const isDevanagari = (text: string) => /[\u0900-\u097F]/.test(text);
  const isHinglish = (text: string) => {
    if (isDevanagari(text)) return false;
    const hinglishWords = /\b(mere|mujhe|aap|tum|hai|hoon|nahi|kya|kyu|kar|de|le|ja|diya|liya|kiya|raha|rahi|sakta|chahiye|bahut|thoda|aaj|kal|aana|jana|karna|hona)\b/i;
    return hinglishWords.test(text);
  };

  const speakResponse = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      const voiceObj = voices.find(v => v.voiceURI === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }
    if (isDevanagari(text)) utterance.lang = "hi-IN";
    else if (isHinglish(text)) utterance.lang = "hi-Latn";
    else utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text?: string) => {
    const msgText = text !== undefined ? text : input;
    if (!msgText.trim() || isLoading || !user) return;

    const now = Date.now();
    if (now - lastRequestTime.current < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil((RATE_LIMIT_MS - now + lastRequestTime.current) / 1000);
      const warnMsg = { id: nextId.current++, role: "assistant" as const, content: `⏳ Please wait ${waitSeconds} more seconds before sending another message.` };
      setMessages(prev => [...prev, warnMsg]);
      return;
    }
    lastRequestTime.current = now;

    const userMsg = { id: nextId.current++, role: "user" as const, content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      if (res.status === 429) throw new Error("Rate limit exceeded. Please wait.");
      if (data.error) throw new Error(data.error);
      const replyMsg = { id: nextId.current++, role: "assistant" as const, content: data.reply };
      setMessages(prev => [...prev, replyMsg]);
      speakResponse(data.reply);
    } catch (err: any) {
      const errorMsg = { id: nextId.current++, role: "assistant" as const, content: `⚠️ ${err.message || "Connection error. Try again."}` };
      setMessages(prev => [...prev, errorMsg]);
    }
    setIsLoading(false);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) return alert("Voice not supported");
    if (currentRecognition) { try { currentRecognition.abort(); } catch(e) {} }
    const recognition = new (window as any).webkitSpeechRecognition();
    currentRecognition = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => { setIsListening(false); if (currentRecognition === recognition) currentRecognition = null; };
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      currentRecognition = null;
    };
    recognition.start();
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("mediverse_voice_muted", String(newMuted));
    if (newMuted) window.speechSynthesis?.cancel();
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    setSelectedVoice(uri);
    localStorage.setItem("mediverse_voice_uri", uri);
    speakResponse("नमस्ते! Hello! Hinglish mein kaise hai aap?");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sendMessage(`[Uploaded: ${file.name}] Please analyze this ${file.type.includes("image") ? "image" : "document"}.`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Health Assistant</h1>
          <p className="text-gray-500">Powered by Groq – Fast, intelligent responses</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-500" /><span className="font-semibold">Mediverse AI</span><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowVoiceSettings(!showVoiceSettings)} className="p-2 rounded-full hover:bg-gray-200 transition"><Settings size={18} /></button>
              <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-200 transition">{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
            </div>
          </div>
          {showVoiceSettings && (
            <div className="bg-gray-100 px-4 py-2 border-b text-sm flex items-center gap-2 flex-wrap">
              <span>Voice:</span>
              <select value={selectedVoice} onChange={handleVoiceChange} className="border rounded px-2 py-1">
                {voices.filter(v => v.lang.includes("hi") || v.lang.includes("en")).map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
          )}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50/30">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Bot className="w-4 h-4 text-blue-600" /></div>}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                {msg.role === "user" && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-4 h-4 text-gray-600" /></div>}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Bot className="w-4 h-4 text-blue-600" /></div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3"><div className="flex gap-1 animate-pulse">●●●</div></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <div className="flex gap-1">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Paperclip size={18} /></button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,application/pdf" className="hidden" />
                <button onClick={startListening} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">{isListening ? <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> : <Mic size={18} />}</button>
              </div>
              <div className="flex-1 relative">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === "Enter" && sendMessage()} placeholder="English | हिंदी | Hinglish – Ask anything..." className="w-full px-4 py-2 pr-10 border rounded-xl" disabled={isLoading} />
                {input && <button onClick={() => sendMessage()} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500"><Send size={18} /></button>}
              </div>
              <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} className="bg-blue-500 text-white px-5 py-2 rounded-xl">{isLoading ? <Loader2 className="animate-spin" /> : "Send"}</button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">Powered by Groq. Rate limit: 15s. For emergencies, contact your doctor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
