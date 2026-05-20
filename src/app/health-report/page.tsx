"use client";
export const dynamic = 'force-dynamic';
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { FileText, Download, Mail, Loader2, TrendingUp, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function HealthReport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const generate = async () => {
      setLoading(true);
      const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user.id}`) || "[]");
      const vitals = JSON.parse(localStorage.getItem(`mediverse_vitals_${user.id}`) || "[]");
      const health = JSON.parse(localStorage.getItem(`mediverse_health_${user.id}`) || "[]");
      const mood = JSON.parse(localStorage.getItem(`mediverse_mood_${user.id}`) || "[]");
      const adherence = meds.reduce((acc: any, m: any) => acc + (m.taken?.length || 0), 0) / (meds.length * 30) * 100;
      setReport({ meds: meds.length, vitals: vitals.length, health: health.length, mood: mood.length, adherence: Math.round(adherence) });
      setLoading(false);
    };
    generate();
  }, [user]);

  const exportPDF = async () => {
    if (!report) return;
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Mediverse Health Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`User: ${user?.name || user?.email?.split("@")[0]} (${user?.email})`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 38);
    autoTable(doc, { startY: 45, head: [["Metric", "Value"]], body: [["Medications tracked", report.meds], ["Vital entries", report.vitals], ["Health logs", report.health], ["Mood entries", report.mood], ["Adherence rate", `${report.adherence}%`]] });
    doc.save("Mediverse_Health_Report.pdf");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2"><FileText /> AI Health Report</h1>
        {loading ? <Loader2 className="animate-spin mx-auto" /> : report && <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3"><div className="bg-blue-50 p-3 rounded-xl"><p className="text-sm text-gray-600">Medications</p><p className="text-2xl font-bold">{report.meds}</p></div>
          <div className="bg-green-50 p-3 rounded-xl"><p className="text-sm text-gray-600">Vital Entries</p><p className="text-2xl font-bold">{report.vitals}</p></div>
          <div className="bg-purple-50 p-3 rounded-xl"><p className="text-sm text-gray-600">Health Logs</p><p className="text-2xl font-bold">{report.health}</p></div>
          <div className="bg-yellow-50 p-3 rounded-xl"><p className="text-sm text-gray-600">Mood Entries</p><p className="text-2xl font-bold">{report.mood}</p></div>
          <div className="bg-indigo-50 p-3 rounded-xl col-span-2"><p className="text-sm text-gray-600">Medication Adherence</p><p className="text-2xl font-bold">{report.adherence}%</p><div className="h-2 bg-gray-200 rounded-full mt-1"><div className="h-full bg-green-500 rounded-full" style={{ width: `${report.adherence}%` }} /></div></div></div>
          <button onClick={exportPDF} className="w-full bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"><Download size={18} /> Download PDF Report</button>
        </div>}
      </div>
    </div>
  );
}






