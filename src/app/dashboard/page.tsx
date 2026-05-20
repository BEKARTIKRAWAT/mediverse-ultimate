"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Activity, Pill, Calendar, MessageCircle, TrendingUp, LogOut, User,
  Sparkles, Bell, ChevronRight, Settings, AlertTriangle, Hospital,
  Trophy, Camera, Newspaper, Phone, Dumbbell, Brain, Smile, Heart, 
  Shield, Zap, Mail, Stethoscope, FileText, Video, Apple, Lightbulb,
  IdCard, Footprints, Moon, Droplet, BookOpen, Download, Clock
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({ meds: 0, apts: 0, health: 0 });
  const [adherenceScore, setAdherenceScore] = useState(100);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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

  if (!user) {
    router.push("/login");
    return null;
  }

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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div><h1 className="text-2xl font-bold">{greeting}, {user.name}! 👋</h1><p className="text-gray-500 text-sm">Your complete health hub</p></div>
          <div className="flex gap-3">
            <Link href="/profile"><User size={20} className="text-gray-600" /></Link>
            <Link href="/settings"><Settings size={20} className="text-gray-600" /></Link>
            <button onClick={logout}><LogOut size={20} className="text-red-600" /></button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <Link key={i} href={f.href} className="group">
              <div className="bg-white rounded-xl border p-3 hover:shadow transition">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${f.color} flex items-center justify-center mb-2`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 hidden sm:block">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">
          🔒 Demo mode – all data stored locally in your browser
        </div>
      </main>
    </div>
  );
}


