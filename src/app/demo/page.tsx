"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoEntry() {
  const router = useRouter();

  useEffect(() => {
    // Create demo user in localStorage
    const users = JSON.parse(localStorage.getItem("mediverse_users") || "{}");
    if (!users["demo@mediverse.com"]) {
      users["demo@mediverse.com"] = {
        id: "demo123",
        email: "demo@mediverse.com",
        name: "Demo User",
        password: "demo123",
      };
      localStorage.setItem("mediverse_users", JSON.stringify(users));
    }
    // Set current user
    localStorage.setItem(
      "mediverse_current_user",
      JSON.stringify({
        id: "demo123",
        email: "demo@mediverse.com",
        name: "Demo User",
      })
    );
    // Go to dashboard
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to demo dashboard...</p>
      </div>
    </div>
  );
}
