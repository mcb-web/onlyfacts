export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const events = await prisma.newsEvent.findMany({
    include: { sourceArticles: true },
    orderBy: { createdAt: "desc" },
  });

  const data = events.map((e) => ({
    ...e,
    intriguingFacts: JSON.parse(e.intriguingFacts),
    politicalContext: e.politicalContext ? JSON.parse(e.politicalContext) : null,
    sourceArticles: e.sourceArticles.map((a) => ({
      ...a,
      keyPhrases: JSON.parse(a.keyPhrases),
    })),
  }));

  return NextResponse.json(data);
}
