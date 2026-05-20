"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, LogOut, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    const userData = users[user.email];
    if (userData) {
      userData.name = name;
      users[user.email] = userData;
      localStorage.setItem("mediverse_users", JSON.stringify(users));
      // Update current user
      const currentUser = JSON.parse(localStorage.getItem("mediverse_current_user") || "{}");
      currentUser.name = name;
      localStorage.setItem("mediverse_current_user", JSON.stringify(currentUser));
      // Force reload to reflect changes (simple and works)
      window.location.reload();
    }
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-3 pb-3 border-b mb-4">
          <User size={40} className="text-blue-500" />
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-xl p-2"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            ) : (
              <p className="text-gray-800">{user.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-800">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                <Save size={16} /> Save
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                Edit Profile
              </button>
            )}
            <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">
          🔒 Your data is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}


