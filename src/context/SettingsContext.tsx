"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Settings = {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  voiceEnabled: boolean;
};

const defaultSettings: Settings = {
  darkMode: false,
  language: "en",
  notifications: true,
  voiceEnabled: true,
};

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
} | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("mediverse_settings");
    if (saved) setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    // Apply dark mode class
    if (saved?.darkMode) document.documentElement.classList.add("dark");
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("mediverse_settings", JSON.stringify(updated));
    if (updated.darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
