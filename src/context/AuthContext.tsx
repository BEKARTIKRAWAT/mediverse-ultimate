"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("mediverse_current_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    const userData = users[email];
    if (userData && userData.password === password) {
      const { password: _, ...safeUser } = userData;
      setUser(safeUser);
      localStorage.setItem("mediverse_current_user", JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    if (users[email]) return false;
    const newUser = { id: Date.now().toString(), email, name, password };
    users[email] = newUser;
    localStorage.setItem("mediverse_users", JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("mediverse_current_user", JSON.stringify(safeUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mediverse_current_user");
    router.push("/login");
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("mediverse_current_user", JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    if (users[user.email]) {
      users[user.email] = { ...users[user.email], ...data };
      localStorage.setItem("mediverse_users", JSON.stringify(users));
    }
  };

  return <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
