import { NextResponse } from "next/server";

// Verified working RSS feeds (free, no API key)
const CATEGORY_FEEDS = {
  health: "https://api.rss2json.com/v1/api.json?rss_url=https://www.who.int/rss-feeds/news-english.xml",
  fitness: "https://api.rss2json.com/v1/api.json?rss_url=https://www.menshealth.com/uk/feed/",
  nutrition: "https://api.rss2json.com/v1/api.json?rss_url=https://www.healthline.com/nutrition/feed",
  "mental health": "https://api.rss2json.com/v1/api.json?rss_url=https://www.psychologytoday.com/intl/feed",
  covid: "https://api.rss2json.com/v1/api.json?rss_url=https://www.who.int/rss-feeds/covid-19.xml",
};

// Fallback for each category (never empty)
const FALLBACK = {
  health: { title: "WHO: New health guidelines released", description: "Stay updated with global health news.", source: "WHO", url: "https://www.who.int" },
  fitness: { title: "Latest fitness trends", description: "Tips for staying active and healthy.", source: "Men's Health", url: "https://www.menshealth.com" },
  nutrition: { title: "Healthy eating tips", description: "Nutrition advice from experts.", source: "Healthline", url: "https://www.healthline.com" },
  "mental health": { title: "Mental wellness strategies", description: "Coping with stress and anxiety.", source: "Psychology Today", url: "https://www.psychologytoday.com" },
  covid: { title: "COVID-19 global update", description: "Latest pandemic news and safety guidelines.", source: "WHO", url: "https://www.who.int" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "health";
  const feedUrl = CATEGORY_FEEDS[category as keyof typeof CATEGORY_FEEDS];

  if (!feedUrl) {
    return NextResponse.json({ articles: [] });
  }

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      const articles = data.items.slice(0, 12).map((item: any) => ({
        title: item.title,
        description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || "Read more...",
        source: item.author || data.feed?.title || category,
        publishedAt: item.pubDate || new Date().toISOString(),
        url: item.link,
      }));
      return NextResponse.json({ articles });
    } else {
      // Return one fallback article
      const fallback = FALLBACK[category as keyof typeof FALLBACK];
      return NextResponse.json({
        articles: [{
          title: fallback.title,
          description: fallback.description,
          source: fallback.source,
          publishedAt: new Date().toISOString(),
          url: fallback.url,
        }]
      });
    }
  } catch (err) {
    console.error(`Error fetching ${category} news:`, err);
    const fallback = FALLBACK[category as keyof typeof FALLBACK];
    return NextResponse.json({
      articles: [{
        title: fallback.title,
        description: fallback.description + " Check back later.",
        source: fallback.source,
        publishedAt: new Date().toISOString(),
        url: fallback.url,
      }]
    });
  }
}
