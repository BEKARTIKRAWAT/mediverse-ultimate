"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Pill, Calendar, MessageCircle, TrendingUp, LogOut, User,
  Sparkles, Bell, ChevronRight, Settings, AlertTriangle, Hospital,
  Trophy, Camera, Newspaper, Phone, Dumbbell, Brain, Smile, Heart, 
  Shield, Zap, Mail, Stethoscope, FileText, Video, Apple, Lightbulb,
  IdCard, Footprints, Moon, Droplet, BookOpen, Download, Clock, Flame, X
} from "lucide-react";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import FloatingActionMenu from "@/components/shared/FloatingActionMenu";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Animated gradient background (pure CSS)
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-xy"></div>
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
    <style jsx>{`
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
      @keyframes gradient-xy {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-xy {
        background-size: 200% 200%;
        animation: gradient-xy 15s ease infinite;
      }
    `}</style>
  </div>
);

// Animated counter
const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const step = Math.ceil(value / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}</span>;
};

// Health Score Ring
const HealthScoreRing = ({ score }: { score: number }) => (
  <div className="w-24 h-24">
    <CircularProgressbar
      value={score}
      text={`${score}%`}
      styles={buildStyles({
        textSize: '24px',
        pathColor: '#3b82f6',
        textColor: '#1e293b',
        trailColor: '#e2e8f0',
      })}
    />
  </div>
);

