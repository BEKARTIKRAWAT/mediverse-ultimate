"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Video, Phone, Mic, MicOff, VideoOff } from "lucide-react";

export default function TelemedicinePage() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  const joinCall = () => {
    if (!roomId.trim()) return;
    setJoined(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="text-center mb-6"><Video className="w-12 h-12 text-blue-600 mx-auto" /><h1 className="text-3xl font-bold">Telemedicine Consultation</h1><p className="text-gray-500">Secure video call with your doctor</p></div>
        {!joined ? (
          <div className="space-y-4">
            <input type="text" value={roomId} onChange={e=>setRoomId(e.target.value)} placeholder="Enter room ID or doctor's code" className="w-full border rounded-xl p-3" />
            <button onClick={joinCall} className="w-full bg-blue-600 text-white py-3 rounded-xl">Join Call</button>
            <p className="text-xs text-gray-400 text-center">Use any Jitsi room ID. Your doctor will provide one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center text-white">Live video feed – Jitsi embed would appear here</div>
            <div className="flex justify-center gap-4"><button className="p-3 bg-gray-200 rounded-full"><Mic size={24} /></button><button className="p-3 bg-red-500 text-white rounded-full"><Phone size={24} /></button><button className="p-3 bg-gray-200 rounded-full"><VideoOff size={24} /></button></div>
            <p className="text-center text-sm text-gray-500">Room: {roomId} | Click end call to leave</p>
            <button onClick={()=>setJoined(false)} className="w-full bg-red-600 text-white py-2 rounded-xl">End Call</button>
          </div>
        )}
      </div>
    </div>
  );
}

