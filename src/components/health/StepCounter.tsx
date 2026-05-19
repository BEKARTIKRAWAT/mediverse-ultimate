"use client";
import { useState, useEffect } from "react";
import { Footprints } from "lucide-react";

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [permission, setPermission] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!("DeviceMotionEvent" in window)) {
      setError(true);
      return;
    }

    const requestPermission = async () => {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const response = await (DeviceMotionEvent as any).requestPermission();
          setPermission(response === "granted");
        } catch {
          setError(true);
        }
      } else {
        setPermission(true);
      }
    };

    requestPermission();

    if (!permission) return;

    let lastStepTime = 0;
    let lastAcceleration = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      const acceleration = event.accelerationIncludingGravity?.x || 0;
      const isWalkingStep = Math.abs(acceleration - lastAcceleration) > 1.5 && (now - lastStepTime) > 400;

      if (isWalkingStep) {
        setSteps(prevSteps => prevSteps + 1);
        lastStepTime = now;
      }
      lastAcceleration = acceleration;
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [permission]);

  if (error) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-500">
          <Footprints className="w-5 h-5" />
          <span className="text-sm">Step counter requires device motion permission.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Footprints className="w-6 h-6 text-blue-500" />
          <span className="font-medium text-gray-700">Today's Steps</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">{steps}</div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {permission ? "Counting steps from device motion" : "Tap to enable step tracking"}
      </p>
    </div>
  );
}
