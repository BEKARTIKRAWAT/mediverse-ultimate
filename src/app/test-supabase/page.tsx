"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function TestSupabase() {
  const supabase = createClient();
  const [result, setResult] = useState("");

  const testInsert = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        user_id: "1779022640713",
        doctor_name: "Test Doctor",
        appointment_date: "2026-05-20",
        appointment_time: "10:00",
      })
      .select();
    if (error) setResult("Error: " + error.message);
    else setResult("Success! Inserted: " + JSON.stringify(data));
  };

  return (
    <div className="p-4">
      <button onClick={testInsert} className="bg-blue-500 text-white p-2 rounded">
        Test Insert to Supabase
      </button>
      <pre>{result}</pre>
    </div>
  );
}
