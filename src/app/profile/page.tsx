"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, LogOut, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = async () => {
    await updateProfile({ full_name: name });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-3 pb-3 border-b mb-4">
          <User size={40} className="text-blue-500" />
          <div><p className="font-semibold text-gray-800">{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</p><p className="text-sm text-gray-500">{user.email}</p></div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-xl p-2" />
            ) : (
              <p className="text-gray-800">{user?.user_metadata?.full_name || "Not set"}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-800">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Edit Profile</button>
            )}
            <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><LogOut size={16} /> Logout</button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">Your data is stored securely in the cloud.</p>
      </div>
    </div>
  );
}
