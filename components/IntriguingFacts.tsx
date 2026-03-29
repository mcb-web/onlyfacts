import { Lightbulb } from "lucide-react";
import type { IntriguingFact } from "@/lib/types";

interface IntriguingFactsProps {
  facts: IntriguingFact[];
}

export default function IntriguingFacts({ facts }: IntriguingFactsProps) {
  if (!facts.length) return null;

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-serif font-semibold text-lg text-ink mb-4 flex items-center gap-2">
        <Lightbulb className="text-amber-500 shrink-0" size={20} />
        Opvallende feiten
      </h3>
      <ul className="space-y-4">
        {facts.map((item, i) => (
          <li key={i} className="flex gap-3">
            <div className="mt-1 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[0.65rem] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div>
              <p className="text-sm text-ink leading-relaxed">{item.fact}</p>
              <p className="text-[0.65rem] text-ink-muted mt-1">Bron: {item.source}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
