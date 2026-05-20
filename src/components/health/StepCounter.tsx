"use client";
import { useState, useEffect } from "react";
import { Footprints } from "lucide-react";

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [permission, setPermission] = false;
  useEffect(() => {
    if ("DeviceOrientationEvent" in window && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any).requestPermission().then((response: string) => {
        if (response === "granted") setPermission(true);
      }).catch(() => setPermission(false));
    } else setPermission(true);
    if (!permission) return;
    let lastTime = 0;
    const handleMotion = (e: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - lastTime > 500) {
        setSteps(s => s + 1);
        lastTime = now;
      }
    };
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [permission]);
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Footprints className="w-6 h-6 text-blue-500" /><span className="font-medium">Today's Steps</span></div>
        <span className="text-2xl font-bold">{steps.toLocaleString()}</span>
      </div>
      <p className="text-xs text-gray-400 mt-2">{permission ? "Counting steps from device motion" : "Tap to enable step tracking"}</p>
    </div>
  );
}
