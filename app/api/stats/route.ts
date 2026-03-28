export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { SOURCES } from "@/lib/sources";

interface RawRow {
  sourceKey: string;
  date: string;
  avgSensation: number;
  avgLean: number;
  articleCount: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "14");

  // Anchor to the newest article in the DB, not the server clock,
  // so mock data and real data both fall within the window.
  const newest = await prisma.sourceArticle.findFirst({
    orderBy: { publishedAt: "desc" },
    select: { publishedAt: true },
  });
  const anchor = newest?.publishedAt ?? new Date();
  const since = new Date(anchor);
  since.setDate(anchor.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<RawRow[]>(Prisma.sql`
    SELECT
      "sourceKey",
      TO_CHAR("publishedAt", 'YYYY-MM-DD') AS date,
      AVG("sensationScore")  AS "avgSensation",
      AVG("politicalLean")   AS "avgLean",
      COUNT(*)               AS "articleCount"
    FROM "SourceArticle"
    WHERE "publishedAt" >= ${since}
    GROUP BY "sourceKey", TO_CHAR("publishedAt", 'YYYY-MM-DD')
    ORDER BY "sourceKey", date
  `);

  // Group rows by source
  const grouped: Record<string, RawRow[]> = {};
  for (const row of rows) {
    if (!grouped[row.sourceKey]) grouped[row.sourceKey] = [];
    grouped[row.sourceKey].push(row);
  }

  const result = Object.entries(grouped).map(([key, points]) => {
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

  return NextResponse.json(result);
}
