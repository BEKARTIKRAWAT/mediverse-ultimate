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
  IdCard, Footprints, Moon, Droplet, BookOpen, Download, Clock
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const features = [
    { title: "AI Doctor", icon: Stethoscope, href: "/ai-doctor", color: "from-blue-600 to-indigo-600" },
    { title: "AI Chat", icon: MessageCircle, href: "/ai-chat", color: "from-blue-500 to-indigo-600" },
    { title: "Medication Tracker", icon: Pill, href: "/medication-tracker", color: "from-green-500 to-teal-600" },
    { title: "Appointments", icon: Calendar, href: "/appointments", color: "from-orange-500 to-red-600" },
    { title: "Health Analytics", icon: Activity, href: "/health-analytics", color: "from-cyan-500 to-blue-600" },
    { title: "Vital Signs", icon: Heart, href: "/vital-signs", color: "from-red-500 to-pink-600" },
    { title: "SOS Emergency", icon: AlertTriangle, href: "/sos", color: "from-red-500 to-pink-600" },
    { title: "Drug Interaction", icon: Pill, href: "/drug-interaction", color: "from-indigo-500 to-purple-600" },
    { title: "Nearby Hospitals", icon: Hospital, href: "/nearby-hospitals", color: "from-teal-500 to-cyan-600" },
    { title: "Mental Health", icon: Brain, href: "/mental-health", color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold">{greeting}, {user.name}! 👋</h1><p>Your health dashboard</p></div>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {features.map((f, i) => (
            <Link key={i} href={f.href} className="bg-white p-4 rounded shadow text-center">
              <f.icon className="w-6 h-6 mx-auto mb-2" />
              <span>{f.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
