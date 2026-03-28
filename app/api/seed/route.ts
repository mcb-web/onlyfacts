import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MOCK_NEWS_EVENTS, generateMockDailyStats } from "@/lib/mock-data";

export async function GET(req: Request) {
  const force = new URL(req.url).searchParams.get("force") === "1";
  try {
    const existing = await prisma.newsEvent.count();
    const existingStats = await prisma.dailySourceStat.count();

    if (existing > 0 && existingStats > 0 && !force) {
      return NextResponse.json({ status: "already_seeded", count: existing });
    }

    if (force) {
      await prisma.dailySourceStat.deleteMany();
      await prisma.sourceArticle.deleteMany();
      await prisma.newsEvent.deleteMany();
    }

    // Seed news events and source articles
    const shouldSeedEvents = existing === 0 || force;
    if (shouldSeedEvents) for (const event of MOCK_NEWS_EVENTS) {
      await prisma.newsEvent.create({
        data: {
          slug: event.slug,
          title: event.title,
          summary: event.summary,
          objectiveReport: event.objectiveReport,
          intriguingFacts: JSON.stringify(event.intriguingFacts),
          politicalContext: event.politicalContext
            ? JSON.stringify(event.politicalContext)
            : null,
          category: event.category,
          createdAt: event.publishedAt,
          updatedAt: event.publishedAt,
          sourceArticles: {
            create: event.sourceArticles.map((a) => ({
              sourceKey: a.sourceKey,
              sourceName: a.sourceName,
              originalTitle: a.originalTitle,
              url: a.url,
              publishedAt: new Date(a.publishedAt),
              sensationScore: a.sensationScore,
              politicalLean: a.politicalLean,
              perspective: a.perspective,
              keyPhrases: JSON.stringify(a.keyPhrases),
            })),
          },
        },
      });
    }

    // Seed daily stats
    const stats = generateMockDailyStats();
    for (const stat of stats) {
      await prisma.dailySourceStat.create({ data: stat });
    }

    return NextResponse.json({
      status: "seeded",
      events: MOCK_NEWS_EVENTS.length,
      statsPoints: stats.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
