import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MOCK_NEWS_EVENTS, generateMockDailyStats } from "@/lib/mock-data";

export async function GET() {
  try {
    const existing = await prisma.newsEvent.count();
    if (existing > 0) {
      return NextResponse.json({ status: "already_seeded", count: existing });
    }

    // Seed news events and source articles
    for (const event of MOCK_NEWS_EVENTS) {
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
