"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("mediverse_current_user");
    if (!stored) {
      window.location.href = "/login";
      return;
    }
    setUser(JSON.parse(stored));
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const logout = () => {
    localStorage.removeItem("mediverse_current_user");
    window.location.href = "/login";
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{greeting}, {user.name}! 👋</h1>
            <p className="text-gray-500">Your health dashboard</p>
          </div>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link href="/ai-chat" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">🤖 AI Chat</Link>
          <Link href="/medication-tracker" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">💊 Medications</Link>
          <Link href="/appointments" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">📅 Appointments</Link>
          <Link href="/health-analytics" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">📊 Analytics</Link>
          <Link href="/vital-signs" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">❤️ Vital Signs</Link>
          <Link href="/ai-doctor" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">🩺 AI Doctor</Link>
          <Link href="/mental-health" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">🧠 Mental Health</Link>
          <Link href="/drug-interaction" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">⚠️ Drug Interaction</Link>
          <Link href="/nearby-hospitals" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">🏥 Hospitals</Link>
          <Link href="/sos" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">🆘 SOS</Link>
          <Link href="/health-news" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md">📰 News</Link>
        </div>
      </div>
    </div>
  );
}
