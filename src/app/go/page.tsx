"use client";
import { useEffect } from "react";

export default function GoToDashboard() {
  useEffect(() => {
    // Create demo user if not exists
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
    localStorage.setItem("mediverse_current_user", JSON.stringify({
      id: "demo123",
      email: "demo@mediverse.com",
      name: "Demo User",
    }));
    // Redirect to dashboard
    window.location.href = "/dashboard";
  }, []);
  return <div className="min-h-screen flex items-center justify-center">Redirecting to dashboard...</div>;
}
