export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download } from "lucide-react";

export default function MedicalQR() {
  const { user } = useAuth();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [info, setInfo] = useState({ bloodType: "", allergies: "", conditions: "", emergencyContact: "" });

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_medicalid_${user.id}`);
    if (saved) setInfo(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    const data = `MEDICAL ID\nName: ${user?.name || user?.email?.split("@")[0]}\nBlood: ${info.bloodType || "Not set"}\nAllergies: ${info.allergies || "None"}\nConditions: ${info.conditions || "None"}\nEmergency: ${info.emergencyContact || "Not set"}`;
    QRCode.toDataURL(data, (err, url) => { if (!err) setQrDataUrl(url); });
  }, [info, user]);

  if (!user) return null;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-6 text-center">
        <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Medical ID QR Code</h1>
        <p className="text-gray-500 mb-4">Scan this in emergency – no phone unlock needed</p>
        {qrDataUrl && <img src={qrDataUrl} alt="Medical QR Code" className="mx-auto border p-2 rounded-xl w-48 h-48" />}
        <a href={qrDataUrl} download="medical_qr.png" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl inline-flex items-center gap-2"><Download size={16} /> Save QR Code</a>
        <p className="text-xs text-gray-400 mt-4">Update your Medical ID in Settings → Account for accurate info.</p>
      </div>
    </div>
  );
}






