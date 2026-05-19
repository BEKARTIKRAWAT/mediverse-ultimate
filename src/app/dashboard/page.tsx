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
  const [weather, setWeather] = useState<{ temp: number; tip: string } | null>(null);
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
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user?.id}`) || "[]");
    const apts = JSON.parse(localStorage.getItem(`mediverse_appointments_${user?.id}`) || "[]");
    const health = JSON.parse(localStorage.getItem(`mediverse_health_${user?.id}`) || "[]");
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
    { title: "Live Monitor", desc: "Real‑time steps & heart rate", icon: Activity, href: "/live-monitor", color: "from-blue-500 to-cyan-600" },
    { title: "AI Symptom Checker", desc: "Advanced AI analysis", icon: Brain, href: "/ai-symptom-checker", color: "from-purple-500 to-pink-600" },
    { title: "Med Reminder", desc: "Push notifications", icon: Clock, href: "/med-reminder", color: "from-orange-500 to-red-600" },
    { title: "Data Export", desc: "Download CSV", icon: Download, href: "/data-export", color: "from-green-500 to-teal-600" },
    { title: "Sleep Tracker", desc: "Log sleep hours", icon: Moon, href: "/sleep-tracker", color: "from-indigo-500 to-purple-600" },
    { title: "Water Reminder", desc: "Track hydration", icon: Droplet, href: "/water-reminder", color: "from-blue-500 to-cyan-600" },
    { title: "Health Journal", desc: "Daily health notes", icon: BookOpen, href: "/health-journal", color: "from-green-500 to-teal-600" },
    { title: "Exercise Library", desc: "Workout ideas", icon: Dumbbell, href: "/exercise-library", color: "from-orange-500 to-red-600" },
    { title: "BMI Calculator", desc: "Track body mass", icon: Activity, href: "/bmi-calculator", color: "from-purple-500 to-pink-600" },
    { title: "BP Tracker", desc: "Blood pressure log", icon: Heart, href: "/bp-tracker", color: "from-red-500 to-pink-600" },
    { title: "Health Tip", desc: "AI daily wellness", icon: Lightbulb, href: "/health-tip", color: "from-yellow-500 to-orange-600" },
    { title: "Medical ID", desc: "Emergency info", icon: IdCard, href: "/medical-id", color: "from-blue-500 to-cyan-600" },
    { title: "Step Challenge", desc: "Daily step goals", icon: Footprints, href: "/step-challenge", color: "from-green-500 to-teal-600" },
    { title: "Telemedicine", desc: "Video call with doctor", icon: Video, href: "/telemedicine", color: "from-purple-500 to-pink-600" },
    { title: "Diet Plan", desc: "AI‑generated meal plans", icon: Apple, href: "/diet-plan", color: "from-green-500 to-teal-600" },
    { title: "Health Report", desc: "AI‑powered PDF report", icon: FileText, href: "/health-report", color: "from-purple-500 to-pink-600" },
    { title: "AI Doctor", desc: "Consult AI for health", icon: Stethoscope, href: "/ai-doctor", color: "from-blue-600 to-indigo-600" },
    { title: "Live Dashboard", desc: "Real‑time simulation", icon: Zap, href: "/live-dashboard", color: "from-yellow-500 to-orange-600" },
    { title: "Weekly Summary", desc: "Email your report", icon: Mail, href: "/weekly-summary", color: "from-green-500 to-teal-600" },
    { title: "Health Coach", desc: "AI wellness advice", icon: Brain, href: "/health-coach", color: "from-teal-500 to-cyan-600" },
    { title: "Vital Signs", desc: "Monitor heart & BP", icon: Heart, href: "/vital-signs", color: "from-red-500 to-pink-600" },
    { title: "Health Predictor", desc: "AI trend forecast", icon: TrendingUp, href: "/health-predictor", color: "from-blue-500 to-cyan-600" },
    { title: "AI Risk Predictor", desc: "Risk assessment", icon: Shield, href: "/ai-risk", color: "from-red-500 to-purple-600" },
    { title: "Mental Health", desc: "Mood check‑in", icon: Smile, href: "/mental-health", color: "from-purple-500 to-pink-600" },
    { title: "AI Chat", desc: "Chat with AI", icon: MessageCircle, href: "/ai-chat", color: "from-blue-500 to-indigo-600" },
    { title: "Medication Tracker", desc: "Manage meds", icon: Pill, href: "/medication-tracker", color: "from-green-500 to-teal-600" },
    { title: "Appointments", desc: "Track visits", icon: Calendar, href: "/appointments", color: "from-orange-500 to-red-600" },
    { title: "Health Analytics", desc: "Visualize trends", icon: Activity, href: "/health-analytics", color: "from-cyan-500 to-blue-600" },
    { title: "Fitness Plan", desc: "AI workouts", icon: Dumbbell, href: "/fitness-plan", color: "from-green-500 to-teal-600" },
    { title: "Refill Tracker", desc: "Refill reminders", icon: Pill, href: "/refill-tracker", color: "from-orange-500 to-red-600" },
    { title: "Barcode Scanner", desc: "Scan meds", icon: Camera, href: "/barcode-scanner", color: "from-purple-500 to-pink-600" },
    { title: "Health News", desc: "Latest updates", icon: Newspaper, href: "/health-news", color: "from-blue-500 to-cyan-600" },
    { title: "Emergency Contacts", desc: "Store & alert", icon: Phone, href: "/emergency-contacts", color: "from-red-500 to-orange-600" },
    { title: "SOS Emergency", desc: "One‑tap alert", icon: AlertTriangle, href: "/sos", color: "from-red-500 to-pink-600" },
    { title: "Drug Interaction", desc: "Check safety", icon: Pill, href: "/drug-interaction", color: "from-indigo-500 to-purple-600" },
    { title: "Nearby Hospitals", desc: "Find facilities", icon: Hospital, href: "/nearby-hospitals", color: "from-teal-500 to-cyan-600" },
    { title: "Health Streaks", desc: "Achievements", icon: Trophy, href: "/streaks", color: "from-amber-500 to-orange-600" }
  ];

  return (
    <>
      {/* SOS Modal */}
      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2"><AlertTriangle /> Emergency SOS</h2>
              <button onClick={() => setSosOpen(false)}><X size={24} /></button>
            </div>
            <p className="text-gray-700 mb-4">Tap below to call emergency services or view your emergency contacts.</p>
            <a href="tel:112" className="block w-full bg-red-600 text-white text-center py-3 rounded-xl font-bold text-lg mb-3 hover:bg-red-700 transition">🚨 Call Emergency (112)</a>
            <Link href="/emergency-contacts" className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-medium hover:bg-blue-700 transition" onClick={() => setSosOpen(false)}>📞 My Emergency Contacts</Link>
            <p className="text-xs text-gray-400 text-center mt-4">For non‑emergencies, use the app normally.</p>
          </div>
        </div>
      )}

      {/* Floating SOS Button */}
      <button
        onClick={() => setSosOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition animate-pulse"
      >
        <AlertTriangle size={28} />
      </button>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  {greeting}, {user.name.split(" ")[0]}! 👋
                </h1>
                <p className="text-gray-500 text-sm">Your complete health hub</p>
              </div>
              <div className="flex gap-3">
                <Link href="/profile" className="p-2 rounded-full bg-white shadow-sm border hover:shadow-md transition"><User size={20} className="text-blue-600" /></Link>
                <Link href="/settings" className="p-2 rounded-full bg-white shadow-sm border hover:shadow-md transition"><Settings size={20} className="text-gray-600" /></Link>
                <button onClick={logout} className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"><LogOut size={20} className="text-red-600" /></button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {weather && (
            <div className="mb-6 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>🌡️ <strong>{weather.temp}°C</strong> – {weather.tip}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <UnifiedHealthSummary userId={user?.id} />
            <div className="space-y-6">
              <StepCounter />
              <AIHealthInsights userId={user?.id} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border p-4 flex items-center justify-between"><div><p className="text-gray-500 text-sm">Medications</p><p className="text-2xl font-bold">{stats.meds}</p></div><Pill className="w-8 h-8 text-green-500" /></div>
            <div className="bg-white rounded-2xl shadow-sm border p-4 flex items-center justify-between"><div><p className="text-gray-500 text-sm">Appointments</p><p className="text-2xl font-bold">{stats.apts}</p></div><Calendar className="w-8 h-8 text-orange-500" /></div>
            <div className="bg-white rounded-2xl shadow-sm border p-4 flex items-center justify-between"><div><p className="text-gray-500 text-sm">Health Records</p><p className="text-2xl font-bold">{stats.health}</p></div><Activity className="w-8 h-8 text-blue-500" /></div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-100 p-4 flex items-center justify-between"><div><p className="text-gray-600 text-sm">Adherence</p><p className="text-2xl font-bold text-green-700">{adherenceScore}%</p></div><div className="w-12 h-12 rounded-full border-4 border-green-400 flex items-center justify-center text-green-700 font-bold text-lg">{adherenceScore}%</div></div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={20} /> Explore Premium Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {features.map((f: any, i: any) => (
                <Link key={i} href={f.href} className="group">
                  <div className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${f.color} flex items-center justify-center mb-2`}>
                      <f.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">{f.title}</h3>
                    <p className="text-gray-400 text-xs mt-0.5 hidden sm:block">{f.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6 mt-8">
            🔒 Your data is private and stored locally. Your health, your control.
          </p>
        </main>
      </div>
      <FloatingActionMenu />
      <VoiceAssistant />
    </>
  );
}





