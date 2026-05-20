export const dynamic = 'force-dynamic';
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Newspaper, ExternalLink, Loader2, Calendar, Heart, TrendingUp, Apple, Brain, Shield } from "lucide-react";

const CATEGORIES = [
  { id: "health", label: "🏥 General Health", icon: <Heart size={16} /> },
  { id: "fitness", label: "💪 Fitness", icon: <TrendingUp size={16} /> },
  { id: "nutrition", label: "🥗 Nutrition", icon: <Apple size={16} /> },
  { id: "mental health", label: "🧠 Mental Health", icon: <Brain size={16} /> },
  { id: "covid", label: "🦠 COVID‑19", icon: <Shield size={16} /> },
];

export default function HealthNewsPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("health");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/news?category=${encodeURIComponent(category)}`);
        const data = await res.json();
        if (data.articles && data.articles.length) {
          setArticles(data.articles);
          setLastUpdated(new Date());
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error(err);
        setArticles([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [category]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Live Health News
              </h1>
            </div>
            {lastUpdated && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  category === c.id
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No news available. Try another category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any, idx: any) => (
                <div key={idx} className="group bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
                  <div className="p-5 flex-1">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{article.source}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                    {article.url && article.url !== "#" ? (
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Read full story <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Read more on source</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
            📰 Sources: WHO, Men's Health, Healthline, Psychology Today • Updates every hour
          </div>
        </div>
      </div>
    </div>
  );
}



