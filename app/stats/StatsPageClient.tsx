"use client";

import { useState } from "react";
import {
  SensationLineChart,
  PoliticalLeanChart,
  MediaBubbleChart,
  SensationBarChart,
} from "@/components/StatsCharts";
import { TrendingUp, Scale, Target, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceStats {
  sourceKey: string;
  sourceName: string;
  color: string;
  avgSensation: number;
  avgLean: number;
  points: Array<{
    date: string;
    avgSensation: number;
    politicalLean: number;
    articleCount: number;
  }>;
}

interface Props {
  initialStats: SourceStats[];
}

const DAY_OPTIONS = [7, 14] as const;

function StatCard({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
          <Icon size={18} className="text-accent" />
        </div>
        <div>
          <h3 className="font-serif font-semibold text-ink">{title}</h3>
          <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function StatsPageClient({ initialStats }: Props) {
  const [days, setDays] = useState<7 | 14>(14);

  const filteredStats = initialStats.map((s) => ({
    ...s,
    points: s.points.slice(-days),
  }));

  if (initialStats.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-ink-secondary mb-4">
          Geen statistieken beschikbaar. Initialiseer eerst de database via{" "}
          <a href="/api/seed" className="text-accent underline">
            /api/seed
          </a>
          .
        </p>
      </div>
    );
  }

  // Summary stats for header cards
  const topSensation = [...initialStats].sort((a, b) => b.avgSensation - a.avgSensation)[0];
  const mostObjective = [...initialStats].sort((a, b) => a.avgSensation - b.avgSensation)[0];
  const mostLeft = [...initialStats].sort((a, b) => a.avgLean - b.avgLean)[0];
  const mostRight = [...initialStats].sort((a, b) => b.avgLean - a.avgLean)[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
          Mediastatistieken
        </h1>
        <p className="text-ink-secondary text-[0.9rem]">
          Dagelijkse analyse van sensatie en politieke positie per nieuwsbron
        </p>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Meest sensationeel",
            value: topSensation?.sourceName.replace("De ", "").replace("Het ", ""),
            sub: `Gem. score ${topSensation?.avgSensation.toFixed(1)}/10`,
            color: "#DC2626",
          },
          {
            label: "Meest objectief",
            value: mostObjective?.sourceName.replace("De ", "").replace("Het ", ""),
            sub: `Gem. score ${mostObjective?.avgSensation.toFixed(1)}/10`,
            color: "#16A34A",
          },
          {
            label: "Meest links",
            value: mostLeft?.sourceName.replace("De ", "").replace("Het ", ""),
            sub: `Positie ${mostLeft?.avgLean.toFixed(2)}`,
            color: "#1E40AF",
          },
          {
            label: "Meest rechts",
            value: mostRight?.sourceName.replace("De ", "").replace("Het ", ""),
            sub: `Positie +${mostRight?.avgLean.toFixed(2)}`,
            color: "#9F1239",
          },
        ].map((m) => (
          <div key={m.label} className="card p-4">
            <p className="text-xs text-ink-muted mb-1">{m.label}</p>
            <p
              className="font-serif font-semibold text-lg leading-tight"
              style={{ color: m.color }}
            >
              {m.value}
            </p>
            <p className="text-xs text-ink-muted mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Day filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-ink-secondary">Periode:</span>
        {DAY_OPTIONS.map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              days === d
                ? "bg-accent text-white"
                : "bg-white border border-border text-ink-secondary hover:text-ink"
            )}
          >
            {d} dagen
          </button>
        ))}
      </div>

      {/* Charts grid */}
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <StatCard
            title="Sensatie-score over tijd"
            subtitle={`Gemiddelde per bron — afgelopen ${days} dagen`}
            icon={TrendingUp}
          >
            <SensationLineChart sources={filteredStats} days={days} />
            <p className="text-xs text-ink-muted mt-3">
              Streeplijn = neutrale grens (5.0). Boven = sensationeel, onder = feitelijk.
            </p>
          </StatCard>

          <StatCard
            title="Politieke positionering"
            subtitle="Gemiddelde lean per bron (−5 links · 0 centrum · +5 rechts)"
            icon={Scale}
          >
            <PoliticalLeanChart sources={filteredStats} />
          </StatCard>
        </div>

        {/* Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <StatCard
            title="Sensatie-score per bron"
            subtitle="Gemiddeld over de geselecteerde periode"
            icon={BarChart2}
          >
            <SensationBarChart sources={filteredStats} />
          </StatCard>

          <StatCard
            title="Medialandschap overzicht"
            subtitle="Positie: politieke lean (x) vs. sensatie (y) · Belgrootte = aantal artikelen"
            icon={Target}
          >
            <MediaBubbleChart sources={filteredStats} />
            <p className="text-xs text-ink-muted mt-3">
              Ideaal: objectieve media clusteren linksonder (neutraal + feitelijk).
            </p>
          </StatCard>
        </div>

        {/* Source table */}
        <div className="card p-5 sm:p-6">
          <h3 className="font-serif font-semibold text-ink mb-4">
            Overzichtstabel bronnen
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2 text-xs text-ink-muted font-medium">Bron</th>
                  <th className="text-right pb-2 text-xs text-ink-muted font-medium">Gem. sensatie</th>
                  <th className="text-right pb-2 text-xs text-ink-muted font-medium">Politieke lean</th>
                  <th className="text-right pb-2 text-xs text-ink-muted font-medium">Artikelen</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredStats]
                  .sort((a, b) => b.avgSensation - a.avgSensation)
                  .map((s) => (
                    <tr key={s.sourceKey} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="font-medium text-ink">{s.sourceName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={
                            s.avgSensation <= 2.5
                              ? "text-sensation-low font-medium"
                              : s.avgSensation <= 5
                              ? "text-sensation-mid font-medium"
                              : "text-sensation-high font-medium"
                          }
                        >
                          {s.avgSensation.toFixed(1)}/10
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-ink-secondary">
                        {s.avgLean > 0
                          ? `+${s.avgLean.toFixed(2)} rechts`
                          : s.avgLean < 0
                          ? `${s.avgLean.toFixed(2)} links`
                          : "Centrum"}
                      </td>
                      <td className="py-2.5 text-right text-ink-muted">
                        {s.points.reduce((a, p) => a + p.articleCount, 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
