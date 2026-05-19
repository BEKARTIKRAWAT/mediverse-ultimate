"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    const success = await register(name, email, password);
    if (success) {
      document.cookie = "mediverse_auth=true; path=/";
      router.push("/dashboard");
    } else {
      setError("Email already exists");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><UserPlus className="w-8 h-8 text-white" /></div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500">Join Mediverse for personalized health</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl" /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl" /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-xl" /></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl">{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">Already have an account? <Link href="/login" className="text-blue-600 font-semibold">Sign in</Link></p>
      </div>
    </div>
  );
}
