"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    const userData = users[email];
    if (userData && userData.password === password) {
      const { password: _, ...safeUser } = userData;
      localStorage.setItem("mediverse_current_user", JSON.stringify(safeUser));
      window.location.href = "/dashboard";
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><LogIn className="w-8 h-8 text-white" /></div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your Mediverse account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl" placeholder="you@example.com" /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl" /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl">{loading?"Signing in...":"Sign In"}</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">Don't have an account? <Link href="/register" className="text-blue-600 font-semibold">Sign up</Link></p>
      </div>
    </div>
  );
}
