"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { Shield, Copy, CheckCircle, AlertCircle } from "lucide-react";

export default function TwoFASetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    // Generate new secret
    const totp = new OTPAuth.TOTP({
      issuer: "Mediverse",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });
    const secretValue = totp.secret.base32;
    setSecret(secretValue);
    // Generate QR code as data URL
    const otpUri = totp.toString();
    QRCode.toDataURL(otpUri, (err, url) => {
      if (!err) setQrCode(url);
    });
    // Generate backup codes (10 random 8-digit codes)
    const codes = Array.from({ length: 10 }, () => Math.floor(10000000 + Math.random() * 90000000).toString());
    setBackupCodes(codes);
  }, [user]);

  const verifyAndEnable = () => {
    if (!verificationCode || !secret) return;
    const totp = new OTPAuth.TOTP({
      secret: secret,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });
    const delta = totp.validate({ token: verificationCode, window: 1 });
    if (delta !== null) {
      // Enable 2FA for user
      const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
      if (users[user?.email]) {
        users[user?.email].twoFactorSecret = secret;
        users[user?.email].backupCodes = backupCodes;
        localStorage.setItem("mediverse_users", JSON.stringify(users));
        setVerified(true);
        setError("");
      }
    } else {
      setError("Invalid verification code. Please try again.");
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    alert("Backup codes copied to clipboard!");
  };

  const finish = () => {
    router.push("/settings");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4"><Shield className="w-8 h-8 text-blue-500" /><h1 className="text-2xl font-bold">Two‑Factor Authentication Setup</h1></div>
        {!verified ? (
          <>
            <p className="mb-4">Scan the QR code below with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.)</p>
            {qrCode && <img src={qrCode} alt="QR Code" className="mx-auto mb-4 border p-2 rounded-lg" />}
            <p className="text-sm text-gray-600 mb-2">Or enter this secret manually: <code className="bg-gray-100 p-1 rounded">{secret}</code></p>
            <input type="text" placeholder="Enter 6-digit code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} className="w-full border rounded p-2 mb-3" />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button onClick={verifyAndEnable} className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full">Verify & Enable 2FA</button>
          </>
        ) : (
          <>
            <div className="bg-green-50 p-4 rounded-xl mb-4 flex items-center gap-2"><CheckCircle className="text-green-600" /> 2FA has been enabled!</div>
            <div className="bg-yellow-50 p-4 rounded-xl mb-4">
              <p className="font-semibold">Save these backup codes (one‑time use)</p>
              <div className="grid grid-cols-2 gap-2 my-2">
                {backupCodes.map((code: any, i: any) => <code key={i} className="bg-white p-1 rounded text-center">{code}</code>)}
              </div>
              <button onClick={copyBackupCodes} className="text-blue-600 text-sm flex items-center gap-1"><Copy size={14} /> Copy codes</button>
              <p className="text-xs text-gray-500 mt-2">Store these somewhere safe. You can use them to log in if you lose your authenticator.</p>
            </div>
            <button onClick={finish} className="bg-gray-600 text-white px-4 py-2 rounded-xl w-full">Go to Settings</button>
          </>
        )}
      </div>
    </div>
  );
}


