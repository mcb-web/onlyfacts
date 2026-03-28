import { Landmark, CalendarDays, ExternalLink } from "lucide-react";
import type { PoliticalContext, PoliticalParty } from "@/lib/types";

// Maps known party abbreviations to their Tweede Kamer faction page
const PARTY_LINKS: Record<string, string> = {
  PVV: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/pvv",
  VVD: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/vvd",
  "GL-PvdA": "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/groenlinks-pvda",
  GroenLinks: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/groenlinks-pvda",
  PvdA: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/groenlinks-pvda",
  D66: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/d66",
  SP: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/sp",
  CDA: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/cda",
  NSC: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/nieuw-sociaal-contract",
  BBB: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/boerburgerbeweging",
  ChristenUnie: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/christenunie",
  Volt: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/volt",
  SGP: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/sgp",
  JA21: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/ja21",
  FvD: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/forum-voor-democratie",
  DENK: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/denk",
};

const POSITION_CONFIG = {
  for: { label: "Voor", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  against: { label: "Tegen", color: "bg-red-100 text-red-800 border-red-200" },
  neutral: { label: "Neutraal", color: "bg-gray-100 text-gray-700 border-gray-200" },
  divided: { label: "Verdeeld", color: "bg-amber-100 text-amber-800 border-amber-200" },
};

function PartyRow({ party }: { party: PoliticalParty }) {
  const cfg = POSITION_CONFIG[party.position];
  const link = PARTY_LINKS[party.abbreviation] ?? PARTY_LINKS[party.name];

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <div className="shrink-0 pt-0.5">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-6 bg-canvas-dark rounded hover:bg-accent-light transition-colors group"
            title={`${party.name} op Tweede Kamer`}
          >
            <span className="text-[0.6rem] font-bold text-ink-secondary group-hover:text-accent">
              {party.abbreviation}
            </span>
          </a>
        ) : (
          <div className="w-9 h-6 bg-canvas-dark rounded flex items-center justify-center">
            <span className="text-[0.6rem] font-bold text-ink-secondary">
              {party.abbreviation}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-medium text-sm text-ink">{party.name}</span>
          <span
            className={`text-[0.6rem] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}
          >
            {cfg.label}
          </span>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">{party.context}</p>
        {party.votes && (
          <p className="text-[0.65rem] text-ink-muted mt-1">Stemgedrag: {party.votes}</p>
        )}
      </div>
    </div>
  );
}

export default function PoliticalContextPanel({
  context,
}: {
  context: PoliticalContext;
}) {
  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-serif font-semibold text-lg text-ink mb-1 flex items-center gap-2">
        <Landmark className="text-accent shrink-0" size={20} />
        Politieke context
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs text-ink-muted">Standpunten van Tweede Kamerfracties</p>
        <a
          href="https://www.tweedekamer.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-muted hover:text-accent transition-colors"
          title="Tweede Kamer der Staten-Generaal"
        >
          <ExternalLink size={11} />
        </a>
      </div>

      <div>
        {context.parties.map((party) => (
          <PartyRow key={party.abbreviation} party={party} />
        ))}
      </div>

      {context.nextDebate && (
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted bg-canvas rounded-lg px-3 py-2">
          <CalendarDays size={13} />
          <span>Volgend debat: {context.nextDebate}</span>
        </div>
      )}
    </div>
  );
}