// Mood Tracker
const MoodWidget = () => {
  const [mood, setMood] = useState("happy");
  const moods = [
    { name: "Happy", emoji: "😊", value: "happy" },
    { name: "Calm", emoji: "😌", value: "calm" },
    { name: "Tired", emoji: "😴", value: "tired" },
    { name: "Stressed", emoji: "😰", value: "stressed" },
  ];
  const handleMoodClick = (m: string) => {
    setMood(m);
    localStorage.setItem("today_mood", m);
  };
  useEffect(() => {
    const saved = localStorage.getItem("today_mood");
    if (saved) setMood(saved);
  }, []);
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30">
      <h3 className="font-semibold flex items-center gap-2 mb-3"><Smile size={18} /> How are you feeling?</h3>
      <div className="flex justify-around">
        {moods.map(m => (
          <button
            key={m.value}
            onClick={() => handleMoodClick(m.value)}
            className={`text-2xl p-2 rounded-full transition ${mood === m.value ? 'bg-blue-100 ring-2 ring-blue-400 scale-110' : 'hover:bg-gray-100'}`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Daily Affirmation
const DailyAffirmation = () => {
  const affirmations = [
    "✨ You are capable of amazing things.",
    "💪 Every step you take is progress.",
    "🧘 Breathe. You’ve got this.",
    "🌟 Your health is your greatest wealth.",
    "🌱 Small changes lead to big results.",
  ];
  const [current, setCurrent] = useState(affirmations[0]);
  useEffect(() => {
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrent(random);
  }, []);
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 text-center text-purple-800 text-sm italic">
      “{current}”
    </div>
  );
};

export default function MainDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ meds: 0, apts: 0, health: 0 });
  const [weather, setWeather] = useState(null);
  const [adherenceScore, setAdherenceScore] = useState(100);
  const [greeting, setGreeting] = useState("");
  const [animatedCounts, setAnimatedCounts] = useState({ meds: 0, apts: 0, health: 0 });
  const [sosOpen, setSosOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [healthScore, setHealthScore] = useState(78);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    const lastLogin = localStorage.getItem("last_login_date");
    const today = new Date().toDateString();
    let currentStreak = parseInt(localStorage.getItem("mediverse_streak") || "0");
    if (lastLogin === today) {
      setStreak(currentStreak);
    } else if (lastLogin === new Date(Date.now() - 86400000).toDateString()) {
      currentStreak++;
      localStorage.setItem("mediverse_streak", currentStreak.toString());
      setStreak(currentStreak);
    } else {
      localStorage.setItem("mediverse_streak", "1");
      setStreak(1);
    }
    localStorage.setItem("last_login_date", today);
    setHealthScore(Math.min(100, Math.max(0, adherenceScore + Math.floor(Math.random() * 20))));
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
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnimatedCounts({
        meds: Math.min(Math.ceil(step * stats.meds / 20), stats.meds),
        apts: Math.min(Math.ceil(step * stats.apts / 20), stats.apts),
        health: Math.min(Math.ceil(step * stats.health / 20), stats.health),
      });
      if (step >= 20) clearInterval(interval);
    }, 30);
  }, [stats]);

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
    { title: "Nearby Hospitals", desc: "Find facilities", icon: Hospital, href: "/nearby-hospitals", color: "from-teal-500 to-cyan-600" },
    { title: "Mental Health", desc: "Mood tracker", icon: Brain, href: "/mental-health", color: "from-purple-500 to-pink-600" },
    { title: "Health News", desc: "Latest updates", icon: Newspaper, href: "/health-news", color: "from-blue-500 to-cyan-600" },
    { title: "Emergency Contacts", desc: "Store & alert", icon: Phone, href: "/emergency-contacts", color: "from-red-500 to-orange-600" },
    { title: "Health Streaks", desc: "Achievements", icon: Trophy, href: "/streaks", color: "from-amber-500 to-orange-600" },
    { title: "Barcode Scanner", desc: "Scan meds", icon: Camera, href: "/barcode-scanner", color: "from-purple-500 to-pink-600" },
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
    { title: "Health Coach", desc: "AI wellness advice", icon: Brain, href: "/health-coach", color: "from-teal-500 to-cyan-600" },
    { title: "Fitness Plan", desc: "AI workouts", icon: Dumbbell, href: "/fitness-plan", color: "from-green-500 to-teal-600" },
    { title: "Refill Tracker", desc: "Refill reminders", icon: Pill, href: "/refill-tracker", color: "from-orange-500 to-red-600" },
    { title: "Weekly Summary", desc: "Email your report", icon: Mail, href: "/weekly-summary", color: "from-green-500 to-teal-600" }
  ];

  return (
    <>
      <AnimatedBackground />
      <AnimatePresence>
        {sosOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-red-600 flex items-center gap-2"><AlertTriangle /> Emergency SOS</h2><button onClick={() => setSosOpen(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={24} /></button></div>
              <a href="tel:112" className="block w-full bg-red-600 text-white text-center py-3 rounded-xl font-bold text-lg mb-3 hover:bg-red-700 transition">🚨 Call Emergency (112)</a>
              <Link href="/emergency-contacts" className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-medium hover:bg-blue-700 transition" onClick={() => setSosOpen(false)}>📞 My Emergency Contacts</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSosOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition"
      >
        <AlertTriangle size={28} />
      </motion.button>

      <div className="relative z-10">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">{greeting}, {user.name}! 👋</h1>
                <p className="text-gray-500 text-sm">Your complete health hub</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/profile" className="p-2 rounded-full bg-white shadow-sm border hover:shadow-md transition"><User size={20} className="text-blue-600" /></Link>
                  <Link href="/settings" className="p-2 rounded-full bg-white shadow-sm border hover:shadow-md transition"><Settings size={20} className="text-gray-600" /></Link>
                  <button onClick={logout} className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"><LogOut size={20} className="text-red-600" /></button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {weather && (
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>🌡️ <strong>{weather.temp}°C</strong> – {weather.tip}</span>
              <div className="flex items-center gap-4"><Flame size={16} className="text-orange-500" /> <span className="font-semibold">{streak} day streak</span></div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <HealthScoreRing score={healthScore} />
            <MoodWidget />
            <DailyAffirmation />
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 p-4 flex items-center justify-between hover:shadow-md transition">
              <div><p className="text-gray-500 text-sm">Medications</p><p className="text-2xl font-bold"><AnimatedCounter value={animatedCounts.meds} /></p></div>
              <Pill className="w-8 h-8 text-green-500" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 p-4 flex items-center justify-between hover:shadow-md transition">
              <div><p className="text-gray-500 text-sm">Appointments</p><p className="text-2xl font-bold"><AnimatedCounter value={animatedCounts.apts} /></p></div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 p-4 flex items-center justify-between hover:shadow-md transition">
              <div><p className="text-gray-500 text-sm">Health Records</p><p className="text-2xl font-bold"><AnimatedCounter value={animatedCounts.health} /></p></div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-100 p-4 flex items-center justify-between">
              <div><p className="text-gray-600 text-sm">Adherence</p><p className="text-2xl font-bold text-green-700">{adherenceScore}%</p></div>
              <div className="w-12 h-12 rounded-full border-4 border-green-400 flex items-center justify-center text-green-700 font-bold text-lg">{adherenceScore}%</div>
            </div>
          </motion.div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={20} /> Explore Premium Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}>
                  <Link href={f.href} className="group">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 p-3 hover:shadow-md transition-all hover:-translate-y-1">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${f.color} flex items-center justify-center mb-2`}>
                        <f.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">{f.title}</h3>
                      <p className="text-gray-500 text-xs mt-0.5 hidden sm:block">{f.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
            🔒 All your data is private and stored locally. Your health, your control.
          </div>
        </main>
      </div>
      <FloatingActionMenu />
      <VoiceAssistant />
    </>
  );
}
