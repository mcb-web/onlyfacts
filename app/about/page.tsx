import { Scale, Eye, BookOpen, Heart } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Scale,
    title: "Neutraliteit door ontwerp",
    body: "Geen bijvoeglijke naamwoorden met emotionele lading. Geen clickbait. Geen opinies vermomd als feiten. Als het geen aantoonbaar feit is, staat het niet in de lead.",
  },
  {
    icon: Eye,
    title: "Radicale transparantie",
    body: "Elk gesynthetiseerd artikel toont exact welke bronnen zijn geraadpleegd, hoe zij het verhaal framen, en hoe hun politieke lean is bepaald.",
  },
  {
    icon: BookOpen,
    title: "Meerperspectief-geletterdheid",
    body: "We verbergen bias niet — we brengen het in kaart. De Perspectievenkaart laat zien waarom verschillende media hetzelfde nieuws anders kleuren.",
  },
  {
    icon: Heart,
    title: "Cognitieve rust",
    body: "De interface is bewust traag en kalm ontworpen. Geen breaking news-banners, geen rode alarmen, geen oneindige scroll. Nieuws als informatie, niet als trigger.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink mb-3">
        Over OnlyFacts
      </h1>
      <p className="text-lg text-ink-secondary leading-relaxed mb-10">
        Het Nederlandse medialandschap is gefragmenteerd en gepolariseerd. Lezers
        zijn gevangen in informatiebubbels en consumeren nieuws door een
        sensationalistisch of politiek gekleurd filter. OnlyFacts destilleert
        ruwe feiten uit meerdere bronnen en presenteert een transparant overzicht van
        de verschillende perspectieven.
      </p>

      <div className="space-y-6 mb-12">
        {PRINCIPLES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card p-6 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
              <Icon size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-ink mb-1">{title}</h3>
              <p className="text-ink-secondary text-sm leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-accent-light border-accent/20">
        <h3 className="font-serif font-semibold text-ink mb-2">
          Hoe werkt de sensatie-score?
        </h3>
        <p className="text-sm text-ink-secondary leading-relaxed mb-3">
          Elk bronnenartikel krijgt een sensatie-score van 0 tot 10 op basis van
          taalanalyse. De score meet: gebruik van emotiewoorden, superlatieven,
          alarmerende frames, clickbait-constructies en afwezigheid van bronvermelding.
        </p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {[
            { range: "0–2.5", label: "Feitelijk", color: "#15803D", bg: "#F0FDF4" },
            { range: "2.6–5.5", label: "Gematigd", color: "#B45309", bg: "#FFFBEB" },
            { range: "5.6–10", label: "Sensationeel", color: "#B91C1C", bg: "#FEF2F2" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3"
              style={{ backgroundColor: s.bg }}
            >
              <div className="font-bold text-base mb-0.5" style={{ color: s.color }}>
                {s.range}
              </div>
              <div style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-border text-sm text-ink-muted space-y-2">
        <p>
          De politieke lean-scores zijn gebaseerd op wetenschappelijke mediaonderzoeken
          (Reuters Institute, 2024) en historische inhoudsanalyse. Ze zijn indicatief
          en worden periodiek herzien.
        </p>
        <p>
          Bronnen worden gesimuleerd voor dit prototype. In productie worden echte
          RSS-feeds en scrapers ingezet met toestemming van de respectievelijke uitgevers.
        </p>
      </div>
    </div>
  );
}
