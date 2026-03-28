import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { SOURCES } from "@/lib/sources";
import StatsPageClient from "./StatsPageClient";

interface RawRow {
  sourceKey: string;
  date: string;
  avgSensation: number;
  avgLean: number;
  articleCount: number;
}

async function getStatsData(days: number) {
  const newest = await prisma.sourceArticle.findFirst({
    orderBy: { publishedAt: "desc" },
    select: { publishedAt: true },
  });
  const anchor = newest?.publishedAt ?? new Date();
  const since = new Date(anchor);
  since.setDate(anchor.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const sinceMs = since.getTime();
  const rows = await prisma.$queryRaw<RawRow[]>(Prisma.sql`
    SELECT
      sourceKey,
      DATE(publishedAt / 1000, 'unixepoch') AS date,
      AVG(sensationScore)  AS avgSensation,
      AVG(politicalLean)   AS avgLean,
      COUNT(*)             AS articleCount
    FROM SourceArticle
    WHERE publishedAt >= ${sinceMs}
    GROUP BY sourceKey, DATE(publishedAt / 1000, 'unixepoch')
    ORDER BY sourceKey, date
  `);

  const grouped: Record<string, RawRow[]> = {};
  for (const row of rows) {
    if (!grouped[row.sourceKey]) grouped[row.sourceKey] = [];
    grouped[row.sourceKey].push(row);
  }

  return Object.entries(grouped).map(([key, points]) => {
    const avgSensation =
      points.reduce((a, p) => a + Number(p.avgSensation), 0) / points.length;
    const avgLean =
      points.reduce((a, p) => a + Number(p.avgLean), 0) / points.length;
    return {
      sourceKey: key,
      sourceName: SOURCES[key]?.name ?? key,
      color: SOURCES[key]?.color ?? "#999",
      avgSensation,
      avgLean,
      points: points.map((p) => ({
        date: p.date,
        avgSensation: Number(p.avgSensation),
        politicalLean: Number(p.avgLean),
        articleCount: Number(p.articleCount),
      })),
    };
  });
}

export default async function StatsPage() {
  let stats: Awaited<ReturnType<typeof getStatsData>> = [];
  try {
    stats = await getStatsData(14);
  } catch {
    // DB not ready yet
  }

  return <StatsPageClient initialStats={stats} />;
}
