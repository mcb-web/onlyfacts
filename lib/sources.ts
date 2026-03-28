import type { SourceMeta } from "./types";

// Political lean: -5 (far left) → 0 (center) → +5 (far right)
// Sensation: 0 (very factual) → 10 (extremely sensationalist)
export const SOURCES: Record<string, SourceMeta> = {
  nos: {
    key: "nos",
    name: "NOS Nieuws",
    shortName: "NOS",
    domain: "nos.nl",
    politicalLean: 0.0,
    baseSensation: 1.8,
    color: "#E84D1C",
    description: "Publieke omroep, wettelijk verplicht onpartijdig",
  },
  volkskrant: {
    key: "volkskrant",
    name: "De Volkskrant",
    shortName: "Volkskrant",
    domain: "volkskrant.nl",
    politicalLean: -1.9,
    baseSensation: 3.8,
    color: "#C0392B",
    description: "Progressief-liberaal dagblad, Amsterdam",
  },
  nrc: {
    key: "nrc",
    name: "NRC",
    shortName: "NRC",
    domain: "nrc.nl",
    politicalLean: -1.2,
    baseSensation: 2.6,
    color: "#8E44AD",
    description: "Liberaal-progressief kwaliteitsdagblad",
  },
  trouw: {
    key: "trouw",
    name: "Trouw",
    shortName: "Trouw",
    domain: "trouw.nl",
    politicalLean: -0.9,
    baseSensation: 2.9,
    color: "#16A085",
    description: "Christelijk-progressief dagblad",
  },
  parool: {
    key: "parool",
    name: "Het Parool",
    shortName: "Parool",
    domain: "parool.nl",
    politicalLean: -1.6,
    baseSensation: 4.2,
    color: "#27AE60",
    description: "Links-liberaal Amsterdams dagblad",
  },
  ad: {
    key: "ad",
    name: "Algemeen Dagblad",
    shortName: "AD",
    domain: "ad.nl",
    politicalLean: 0.3,
    baseSensation: 5.1,
    color: "#F39C12",
    description: "Populair dagblad, brede lezersgroep",
  },
  telegraaf: {
    key: "telegraaf",
    name: "De Telegraaf",
    shortName: "Telegraaf",
    domain: "telegraaf.nl",
    politicalLean: 2.4,
    baseSensation: 7.6,
    color: "#D35400",
    description: "Rechts-populair dagblad, grootste bereik Nederland",
  },
  nd: {
    key: "nd",
    name: "Nederlands Dagblad",
    shortName: "ND",
    domain: "nd.nl",
    politicalLean: 1.3,
    baseSensation: 3.2,
    color: "#2980B9",
    description: "Christelijk-reformatorisch dagblad",
  },
  rtl: {
    key: "rtl",
    name: "RTL Nieuws",
    shortName: "RTL",
    domain: "rtlnieuws.nl",
    politicalLean: 0.2,
    baseSensation: 4.7,
    color: "#1ABC9C",
    description: "Commerciële nieuwszender, breed publiek",
  },
  nu: {
    key: "nu",
    name: "NU.nl",
    shortName: "NU.nl",
    domain: "nu.nl",
    politicalLean: 0.1,
    baseSensation: 4.3,
    color: "#E67E22",
    description: "Grootste nieuwssite van Nederland, breed publiek",
  },
  eenvandaag: {
    key: "eenvandaag",
    name: "EenVandaag",
    shortName: "EenVandaag",
    domain: "eenvandaag.avrotros.nl",
    politicalLean: 0.0,
    baseSensation: 2.5,
    color: "#3498DB",
    description: "Publiek opinieonderzoek en achtergrondnieuws, AVROTROS",
  },
  joop: {
    key: "joop",
    name: "Joop (BNNVARA)",
    shortName: "Joop",
    domain: "bnnvara.nl",
    politicalLean: -2.8,
    baseSensation: 5.5,
    color: "#8E44AD",
    description: "Links progressief opinieplatform, BNNVARA",
  },
};

export function getSource(key: string): SourceMeta {
  return SOURCES[key] ?? {
    key,
    name: key,
    shortName: key,
    domain: `${key}.nl`,
    politicalLean: 0,
    baseSensation: 5,
    color: "#95A5A6",
    description: "",
  };
}

export function getLeanLabel(lean: number): string {
  if (lean <= -3) return "Uiterst links";
  if (lean <= -1.5) return "Links";
  if (lean <= -0.5) return "Centrum-links";
  if (lean < 0.5) return "Centrum";
  if (lean < 1.5) return "Centrum-rechts";
  if (lean < 3) return "Rechts";
  return "Uiterst rechts";
}

export function getSensationLabel(score: number): string {
  if (score <= 2.5) return "Feitelijk";
  if (score <= 5) return "Gematigd";
  if (score <= 7.5) return "Sensationeel";
  return "Alarmerend";
}

export function getSensationColor(score: number): string {
  if (score <= 2.5) return "sensation-low";
  if (score <= 5) return "sensation-mid";
  return "sensation-high";
}
