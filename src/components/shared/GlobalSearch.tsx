"use client";
import { useAtom } from "jotai";
import { globalSearchAtom } from "@/store/atoms";
import { Search } from "lucide-react";

export default function GlobalSearch() {
  const [query, setQuery] = useAtom(globalSearchAtom);
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search symptoms, medications, doctors..."
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
