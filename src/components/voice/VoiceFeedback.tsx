"use client";
import { useEffect, useState } from "react";
import { Mic, CheckCircle } from "lucide-react";

export default function VoiceFeedback() {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setLastCommand(e.detail);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };
    window.addEventListener("voiceCommand" as any, handler);
    return () => window.removeEventListener("voiceCommand" as any, handler);
  }, []);

  if (!visible || !lastCommand) return null;
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50 animate-fade-in">
      <Mic size={16} /> "{lastCommand}"
    </div>
  );
}
