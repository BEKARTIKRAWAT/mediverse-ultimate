export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Hospital, MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";

export default function NearbyHospitalsReal() {
  const { user, isLoading: authLoading } = useAuth();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await fetchHospitals(latitude, longitude);
      },
      () => {
        setError("Unable to get location. Please enable GPS.");
        setLoading(false);
      }
    );
  }, [user]);

  const fetchHospitals = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const query = `[out:json][timeout:25];node["amenity"="hospital"](around:5000,${lat},${lon});out body;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("xml")) {
        throw new Error("API rate limit or error. Please try again later.");
      }
      const text = await res.text();
      if (text.trim().startsWith("<?xml")) {
        throw new Error("API returned an error (rate limit). Please try again later.");
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid response from hospital service.");
      }
      if (!data.elements || !Array.isArray(data.elements)) {
        setHospitals([]);
        return;
      }
      const list = data.elements.slice(0, 20).map((item: any) => {
        const distance = calculateDistance(lat, lon, item.lat, item.lon);
        return {
          id: item.id,
          name: item.tags?.name || "Unnamed Hospital",
          distance: Math.round(distance * 10) / 10,
          lat: item.lat,
          lon: item.lon,
        };
      }).filter((h: any) => h.name !== "Unnamed Hospital");
      setHospitals(list);
    } catch (err: any) {
      console.error(err);
      // Fallback to demo hospitals if API fails
      setHospitals([
        { id: 1, name: "City General Hospital (Demo)", distance: 2.5, lat: 0, lon: 0 },
        { id: 2, name: "Apollo Clinic (Demo)", distance: 3.2, lat: 0, lon: 0 },
        { id: 3, name: "Fortis Healthcare (Demo)", distance: 4.1, lat: 0, lon: 0 },
      ]);
      setError("Could not fetch live hospitals. Showing demo list.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openDirections = (lat: number, lon: number) => {
    if (lat === 0 && lon === 0) {
      window.open("https://www.google.com/maps/search/hospitals", "_blank");
    } else {
      window.open(`https://www.openstreetmap.org/directions?engine=osrm_car&route=${lat},${lon}`, "_blank");
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4"><Hospital className="w-8 h-8 text-blue-600" /><h1 className="text-2xl font-bold">Nearby Hospitals</h1></div>
        {loading ? (
          <div className="text-center py-10"><Loader2 className="animate-spin mx-auto mb-2" /><p>Loading hospitals...</p></div>
        ) : (
          <>
            {error && <div className="bg-yellow-100 text-yellow-800 p-3 rounded-xl text-sm mb-4">{error}</div>}
            <div className="space-y-3">
              {hospitals.map((h: any) => (
                <div key={h.id} className="border rounded-xl p-3 flex justify-between items-center flex-wrap gap-2">
                  <div><h3 className="font-semibold">{h.name}</h3><p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12}/> {h.distance} km away</p></div>
                  <button onClick={() => openDirections(h.lat, h.lon)} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"><Navigation size={14}/> Directions</button>
                </div>
              ))}
            </div>
          </>
        )}
        <p className="text-xs text-gray-400 mt-4">📍 Live data from OpenStreetMap (fallback demo if API unavailable)</p>
      </div>
    </div>
  );
}



