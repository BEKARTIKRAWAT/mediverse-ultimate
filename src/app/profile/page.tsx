"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, LogOut, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = () => {
    updateProfile({ name });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="bg-white rounded-full p-1">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                {isEditing ? (
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="text-2xl font-bold border-b-2 border-blue-500 px-2" />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-800">{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</h1>
                )}
                <p className="text-gray-500 flex items-center gap-1 mt-1"><Mail size={14} /> {user.email}</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Save</button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Edit Profile</button>
                )}
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><LogOut size={16} /> Logout</button>
              </div>
            </div>
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Account Information</h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>Member since:</strong> {new Date(parseInt(user.id)).toLocaleDateString()}</p>
                <p><strong>Email verified:</strong> Yes (demo)</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">Your data is stored locally on this device.</p>
      </div>
    </div>
  );
}




