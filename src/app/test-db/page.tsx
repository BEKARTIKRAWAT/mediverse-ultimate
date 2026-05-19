"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function TestDB() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.from("profiles").select("*").then(({ data }) => setData(data));
  }, []);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
