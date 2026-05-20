export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Camera, Loader2, X } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the scanner component to avoid SSR issues
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false }
);

export default function BarcodeScannerPage() {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ name: string; dosage?: string } | null>(null);
  const [error, setError] = useState("");

  const handleScan = async (data: string | null) => {
    if (!data) return;
    setScanning(false);
    setError("");
    try {
      // Use free OpenFDA API to lookup drug by NDC code (if barcode contains NDC)
      const ndcMatch = data.match(/\d{4,11}/);
      if (ndcMatch) {
        const res = await fetch(`https://api.fda.gov/drug/ndc.json?search=product_ndc:${ndcMatch[0]}`);
        const json = await res.json();
        if (json.results?.[0]) {
          setResult({ name: json.results[0].brand_name, dosage: json.results[0].dosage_form });
        } else {
          setResult({ name: "Unknown medication" });
        }
      } else {
        setResult({ name: "Scanned: " + data.substring(0, 30) });
      }
    } catch (err) {
      setError("Could not identify medication. Try manually.");
      setResult(null);
    }
  };

  const addToMedications = () => {
    if (!result || !user) return;
    const meds = JSON.parse(localStorage.getItem(`mediverse_meds_${user?.id}`) || "[]");
    meds.push({ id: Date.now().toString(), name: result.name, dosage: result.dosage || "Unknown", times: ["09:00"], taken: [] });
    localStorage.setItem(`mediverse_meds_${user?.id}`, JSON.stringify(meds));
    alert(`Added ${result.name} to your medications!`);
    setResult(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Medication Barcode Scanner</h1>
        </div>
        {!scanning ? (
          <button onClick={() => setScanning(true)} className="bg-blue-600 text-white px-6 py-2 rounded-xl w-full">
            Start Camera
          </button>
        ) : (
          <div className="relative">
            <Scanner onScan={(detectedCodes) => handleScan(detectedCodes[0]?.rawValue)} onError={() => setError("Camera error")} constraints={{ facingMode: "environment" }} />
            <button onClick={() => setScanning(false)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">
              <X size={18} />
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl">
            <p><strong>Medication:</strong> {result.name}</p>
            {result.dosage && <p><strong>Dosage:</strong> {result.dosage}</p>}
            <button onClick={addToMedications} className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg">
              Add to My Meds
            </button>
          </div>
        )}
      </div>
    </div>
  );
}




