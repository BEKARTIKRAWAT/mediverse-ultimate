"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DemoDashboard() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create demo user in localStorage
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    if (!users["demo@mediverse.com"]) {
      users["demo@mediverse.com"] = {
        id: "demo123",
        email: "demo@mediverse.com",
        name: "Demo User",
        password: "demo123",
      };
      localStorage.setItem("mediverse_users", JSON.stringify(users));
    }
    localStorage.setItem("mediverse_current_user", JSON.stringify({
      id: "demo123",
      email: "demo@mediverse.com",
      name: "Demo User",
    }));
    setUser({ name: "Demo User" });
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mediverse_current_user");
    window.location.href = "/login";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const features = [
    { name: "AI Doctor", emoji: "🩺", href: "/ai-doctor" },
    { name: "AI Chat", emoji: "💬", href: "/ai-chat" },
    { name: "Medication Tracker", emoji: "💊", href: "/medication-tracker" },
    { name: "Appointments", emoji: "📅", href: "/appointments" },
    { name: "Health Analytics", emoji: "📊", href: "/health-analytics" },
    { name: "Vital Signs", emoji: "❤️", href: "/vital-signs" },
    { name: "SOS Emergency", emoji: "🆘", href: "/sos" },
    { name: "Drug Interaction", emoji: "⚠️", href: "/drug-interaction" },
    { name: "Nearby Hospitals", emoji: "🏥", href: "/nearby-hospitals" },
    { name: "Mental Health", emoji: "🧠", href: "/mental-health" },
    { name: "Health News", emoji: "📰", href: "/health-news" },
    { name: "Emergency Contacts", emoji: "📞", href: "/emergency-contacts" },
    { name: "Health Streaks", emoji: "🏆", href: "/streaks" },
    { name: "Barcode Scanner", emoji: "📷", href: "/barcode-scanner" },
    { name: "Sleep Tracker", emoji: "😴", href: "/sleep-tracker" },
    { name: "Water Reminder", emoji: "💧", href: "/water-reminder" },
    { name: "Health Journal", emoji: "📓", href: "/health-journal" },
    { name: "Exercise Library", emoji: "💪", href: "/exercise-library" },
    { name: "BMI Calculator", emoji: "📏", href: "/bmi-calculator" },
    { name: "BP Tracker", emoji: "🩸", href: "/bp-tracker" },
    { name: "Health Tip", emoji: "💡", href: "/health-tip" },
    { name: "Medical ID", emoji: "🆔", href: "/medical-id" },
    { name: "Step Challenge", emoji: "👣", href: "/step-challenge" },
    { name: "Telemedicine", emoji: "🎥", href: "/telemedicine" },
    { name: "Diet Plan", emoji: "🍎", href: "/diet-plan" },
    { name: "Health Report", emoji: "📄", href: "/health-report" },
    { name: "Health Coach", emoji: "🧘", href: "/health-coach" },
    { name: "Fitness Plan", emoji: "🏋️", href: "/fitness-plan" },
    { name: "Refill Tracker", emoji: "🔄", href: "/refill-tracker" },
    { name: "Weekly Summary", emoji: "📧", href: "/weekly-summary" },
    { name: "Live Monitor", emoji: "📈", href: "/live-monitor" },
    { name: "AI Risk Predictor", emoji: "🎯", href: "/ai-risk" },
    { name: "Health Predictor Pro", emoji: "📉", href: "/health-predictor" },
    { name: "Symptom Checker", emoji: "🤒", href: "/symptom-checker" },
    { name: "Medical QR", emoji: "🔲", href: "/medical-qr" },
    { name: "Data Export", emoji: "💾", href: "/data-export" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{greeting}, {user.name}! 👋</h1>
            <p className="text-gray-500 text-sm">Your complete health hub (40+ features)</p>
          </div>
          <div className="flex gap-3">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <Link key={i} href={f.href} className="group">
              <div className="bg-white rounded-xl border p-3 hover:shadow transition">
                <div className="text-3xl mb-2">{f.emoji}</div>
                <h3 className="font-semibold text-sm">{f.name}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">
          🔒 Demo mode – all data stored locally.
        </div>
      </main>
    </div>
  );
}
