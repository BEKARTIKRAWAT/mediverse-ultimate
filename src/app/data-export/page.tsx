"use client";
import { useAuth } from "@/context/AuthContext";
import { Download, FileSpreadsheet } from "lucide-react";

export default function DataExport() {
  const { user } = useAuth();

  const exportCSV = () => {
    if (!user) return;
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user?.id}`) || "[]");
    const vitals = JSON.parse(localStorage.getItem(`mediverse_vitals_${user?.id}`) || "[]");
    const health = JSON.parse(localStorage.getItem(`mediverse_health_${user?.id}`) || "[]");
    let csv = "Type,Name,Value,Date\n";
    meds.forEach((m: any) => csv += `Medication,${m.name},${m.dosage || ""},${m.startDate || ""}\n`);
    vitals.forEach((v: any) => csv += `Vital,${v.type},${v.value},${v.date}\n`);
    health.forEach((h: any) => csv += `Health,${h.type},${h.value},${h.date}\n`);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediverse_data_${user?.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-6 text-center">
        <FileSpreadsheet className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Health Data Export</h1>
        <p className="text-gray-500 mb-4">Download all your health data as CSV</p>
        <button onClick={exportCSV} className="bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 mx-auto"><Download size={18} /> Export CSV</button>
        <p className="text-xs text-gray-400 mt-4">Includes medications, vitals, and health metrics.</p>
      </div>
    </div>
  );
}




