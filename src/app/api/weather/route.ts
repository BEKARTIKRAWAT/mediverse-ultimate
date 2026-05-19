import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "28.6139";
  const lon = searchParams.get("lon") || "77.2090";
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
    const data = await res.json();
    const temp = data.current_weather?.temperature;
    let tip = "";
    if (temp > 35) tip = "☀️ Extreme heat! Stay hydrated, avoid sun exposure between 12-4 PM.";
    else if (temp < 10) tip = "❄️ Cold weather alert. Dress warmly, limit outdoor time.";
    else tip = "🌤️ Weather is pleasant. Great for outdoor walks!";
    return NextResponse.json({ temp, tip, forecast: data.daily });
  } catch {
    return NextResponse.json({ temp: null, tip: "Weather data unavailable.", forecast: null });
  }
}
