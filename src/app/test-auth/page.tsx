"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function TestAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else setMsg("Success! User: " + data.user?.email);
  };

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else setMsg("Check email for confirmation (or disable confirm email)");
  };

  return (
    <div className="p-4">
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border p-2 m-2" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border p-2 m-2" />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 m-2">Login</button>
      <button onClick={handleRegister} className="bg-green-500 text-white p-2 m-2">Register</button>
      <p>{msg}</p>
    </div>
  );
}
