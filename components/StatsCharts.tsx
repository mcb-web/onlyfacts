"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { formatDateShort } from "@/lib/utils";

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

interface SensationLineChartProps {
  sources: SourceStats[];
  days: number;
}

export function SensationLineChart({ sources, days }: SensationLineChartProps) {
  // Build date-keyed map for each source
  const allDates = new Set<string>();
  sources.forEach((s) => s.points.forEach((p) => allDates.add(p.date)));
  const dates = Array.from(allDates).sort();

  const chartData = dates.slice(-days).map((date) => {
    const row: Record<string, unknown> = { date: formatDateShort(date) };
    sources.forEach((s) => {
      const pt = s.points.find((p) => p.date === date);
      row[s.sourceKey] = pt ? parseFloat(pt.avgSensation.toFixed(2)) : null;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#78716C" }} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#78716C" }} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid #E7E5E4",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [value?.toFixed(1), name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
        <ReferenceLine y={5} stroke="#D1D5DB" strokeDasharray="4 4" />
        {sources.map((s) => (
          <Line
            key={s.sourceKey}
            type="monotone"
            dataKey={s.sourceKey}
            name={s.sourceName}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface PoliticalLeanChartProps {
  sources: SourceStats[];
}

export function PoliticalLeanChart({ sources }: PoliticalLeanChartProps) {
  const sorted = [...sources].sort((a, b) => a.avgLean - b.avgLean);
  const data = sorted.map((s) => ({
    name: s.sourceName.replace("De ", "").replace("Het ", ""),
    lean: parseFloat(s.avgLean.toFixed(2)),
    color: s.color,
  }));

  const getBarColor = (lean: number) => {
    if (lean < -1) return "#1E40AF";
    if (lean < -0.4) return "#3B82F6";
    if (lean < 0.4) return "#6B7280";
    if (lean < 1.5) return "#F87171";
    return "#9F1239";
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 40, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" horizontal={false} />
        <XAxis
          type="number"
          domain={[-5, 5]}
          tick={{ fontSize: 11, fill: "#78716C" }}
          tickLine={false}
          tickFormatter={(v) => (v === 0 ? "Centrum" : v > 0 ? `+${v}` : `${v}`)}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#78716C" }}
          tickLine={false}
          width={72}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid #E7E5E4",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v: number) => [
            v > 0 ? `+${v.toFixed(2)} (rechts)` : `${v.toFixed(2)} (links)`,
            "Politieke positie",
          ]}
        />
        <ReferenceLine x={0} stroke="#9CA3AF" strokeWidth={1.5} />
        <Bar dataKey="lean" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getBarColor(entry.lean)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface BubbleTooltipPayloadItem {
  name: string;
  value: number;
  payload: { name: string; x: number; y: number; z: number; color: string };
}

function BubbleTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: BubbleTooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  const lean = pt.x > 0 ? `+${pt.x.toFixed(2)} (rechts)` : `${pt.x.toFixed(2)} (links)`;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E7E5E4",
        borderRadius: 8,
        fontSize: 12,
        padding: "8px 12px",
        lineHeight: "1.6",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4, color: pt.color }}>
        {pt.name}
      </p>
      <p>Politieke lean: {lean}</p>
      <p>Sensatie: {pt.y.toFixed(1)}/10</p>
      <p>Artikelen: {pt.z}</p>
    </div>
  );
}

interface BubbleChartProps {
  sources: SourceStats[];
}

export function MediaBubbleChart({ sources }: BubbleChartProps) {
  const data = sources.map((s) => ({
    x: parseFloat(s.avgLean.toFixed(2)),
    y: parseFloat(s.avgSensation.toFixed(2)),
    z: s.points.reduce((a, p) => a + p.articleCount, 0),
    name: s.sourceName,
    color: s.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <ScatterChart margin={{ top: 16, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
        <XAxis
          type="number"
          dataKey="x"
          domain={[-4, 4]}
          name="Politieke lean"
          tick={{ fontSize: 11, fill: "#78716C" }}
          tickLine={false}
          label={{
            value: "← Links · Rechts →",
            position: "insideBottom",
            offset: -4,
            style: { fontSize: 10, fill: "#78716C" },
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={[0, 10]}
          name="Sensatie"
          tick={{ fontSize: 11, fill: "#78716C" }}
          tickLine={false}
          label={{
            value: "Sensatie",
            angle: -90,
            position: "insideLeft",
            offset: 12,
            style: { fontSize: 10, fill: "#78716C" },
          }}
        />
        <ZAxis type="number" dataKey="z" range={[40, 400]} name="Artikelen" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={<BubbleTooltip />}
        />
        <ReferenceLine x={0} stroke="#9CA3AF" strokeDasharray="4 4" />
        <ReferenceLine y={5} stroke="#9CA3AF" strokeDasharray="4 4" />
        {data.map((entry) => (
          <Scatter
            key={entry.name}
            name={entry.name}
            data={[entry]}
            fill={entry.color}
            fillOpacity={0.8}
          />
        ))}
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11 }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

interface SensationBarChartProps {
  sources: SourceStats[];
}

export function SensationBarChart({ sources }: SensationBarChartProps) {
  const data = [...sources]
    .sort((a, b) => b.avgSensation - a.avgSensation)
    .map((s) => ({
      name: s.sourceName.replace("De ", "").replace("Het ", ""),
      score: parseFloat(s.avgSensation.toFixed(2)),
      color: s.color,
    }));

  const getSensationColor = (score: number) => {
    if (score <= 2.5) return "#16A34A";
    if (score <= 5) return "#D97706";
    return "#DC2626";
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#78716C" }}
          tickLine={false}
        />
        <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#78716C" }} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid #E7E5E4",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v.toFixed(1)}/10`, "Sensatie-score"]}
        />
        <ReferenceLine y={5} stroke="#D1D5DB" strokeDasharray="4 4" label={{ value: "Gem.", fontSize: 9, fill: "#9CA3AF" }} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getSensationColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
