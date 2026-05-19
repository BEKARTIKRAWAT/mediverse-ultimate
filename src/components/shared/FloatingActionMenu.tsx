"use client";
import { useState } from 'react';
import { Plus, Pill, Calendar, Stethoscope, MessageCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FloatingActionMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const actions = [
    { icon: Pill, label: 'Add Medication', path: '/medication-tracker' },
    { icon: Calendar, label: 'Add Appointment', path: '/appointments' },
    { icon: Stethoscope, label: 'Symptom Checker', path: '/symptom-checker' },
    { icon: MessageCircle, label: 'AI Chat', path: '/ai-chat' },
  ];
  return (
    <div className="fixed bottom-24 right-6 z-50">
      {open && (
        <div className="absolute bottom-16 right-0 space-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => { router.push(action.path); setOpen(false); }}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 w-40"
            >
              <action.icon size={18} /> {action.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
      >
        {open ? <X size={28} /> : <Plus size={28} />}
      </button>
    </div>
  );
}
