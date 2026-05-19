"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { AlertTriangle, Phone, MapPin, Bell, Shield, X } from "lucide-react";

export default function SOSPage() {
  const { user } = useAuth();
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const triggerSOS = () => {
    setActivated(true);
    let timeLeft = 5;
    const interval = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        alert("🚨 EMERGENCY ALERT SENT! (Demo) - Contacting emergency services and your emergency contacts.");
        // In production, you could send SMS/email via API
        setActivated(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">Emergency SOS</h1>
          <p className="text-gray-600 mb-6">Use only in real medical emergencies</p>
          {!activated ? (
            <button
              onClick={triggerSOS}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl text-xl font-bold animate-pulse hover:bg-red-700 transition"
            >
              🚨 TAP FOR EMERGENCY 🚨
            </button>
          ) : (
            <div className="bg-red-100 p-6 rounded-xl">
              <p className="text-red-800 font-bold text-2xl mb-2">SENDING SOS IN {countdown} SECONDS</p>
              <p className="text-red-600">Cancel by refreshing the page (demo only)</p>
            </div>
          )}
          <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2"><Phone size={16} /> Emergency Numbers (India)</h3>
            <p>🚑 Ambulance: 102 / 108</p>
            <p>👮 Police: 100</p>
            <p>🔥 Fire: 101</p>
            <p>❤️ National Health Helpline: 1800-180-1104</p>
          </div>
        </div>
      </div>
    </div>
  );
}

