import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { healthData } = await request.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });
    
    const prompt = `Analyze this health data and give 3 short actionable insights: ${JSON.stringify(healthData)}. Keep each insight under 100 characters.`;
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }], temperature: 0.5, max_tokens: 200 })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Stay hydrated, sleep well, exercise regularly.";
    return NextResponse.json({ insights: reply.split("\n").filter((l: string) => l.trim()) });
  } catch (err) {
    return NextResponse.json({ insights: ["Keep tracking your health!", "Consult your doctor regularly."] });
  }
}
