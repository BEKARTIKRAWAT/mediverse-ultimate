import { NextResponse } from "next/server";

function detectLanguage(text: string): "en" | "hi" | "hinglish" {
  // Devanagari → Hindi
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  // Hinglish: Roman script but contains common Hindi words (I, mere, mujhe, aap, hai, hoon, nahi, etc.)
  const hinglishIndicators = /\b(mere|mujhe|aap|tum|hai|hoon|nahi|kya|kyu|kar|de|le|ja|aa|diya|liya|kiya|raha|rahi|sakta|sakti|chahiye|bahut|thoda|ek|do|teen|char|panch|aaaj|kal|aana|jana|dena|lena|karna|hona|rehna|dekha|suna|bola|pucha|diya|liya|kiya)\b/i;
  if (hinglishIndicators.test(text)) return "hinglish";
  return "en";
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing Groq API key" }, { status: 500 });

    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    const userText = lastUserMsg?.content || "";
    const lang = detectLanguage(userText);

    let systemPrompt = "";
    if (lang === "hi") {
      systemPrompt = "You are Mediverse AI. Respond in Hindi using simple Devanagari script. Be helpful, empathetic, and safe. Never give emergency medical advice.";
    } else if (lang === "hinglish") {
      systemPrompt = "You are Mediverse AI. Respond in Hinglish (Hindi written in Roman/English script). Use casual, natural Hinglish like 'aapko kaisa lag raha hai?' Keep it friendly and accurate. Never give emergency medical advice.";
    } else {
      systemPrompt = "You are Mediverse AI. Respond in English only. Be helpful, empathetic, and safe. Never give emergency medical advice.";
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message || "Groq error" }, { status: response.status });
    return NextResponse.json({ reply: data.choices[0].message.content, detectedLang: lang });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
