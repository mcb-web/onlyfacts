import RSSParser from "rss-parser";

export interface RawArticle {
  sourceKey: string;
  sourceName: string;
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
}

const RSS_FEEDS: Array<{ sourceKey: string; url: string }> = [
  { sourceKey: "nos", url: "https://feeds.nos.nl/nosnieuwsalgemeen" },
  { sourceKey: "telegraaf", url: "https://www.telegraaf.nl/nieuws/rss" },
  { sourceKey: "volkskrant", url: "https://www.volkskrant.nl/rss.xml" },
  { sourceKey: "ad", url: "https://www.ad.nl/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/voorpagina/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/verdieping/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/verhaal-van-de-dag/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/religie-filosofie/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/onderwijs/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/sport/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/opinie/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/cultuur-media/rss.xml" },
  { sourceKey: "trouw", url: "https://www.trouw.nl/wetenschap/rss.xml" },
  { sourceKey: "parool", url: "https://www.parool.nl/rss.xml" },
  { sourceKey: "nrc", url: "https://www.nrc.nl/rss/" },
  { sourceKey: "nd", url: "http://www.nd.nl/rss/nieuws" },
  { sourceKey: "nu", url: "https://www.nu.nl/rss/algemeen" },
  { sourceKey: "eenvandaag", url: "https://eenvandaag.avrotros.nl/feed/" },
  { sourceKey: "joop", url: "https://www.bnnvara.nl/api/rss/joop" },
  { sourceKey: "bbc", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { sourceKey: "cnn", url: "http://rss.cnn.com/rss/cnn_world.rss" },
  { sourceKey: "aljazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { sourceKey: "reuters", url: "https://news.google.com/rss/search?q=site%3Areuters.com&hl=en-US&gl=US&ceid=US%3Aen" },
  { sourceKey: "guardian", url: "https://www.theguardian.com/world/rss" },
  { sourceKey: "ew", url: "https://news.google.com/rss/search?q=site:ewmagazine.nl&hl=nl&gl=NL&ceid=NL:nl" },
  { sourceKey: "nltimes", url: "https://nltimes.nl/rssfeed2" },
  { sourceKey: "dutchnews", url: "https://www.dutchnews.nl/feed/" },
];

const SOURCE_NAMES: Record<string, string> = {
  nos: "NOS Nieuws",
  telegraaf: "De Telegraaf",
  volkskrant: "De Volkskrant",
  ad: "Algemeen Dagblad",
  trouw: "Trouw",
  parool: "Het Parool",
  nrc: "NRC",
  nd: "Nederlands Dagblad",
  nu: "NU.nl",
  eenvandaag: "EenVandaag",
  joop: "Joop (BNNVARA)",
  bbc: "BBC News",
  cnn: "CNN",
  aljazeera: "Al Jazeera",
  reuters: "Reuters",
  guardian: "The Guardian",
  ew: "EW Magazine",
  nltimes: "NL Times",
  dutchnews: "Dutch News",
};

const parser = new RSSParser({
  timeout: 8000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; ObjectiveLensBot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(sourceKey: string, url: string): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(url);
    const sourceName = SOURCE_NAMES[sourceKey] ?? sourceKey;

    return (feed.items ?? [])
      .slice(0, 25) // max 25 per feed
      .filter((item) => item.title && (item.contentSnippet || item.content || item.summary))
      .map((item) => ({
        sourceKey,
        sourceName,
        title: stripHtml(item.title ?? ""),
        description: stripHtml(
          item.contentSnippet ?? item.content ?? item.summary ?? ""
        ).slice(0, 600),
        url: item.link ?? item.guid ?? url,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      }));
  } catch (err) {
    console.warn(`[scraper] Failed to fetch ${sourceKey} (${url}):`, err);
    return [];
  }
}

export async function scrapeAllFeeds(): Promise<{
  articles: RawArticle[];
  errors: string[];
}> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(({ sourceKey, url }) => fetchFeed(sourceKey, url))
  );

  const articles: RawArticle[] = [];
  const errors: string[] = [];

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const { sourceKey } = RSS_FEEDS[i];
    if (r.status === "fulfilled") {
      articles.push(...r.value);
    } else {
      errors.push(`${sourceKey}: ${r.reason}`);
    }
  }

  return { articles, errors };
}
