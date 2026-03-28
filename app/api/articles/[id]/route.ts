import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const event = await prisma.newsEvent.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { sourceArticles: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...event,
    intriguingFacts: JSON.parse(event.intriguingFacts),
    politicalContext: event.politicalContext
      ? JSON.parse(event.politicalContext)
      : null,
    sourceArticles: event.sourceArticles.map((a) => ({
      ...a,
      keyPhrases: JSON.parse(a.keyPhrases),
    })),
  });
}
