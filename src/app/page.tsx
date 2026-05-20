"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/go";
  }, []);
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}
