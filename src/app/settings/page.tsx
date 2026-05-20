"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useState, useEffect } from "react";
import { 
  Moon, Sun, Download, Upload, FileText, Bell, Mic, Globe, 
  Trash2, Shield, Smartphone, ChevronRight, CheckCircle, AlertCircle,
  Save, User, Key, LogOut
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [activeTab, setActiveTab] = useState("preferences");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Load dark mode from localStorage on mount
  useEffect(() => {
    const savedDark = localStorage.getItem("mediverse_dark_mode") === "true";
    if (savedDark !== settings.darkMode) {
      updateSettings({ darkMode: savedDark });
    }
  }, []);

  // Toggle dark mode and persist
  const toggleDarkMode = () => {
    const newDark = !settings.darkMode;
    updateSettings({ darkMode: newDark });
    localStorage.setItem("mediverse_dark_mode", String(newDark));
    if (newDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // Export all user data as JSON
  const exportAllData = () => {
    if (!user) return;
    setExporting(true);
    const data = {
      user: { id: user.id, email: user.email, name: user?.name || user?.email?.split("@")[0] },
      medications: JSON.parse(localStorage.getItem(`mediverse_meds_${user.id}`) || "[]"),
      appointments: JSON.parse(localStorage.getItem(`mediverse_appointments_${user.id}`) || "[]"),
      healthMetrics: JSON.parse(localStorage.getItem(`mediverse_health_${user.id}`) || "[]"),
      vitals: JSON.parse(localStorage.getItem(`mediverse_vitals_${user.id}`) || "[]"),
      mood: JSON.parse(localStorage.getItem(`mediverse_mood_${user.id}`) || "[]"),
      journal: JSON.parse(localStorage.getItem(`mediverse_journal_${user.id}`) || "[]"),
      bp: JSON.parse(localStorage.getItem(`mediverse_bp_${user.id}`) || "[]"),
      sleep: JSON.parse(localStorage.getItem(`mediverse_sleep_${user.id}`) || "[]"),
      water: JSON.parse(localStorage.getItem(`mediverse_water_${user.id}`) || "[]"),
      reminders: JSON.parse(localStorage.getItem(`mediverse_reminders_${user.id}`) || "[]"),
      emergencyContacts: JSON.parse(localStorage.getItem(`mediverse_emergency_${user.id}`) || "[]"),
      medicalID: JSON.parse(localStorage.getItem(`mediverse_medicalid_${user.id}`) || "{}"),
      settings: settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediverse_backup_${user.id}_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  // Import data from JSON file
  const importAllData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.medications) localStorage.setItem(`mediverse_meds_${user.id}`, JSON.stringify(data.medications));
        if (data.appointments) localStorage.setItem(`mediverse_appointments_${user.id}`, JSON.stringify(data.appointments));
        if (data.healthMetrics) localStorage.setItem(`mediverse_health_${user.id}`, JSON.stringify(data.healthMetrics));
        if (data.vitals) localStorage.setItem(`mediverse_vitals_${user.id}`, JSON.stringify(data.vitals));
        if (data.mood) localStorage.setItem(`mediverse_mood_${user.id}`, JSON.stringify(data.mood));
        if (data.journal) localStorage.setItem(`mediverse_journal_${user.id}`, JSON.stringify(data.journal));
        if (data.bp) localStorage.setItem(`mediverse_bp_${user.id}`, JSON.stringify(data.bp));
        if (data.sleep) localStorage.setItem(`mediverse_sleep_${user.id}`, JSON.stringify(data.sleep));
        if (data.water) localStorage.setItem(`mediverse_water_${user.id}`, JSON.stringify(data.water));
        if (data.reminders) localStorage.setItem(`mediverse_reminders_${user.id}`, JSON.stringify(data.reminders));
        if (data.emergencyContacts) localStorage.setItem(`mediverse_emergency_${user.id}`, JSON.stringify(data.emergencyContacts));
        if (data.medicalID) localStorage.setItem(`mediverse_medicalid_${user.id}`, JSON.stringify(data.medicalID));
        if (data.settings) {
          updateSettings(data.settings);
          if (data.settings.darkMode) document.documentElement.classList.add("dark");
          else document.documentElement.classList.remove("dark");
        }
        alert("✅ Import successful! Refresh to see changes.");
      } catch (err) {
        alert("❌ Invalid file. Please select a valid Mediverse backup JSON.");
      }
      setImporting(false);
    };
    reader.readAsText(file);
  };

  // Generate comprehensive PDF report
  const generatePDFReport = async () => {
    if (!user) return;
    setGeneratingPDF(true);
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Mediverse Health Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`User: ${user?.name || user?.email?.split("@")[0]} (${user.email})`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);
    doc.text(`User ID: ${user.id}`, 14, 44);
    
    let y = 50;
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user.id}`) || "[]");
    if (meds.length) {
      doc.setFontSize(12);
      doc.text("Medications", 14, y);
      y += 6;
      autoTable(doc, { startY: y, head: [["Name", "Dosage", "Times"]], body: meds.map((m: any) => [m.name, m.dosage || "-", m.times?.join(", ") || "-"]), theme: 'striped' });
      y = (doc as any).lastAutoTable?.finalY + 10;
    }
    
    const appointments = JSON.parse(localStorage.getItem(`mediverse_appointments_${user.id}`) || "[]");
    if (appointments.length) {
      doc.text("Appointments", 14, y);
      y += 6;
      autoTable(doc, { startY: y, head: [["Doctor", "Specialty", "Date", "Time"]], body: appointments.map((a: any) => [a.doctorName, a.specialty, a.date, a.time]), theme: 'striped' });
      y = (doc as any).lastAutoTable?.finalY + 10;
    }
    
    const vitals = JSON.parse(localStorage.getItem(`mediverse_vitals_${user.id}`) || "[]");
    if (vitals.length) {
      doc.text("Vitals History", 14, y);
      y += 6;
      autoTable(doc, { startY: y, head: [["Type", "Value", "Date"]], body: vitals.slice(-10).map((v: any) => [v.type, v.value, v.date]), theme: 'striped' });
      y = (doc as any).lastAutoTable?.finalY + 10;
    }
    
    doc.save(`Mediverse_Report_${user?.name || user?.email?.split("@")[0]}_${new Date().toISOString().slice(0,10)}.pdf`);
    setGeneratingPDF(false);
  };

  // Clear all user data
  const clearAllData = () => {
    if (!user) return;
    if (confirm("⚠️ WARNING: This will delete ALL your data (medications, appointments, health logs, etc.). This action cannot be undone. Are you sure?")) {
      setClearing(true);
      const keys = [
        `mediverse_meds_${user.id}`, `mediverse_appointments_${user.id}`, `mediverse_health_${user.id}`,
        `mediverse_vitals_${user.id}`, `mediverse_mood_${user.id}`, `mediverse_journal_${user.id}`,
        `mediverse_bp_${user.id}`, `mediverse_sleep_${user.id}`, `mediverse_water_${user.id}`,
        `mediverse_reminders_${user.id}`, `mediverse_emergency_${user.id}`, `mediverse_medicalid_${user.id}`,
        `mediverse_chat_${user.id}`, `mediverse_streaks_${user.id}`, `mediverse_refills_${user.id}`
      ];
      keys.forEach(k => localStorage.removeItem(k));
      alert("All your data has been cleared. The page will now refresh.");
      window.location.reload();
      setClearing(false);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      updateSettings({ notifications: permission === "granted" });
    }
  };

  // Change password (simple client-side demo – replace with real backend)
  const changePassword = () => {
    if (!oldPassword || !newPassword) return;
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    const userData = users[user?.email];
    if (userData && userData.password === oldPassword) {
      userData.password = newPassword;
      users[user?.email] = userData;
      localStorage.setItem("mediverse_users", JSON.stringify(users));
      setPasswordMessage("✅ Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setPasswordMessage(""), 3000);
    } else {
      setPasswordMessage("❌ Incorrect old password");
      setTimeout(() => setPasswordMessage(""), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Settings</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {["preferences", "data", "account", "security"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div><h3 className="font-semibold">Dark Mode</h3><p className="text-sm text-gray-500">Toggle between light and dark themes</p></div>
              <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">{settings.darkMode ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-gray-600" />}</button>
            </div>
            <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div><h3 className="font-semibold">Browser Notifications</h3><p className="text-sm text-gray-500">Receive medication reminders and health tips</p></div>
              <button onClick={requestNotificationPermission} className="bg-blue-500 text-white px-3 py-1 rounded">{settings.notifications ? "✅ Enabled" : "Enable"}</button>
            </div>
            <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div><h3 className="font-semibold">Voice Assistant</h3><p className="text-sm text-gray-500">Enable voice commands for navigation</p></div>
              <button onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">{settings.voiceEnabled ? <Mic size={20} className="text-green-500" /> : <Mic size={20} className="text-gray-400" />}</button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div><h3 className="font-semibold">Language</h3><p className="text-sm text-gray-500">Choose your preferred language</p></div>
              <select className="border rounded p-2" value={settings.language} onChange={e => updateSettings({ language: e.target.value })}>
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === "data" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div className="flex flex-wrap gap-4">
              <button onClick={exportAllData} disabled={exporting} className="bg-green-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"><Download size={18} /> {exporting ? "Exporting..." : "Export All Data (JSON)"}</button>
              <label className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 cursor-pointer"><Upload size={18} /> {importing ? "Importing..." : "Import Backup"}<input type="file" accept=".json" onChange={importAllData} className="hidden" disabled={importing} /></label>
              <button onClick={generatePDFReport} disabled={generatingPDF} className="bg-purple-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"><FileText size={18} /> {generatingPDF ? "Generating..." : "PDF Health Report"}</button>
            </div>
            <div className="border-t dark:border-gray-700 pt-4 mt-2">
              <button onClick={clearAllData} disabled={clearing} className="bg-red-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"><Trash2 size={18} /> {clearing ? "Clearing..." : "Clear All User Data"}</button>
              <p className="text-xs text-gray-400 mt-2">⚠️ This will delete all your medications, appointments, health logs, and settings.</p>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b dark:border-gray-700">
              <User size={40} className="text-blue-500" />
              <div><p className="font-semibold">{user?.name || user?.email?.split("@")[0]}</p><p className="text-sm text-gray-500">{user.email}</p></div>
            </div>
            <div className="space-y-2">
              <p><strong>Member since:</strong> {new Date(parseInt(user.id)).toLocaleDateString()}</p>
              <p><strong>Data stored:</strong> Locally on this device</p>
            </div>
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2"><Key size={16} /> Change Password</button>
            {showPasswordForm && (
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl space-y-3">
                <input type="password" placeholder="Old Password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} className="w-full border rounded p-2" />
                <input type="password" placeholder="New Password (min 6 chars)" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full border rounded p-2" />
                <button onClick={changePassword} className="bg-green-600 text-white px-4 py-2 rounded">Update Password</button>
                {passwordMessage && <p className="text-sm">{passwordMessage}</p>}
              </div>
            )}
            <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 w-full justify-center"><LogOut size={18} /> Logout</button>
          </div>
        )}

        {/* Security Tab – placeholders for future features */}
                {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {/* 2FA Section */}
            <div className="border-b dark:border-gray-700 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Two‑Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => window.window.window.location.href = "/settings/2fa"}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Set Up 2FA
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">We’ll guide you through enabling TOTP authenticator apps (Google Authenticator, etc.).</p>
            </div>

            {/* Session Management */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div>
                    <p className="font-medium">Current session</p>
                    <p className="text-xs text-gray-500">This device • {new Date().toLocaleString()}</p>
                  </div>
                  <span className="text-green-600 text-sm">Active now</span>
                </div>
                {/* Show other remembered sessions (if any) */}
                {(() => {
                  const savedSessions = JSON.parse(localStorage.getItem("mediverse_sessions") || "[]");
                  return savedSessions.map((s: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div>
                        <p className="font-medium">{s.device || "Unknown device"}</p>
                        <p className="text-xs text-gray-500">{s.location || "Unknown location"} • {s.lastActive}</p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = savedSessions.filter((_: any, i: number) => i !== idx);
                          localStorage.setItem("mediverse_sessions", JSON.stringify(updated));
                          window.location.reload();
                        }}
                        className="text-red-500 text-sm"
                      >
                        Revoke
                      </button>
                    </div>
                  ));
                })()}
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("mediverse_sessions");
                  alert("All other sessions have been revoked.");
                  window.location.reload();
                }}
                className="mt-4 text-red-600 text-sm"
              >
                Revoke All Other Sessions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}










