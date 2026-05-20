"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Activity, Pill, Calendar, MessageCircle, TrendingUp, LogOut, User,
  Sparkles, Bell, ChevronRight, Settings, AlertTriangle, Hospital,
  Trophy, Camera, Newspaper, Phone, Dumbbell, Brain, Smile, Heart, 
  Shield, Zap, Mail, Stethoscope, FileText, Video, Apple, Lightbulb,
  IdCard, Footprints, Moon, Droplet, BookOpen, Download, Clock, X
} from "lucide-react";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import FloatingActionMenu from "@/components/shared/FloatingActionMenu";
import UnifiedHealthSummary from "@/components/health/UnifiedHealthSummary";
import StepCounter from "@/components/health/StepCounter";
import AIHealthInsights from "@/components/dashboard/AIHealthInsights";

export default function MainDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ meds: 0, apts: 0, health: 0 });
  const [weather, setWeather] = useState(null);
  const [adherenceScore, setAdherenceScore] = useState(100);
  const [greeting, setGreeting] = useState("");
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user.id}`) || "[]");
    const apts = JSON.parse(localStorage.getItem(`mediverse_appointments_${user.id}`) || "[]");
    const health = JSON.parse(localStorage.getItem(`mediverse_health_${user.id}`) || "[]");
    setStats({ meds: meds.length, apts: apts.length, health: health.length });
    
    let total = 0, taken = 0;
    meds.forEach((m: any) => {
      m.times?.forEach(() => total++);
      const today = new Date().toISOString().split("T")[0];
      if (m.taken?.some((t: any) => t.date === today && t.taken)) taken++;
    });
    setAdherenceScore(total ? Math.round((taken / total) * 100) : 100);
  }, [user]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const res = await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        setWeather(data);
      }, () => fetch('/api/weather').then(r => r.json()).then(setWeather));
    } else fetch('/api/weather').then(r => r.json()).then(setWeather);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return null;

  const features = [
    { title: "AI Doctor", desc: "Consult AI for health", icon: Stethoscope, href: "/ai-doctor", color: "from-blue-600 to-indigo-600" },
    { title: "AI Chat", desc: "Chat with AI", icon: MessageCircle, href: "/ai-chat", color: "from-blue-500 to-indigo-600" },
    { title: "Medication Tracker", desc: "Manage meds", icon: Pill, href: "/medication-tracker", color: "from-green-500 to-teal-600" },
    { title: "Appointments", desc: "Track visits", icon: Calendar, href: "/appointments", color: "from-orange-500 to-red-600" },
    { title: "Health Analytics", desc: "Visualize trends", icon: Activity, href: "/health-analytics", color: "from-cyan-500 to-blue-600" },
    { title: "Vital Signs", desc: "Monitor health", icon: Heart, href: "/vital-signs", color: "from-red-500 to-pink-600" },
    { title: "SOS Emergency", desc: "Emergency alert", icon: AlertTriangle, href: "/sos", color: "from-red-500 to-pink-600" },
    { title: "Drug Interaction", desc: "Check safety", icon: Pill, href: "/drug-interaction", color: "from-indigo-500 to-purple-600" },
    { title: "Nearby Hospitals", desc: "Find facilities", icon: Hospital, href: "/nearby-hospitals", color: "from-teal-500 to-cyan-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SOS Floating Button */}
      <button onClick={() => setSosOpen(true)} className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition"><AlertTriangle size={28} /></button>
      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-red-600">Emergency SOS</h2><button onClick={() => setSosOpen(false)}><X size={24} /></button></div>
            <a href="tel:112" className="block w-full bg-red-600 text-white text-center py-3 rounded-xl font-bold">Call Emergency (112)</a>
            <Link href="/emergency-contacts" className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl mt-3" onClick={() => setSosOpen(false)}>Emergency Contacts</Link>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div><h1 className="text-2xl font-bold">{greeting}, {user.name}! 👋</h1><p className="text-gray-500 text-sm">Your health hub</p></div>
          <div className="flex gap-3">
            <Link href="/profile"><User size={20} /></Link>
            <Link href="/settings"><Settings size={20} /></Link>
            <button onClick={logout}><LogOut size={20} className="text-red-600" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {weather && <div className="bg-blue-50 rounded-xl p-4 mb-4 border">{weather.temp}°C – {weather.tip}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UnifiedHealthSummary userId={user.id} />
          <div><StepCounter /><AIHealthInsights userId={user.id} className="mt-4" /></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-gray-500 text-sm">Medications</p><p className="text-2xl font-bold">{stats.meds}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-gray-500 text-sm">Appointments</p><p className="text-2xl font-bold">{stats.apts}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-gray-500 text-sm">Health Records</p><p className="text-2xl font-bold">{stats.health}</p></div>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4"><p className="text-gray-600 text-sm">Adherence</p><p className="text-2xl font-bold">{adherenceScore}%</p></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Link key={i} href={f.href} className="group">
              <div className="bg-white rounded-xl border p-3 hover:shadow transition">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${f.color} flex items-center justify-center mb-2`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <FloatingActionMenu /><VoiceAssistant />
    </div>
  );
}
