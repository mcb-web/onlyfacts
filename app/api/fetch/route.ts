export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scrapeAllFeeds } from "@/lib/scraper";
import { clusterArticles } from "@/lib/deduplicator";
import { synthesizeCluster, generateSlug } from "@/lib/pipeline";
import { SOURCES } from "@/lib/sources";
import { titleSimilarity } from "@/lib/utils";

const DUPLICATE_THRESHOLD = 0.30; // Jaccard; ≥0.30 = same story

export const maxDuration = 120;

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not set in .env.local" },
      { status: 400 }
    );
  }

  const log: string[] = [];

  try {
    // 1. Scrape all RSS feeds
    log.push("Fetching RSS feeds…");
    const { articles, errors } = await scrapeAllFeeds();
    log.push(
      `Fetched ${articles.length} articles from ${new Set(articles.map((a) => a.sourceKey)).size} sources`
    );
    if (errors.length) log.push(`Feed errors: ${errors.join(", ")}`);

    if (articles.length < 4) {
      return NextResponse.json({ error: "Too few articles fetched", log }, { status: 500 });
    }

    // 2a. All existing event titles — prevent re-creating already-covered news events
    const allEvents = await prisma.newsEvent.findMany({ select: { title: true } });
    const allTitles = allEvents.map((e) => e.title);

    // 2b. Recent titles (last 3 days) — prevent re-creating topic overviews too soon
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600 * 1000);
    const recentEvents = await prisma.newsEvent.findMany({
      where: { createdAt: { gte: threeDaysAgo } },
      select: { title: true },
    });
    const recentTitles = recentEvents.map((e) => e.title);

    // 3. Cluster by event or topic
    log.push("Clustering articles…");
    const clusters = await clusterArticles(articles, allTitles, recentTitles);
    log.push(`Found ${clusters.length} clusters (events + topic overviews)`);

    if (clusters.length === 0) {
      return NextResponse.json({ message: "No clusters found", log });
    }

    // 4. Synthesize each cluster and store — cap at 8 per run to stay within Vercel timeout
    const topClusters = clusters
      .sort((a, b) => b.articles.length - a.articles.length)
      .slice(0, 8);
    log.push(`Processing ${topClusters.length} of ${clusters.length} clusters`);

    const results = { created: 0, skipped: 0, failed: 0 };
    const createdThisRun: string[] = [...allTitles];

    for (const cluster of topClusters) {
      log.push(`Synthesizing: "${cluster.eventTitle}"…`);

      try {
        const result = await synthesizeCluster(cluster);
        if (!result) { results.failed++; continue; }

        const { synthesis, sourceAnalyses } = result;
        const slug = generateSlug(synthesis.title);

        // Jaccard deduplication against all recent titles (DB + this run)
        const dupTitle = createdThisRun.find(
          (t) => titleSimilarity(synthesis.title, t) >= DUPLICATE_THRESHOLD
        );
        if (dupTitle) {
          log.push(`  → Skipped (duplicate of "${dupTitle.slice(0, 55)}")`);
          results.skipped++;
          continue;
        }

        await prisma.newsEvent.create({
          data: {
            slug,
            title: synthesis.title,
            summary: synthesis.summary,
            objectiveReport: synthesis.objectiveReport,
            intriguingFacts: JSON.stringify(synthesis.intriguingFacts),
            webFacts: JSON.stringify(synthesis.webFacts),
            politicalContext: synthesis.politicalContext
              ? JSON.stringify(synthesis.politicalContext)
              : null,
            category: synthesis.category,
            sourceArticles: {
              create: cluster.articles.map((article) => {
                const analysis = sourceAnalyses.find(
                  (a) => a.sourceKey === article.sourceKey
                );
                const meta = SOURCES[article.sourceKey];
                return {
                  sourceKey: article.sourceKey,
                  sourceName: article.sourceName,
                  originalTitle: article.title,
                  url: article.url,
                  publishedAt: article.publishedAt,
                  sensationScore: analysis?.sensationScore ?? meta?.baseSensation ?? 5,
                  politicalLean: analysis?.politicalLean ?? meta?.politicalLean ?? 0,
                  perspective: analysis?.perspective ?? "",
                  keyPhrases: JSON.stringify(analysis?.keyPhrases ?? []),
                };
              }),
            },
          },
        });

        createdThisRun.push(synthesis.title);
        log.push(`  → Created: "${synthesis.title}"`);
        results.created++;
      } catch (err) {
        log.push(`  → Failed: ${err}`);
        results.failed++;
      }
    }

    return NextResponse.json({
      message: `Done: ${results.created} created, ${results.skipped} skipped, ${results.failed} failed`,
      ...results,
      log,
    });
  } catch (err) {
    console.error("[fetch] Pipeline error:", err);
    return NextResponse.json({ error: String(err), log }, { status: 500 });
  }
}
