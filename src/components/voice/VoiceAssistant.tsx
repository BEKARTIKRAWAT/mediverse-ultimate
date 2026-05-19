"use client";
import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const router = useRouter();
  let recognition: any = null;

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice not supported');
      return;
    }
    recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      toast.success(`Voice: "${command}"`); window.dispatchEvent(new CustomEvent("voiceCommand", { detail: command }));
      if (command.includes('dashboard')) router.push('/dashboard');
      else if (command.includes('ai chat')) router.push('/ai-chat');
      else if (command.includes('medication')) router.push('/medication-tracker');
      else if (command.includes('appointment')) router.push('/appointments');
      else if (command.includes('symptom')) router.push('/symptom-checker');
      else if (command.includes('drug')) router.push('/drug-interaction');
      else if (command.includes('hospital')) router.push('/nearby-hospitals');
      else if (command.includes('profile')) router.push('/profile');
      else if (command.includes('settings')) router.push('/settings');
      else toast('Command not recognized. Try "dashboard", "ai chat", etc.');
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setListening(false);
  };

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
    >
      {listening ? <MicOff size={28} className="animate-pulse" /> : <Mic size={28} />}
    </button>
  );
}



