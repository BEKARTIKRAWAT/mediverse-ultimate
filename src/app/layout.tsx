import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import ToastProvider from "@/components/ui/ToastProvider";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { Phone } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediverse Ultimate",
  description: "AI Healthcare Platform with 100+ features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider />
            <div className="fixed top-4 right-20 z-50">
              <a
                href="/emergency-contacts"
                className="bg-red-600 text-white px-3 py-2 rounded-full text-sm shadow-lg hover:bg-red-700 flex items-center gap-1"
              >
                <Phone size={14} /> SOS
              </a>
            </div>
            {children}
            <VoiceAssistant />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}



