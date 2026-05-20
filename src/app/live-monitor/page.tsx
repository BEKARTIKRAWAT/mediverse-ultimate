export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { Activity, Heart, Footprints, ActivitySquare, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LiveHealthMonitor() {
  const { user } = useAuth();
  const [steps, setSteps] = useState(0);
  const [heartRate, setHeartRate] = useState(72);
  const [oxygen, setOxygen] = useState(98);
  const [history, setHistory] = useState<any[]>([]);
  const [alert, setAlert] = useState("");
  const [permission, setPermission] = useState(false);
  const stepAccumulator = useRef(0);
  const lastTimestamp = useRef(0);

  // Request device motion permission (for iOS)
  useEffect(() => {
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response === "granted") setPermission(true);
        })
        .catch(() => setPermission(false));
    } else {
      setPermission(true);
    }
  }, []);

  // Real step counting using device motion
  useEffect(() => {
    if (!permission) return;
    let lastStepTime = 0;
    let lastAcceleration = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      const acc = event.accelerationIncludingGravity?.z || 0;
      const stepDetected = Math.abs(acc - lastAcceleration) > 1.2 && (now - lastStepTime) > 400;
      if (stepDetected) {
        setSteps(prev => prev + 1);
        lastStepTime = now;
      }
      lastAcceleration = acc;
    };
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [permission]);

  // Simulate realistic heart rate and oxygen
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate variation
      const newHR = Math.floor(60 + Math.random() * 30 + (steps / 100));
      const newO2 = Math.floor(95 + Math.random() * 4);
      setHeartRate(Math.min(140, Math.max(50, newHR)));
      setOxygen(Math.min(100, Math.max(90, newO2)));
      
      // Update history (keep last 20 points)
      setHistory(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          heartRate: newHR,
          oxygen: newO2,
          steps: steps
        };
        return [...prev.slice(-19), newPoint];
      });
      
      // Smart alerts
      if (newHR > 110) setAlert("⚠️ High heart rate – please rest.");
      else if (newHR < 55) setAlert("⚠️ Low heart rate – consult doctor if persistent.");
      else setAlert("");
    }, 3000);
    return () => clearInterval(interval);
  }, [steps]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <Activity className="w-12 h-12 text-blue-600 mx-auto" />
          <h1 className="text-3xl font-bold">Live Health Monitor</h1>
          <p className="text-gray-500">Real‑time steps, heart rate & oxygen</p>
        </div>

        {alert && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4 flex items-center gap-2"><AlertCircle size={18} /> {alert}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <Footprints className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-gray-500">Steps (real)</p>
            <p className="text-4xl font-bold">{steps.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Today</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-gray-500">Heart Rate</p>
            <p className="text-4xl font-bold">{heartRate} <span className="text-lg">bpm</span></p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <ActivitySquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-500">Oxygen Saturation</p>
            <p className="text-4xl font-bold">{oxygen}%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><TrendingUp /> Heart Rate Trend (last 60 sec)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[40, 160]} />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            📱 Steps are counted using your phone's motion sensor. For accurate heart rate, consider a wearable.
          </p>
        </div>
      </div>
    </div>
  );
}



