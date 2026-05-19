"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, name: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Initialize supabase client only on client side
    const client = createClient();
    setSupabase(client);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });
    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  const login = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Supabase not initialized") };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const register = async (email: string, password: string, name: string) => {
    if (!supabase) return { error: new Error("Supabase not initialized") };
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { full_name: name } }
    });
    if (!error && data.user && supabase) {
      await supabase.from("profiles").upsert({ id: data.user.id, email, full_name: name });
    }
    return { error };
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user || !supabase) return;
    const updates = { ...data, updated_at: new Date().toISOString() };
    await supabase.auth.updateUser({ data: { full_name: data.full_name } });
    await supabase.from("profiles").upsert({ id: user.id, ...updates });
    const { data: refreshedUser } = await supabase.auth.getUser();
    if (refreshedUser?.user) setUser(refreshedUser.user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
