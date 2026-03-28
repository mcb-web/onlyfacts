import type { IntriguingFact, PoliticalContext } from "./types";

// Seed-time shape — no DB-generated fields (id, eventId, createdAt)
export interface SeedSourceArticle {
  sourceKey: string;
  sourceName: string;
  originalTitle: string;
  url: string;
  publishedAt: string;
  sensationScore: number;
  politicalLean: number;
  perspective: string;
  keyPhrases: string[];
}

export interface MockNewsEvent {
  slug: string;
  title: string;
  summary: string;
  objectiveReport: string;
  intriguingFacts: IntriguingFact[];
  politicalContext: PoliticalContext | null;
  category: string;
  publishedAt: Date;
  sourceArticles: SeedSourceArticle[];
}

export const MOCK_NEWS_EVENTS: MockNewsEvent[] = [
  {
    slug: "woningmarkt-kabinetsplan-100000-woningen",
    title: "Kabinet presenteert plan voor bouw van 100.000 woningen per jaar",
    summary:
      "Het kabinet heeft een wetsvoorstel ingediend voor de bouw van 100.000 nieuwe woningen per jaar tot 2030. Het plan omvat het vrijgeven van rijksgrond, het vereenvoudigen van vergunningsprocedures en een subsidieregeling voor gemeenten.",
    objectiveReport: `Op 24 maart 2026 heeft het kabinet-Schoof II een wetsvoorstel ingediend bij de Tweede Kamer gericht op de realisatie van 100.000 nieuwe woningen per jaar tot en met 2030. Minister van Volkshuisvesting Mona Keijzer (NSC) presenteerde het plan tijdens een persconferentie in Den Haag.

Het voorstel bestaat uit drie kernmaatregelen. Ten eerste stelt het Rijk 35.000 hectare rijksgrond beschikbaar voor woningbouwprojecten, primair in de Randstad en Noord-Brabant. Ten tweede worden vergunningsprocedures verkort van een gemiddelde van 26 maanden naar maximaal 12 maanden door de introductie van een gecentraliseerd digitaal loket. Ten derde ontvangen gemeenten een subsidie van €8.500 per nieuw gebouwde sociale huurwoning.

De totale begrotingsimpact bedraagt €4,2 miljard over een periode van vier jaar, aldus de bijbehorende Memorie van Toelichting. Het Planbureau voor de Leefomgeving (PBL) bevestigt een huidig woningtekort van 390.000 woningen in Nederland. In 2025 werden 68.400 nieuwbouwwoningen opgeleverd, ruim onder de beoogde 100.000.

De Tweede Kamer debatteert over het wetsvoorstel op 8 april 2026. Bouwend Nederland, de brancheorganisatie voor aannemers, verwelkomde het plan maar wees op een structureel tekort van circa 38.000 vaklieden in de bouwsector als risico voor de uitvoerbaarheid.`,
    intriguingFacts: [
      {
        fact: "Nederland heeft met 57% één van de laagste percentages woningeigenaren in de EU. Het EU-gemiddelde ligt op 70%.",
        source: "Eurostat, 2025",
      },
      {
        fact: "De gemiddelde wachttijd voor een sociale huurwoning in Amsterdam bedraagt momenteel 14,3 jaar.",
        source: "Gemeente Amsterdam, 2025",
      },
      {
        fact: "De bouwsector kampt met een structureel tekort van 38.000 vaklieden, wat de uitvoerbaarheid van het plan bemoeilijkt.",
        source: "Bouwend Nederland, Q1 2026",
      },
      {
        fact: "In 2025 werden slechts 68.400 nieuwe woningen opgeleverd — 31.600 minder dan het kabinetsdoel.",
        source: "CBS, januari 2026",
      },
    ],
    politicalContext: {
      parties: [
        {
          name: "PVV",
          abbreviation: "PVV",
          position: "for",
          context:
            "Steunt het plan, legt nadruk op bouw voor 'eigen mensen eerst' en beperking van arbeidsmigratie.",
        },
        {
          name: "GroenLinks-PvdA",
          abbreviation: "GL-PvdA",
          position: "divided",
          context:
            "Steunt woningbouw maar eist hogere sociale huurquota (minimaal 40%) en huurprijsregulering.",
        },
        {
          name: "VVD",
          abbreviation: "VVD",
          position: "against",
          context:
            "Kritisch op subsidieregeling; pleit voor marktwerking en vereenvoudiging in plaats van subsidies.",
        },
        {
          name: "D66",
          abbreviation: "D66",
          position: "for",
          context:
            "Positief over vergunningsvereenvoudiging, dringt aan op meer aandacht voor middeldure huur.",
        },
        {
          name: "SP",
          abbreviation: "SP",
          position: "divided",
          context:
            "Steunt sociale woningbouw maar vindt het plan te afhankelijk van marktpartijen.",
        },
      ],
      nextDebate: "8 april 2026",
    },
    category: "politiek",
    publishedAt: new Date("2026-03-24T09:00:00Z"),
    sourceArticles: [
      {
        sourceKey: "nos",
        sourceName: "NOS Nieuws",
        originalTitle:
          "Kabinet lanceert woningbouwplan: 100.000 woningen per jaar tot 2030",
        url: "https://nos.nl/artikel/woningbouwplan-kabinet-2026",
        publishedAt: "2026-03-24T08:15:00Z",
        sensationScore: 2.1,
        politicalLean: 0.0,
        perspective:
          "Feitelijke weergave van het kabinetsplan met hoor en wederhoor. Citeert zowel minister Keijzer als PBL en Bouwend Nederland. Geen waardeoordelen.",
        keyPhrases: [
          "100.000 woningen per jaar",
          "wetsvoorstel ingediend",
          "390.000 woningtekort",
        ],
      },
      {
        sourceKey: "telegraaf",
        sourceName: "De Telegraaf",
        originalTitle:
          "WONINGNOOD: Kabinet pompt MILJARDEN in huizenplan — maar wie betaalt de rekening?",
        url: "https://telegraaf.nl/nieuws/woningnood-kabinetsplan-miljarden",
        publishedAt: "2026-03-24T07:45:00Z",
        sensationScore: 7.8,
        politicalLean: 2.4,
        perspective:
          "Nadruk op kosten voor de belastingbetaler en risico's van overheidsinterventie. Citeert uitsluitend VVD-critici en een vastgoedondernemer. Framing: overheid lost marktprobleem op met belastinggeld.",
        keyPhrases: [
          "miljarden",
          "wie betaalt",
          "belastingbetaler",
          "overheidsinterventie",
          "risico",
        ],
      },
      {
        sourceKey: "volkskrant",
        sourceName: "De Volkskrant",
        originalTitle:
          "Woningbouwplan kabinet schiet tekort voor armste huurders en statushouders",
        url: "https://volkskrant.nl/politiek/woningbouwplan-kabinet-sociale-huur~b12345",
        publishedAt: "2026-03-24T09:30:00Z",
        sensationScore: 4.3,
        politicalLean: -1.9,
        perspective:
          "Kritisch op het ontbreken van een verhoogd sociaal huurquotum. Spreekt uitsluitend experts van huurdersbonden en de Woonbond. Framing: plan helpt de middenklasse, maar laat kwetsbaren in de kou staan.",
        keyPhrases: [
          "kwetsbare huurders",
          "sociale huurquotum",
          "Woonbond",
          "middenklasse",
          "armsten",
        ],
      },
      {
        sourceKey: "ad",
        sourceName: "Algemeen Dagblad",
        originalTitle:
          "'Eindelijk actie': starters reageren hoopvol maar sceptisch op woningbouwplan kabinet",
        url: "https://ad.nl/wonen/starters-woningbouwplan-kabinet~c67890",
        publishedAt: "2026-03-24T10:00:00Z",
        sensationScore: 4.1,
        politicalLean: 0.3,
        perspective:
          "Menselijk verhaal centraal via interviews met vier starters op de woningmarkt. Legt nadruk op emotionele impact van de woningcrisis. Neutraal-positief over het plan maar zet vraagtekens bij haalbaarheid.",
        keyPhrases: [
          "eindelijk actie",
          "starters",
          "hoopvol",
          "sceptisch",
          "haalbaarheid",
        ],
      },
      {
        sourceKey: "trouw",
        sourceName: "Trouw",
        originalTitle:
          "Woningbouwplan is goede stap, maar locatiekeuze en duurzaamheid blijven pijnpunt",
        url: "https://trouw.nl/economie/woningbouwplan-duurzaamheid-locatie~d11223",
        publishedAt: "2026-03-24T08:45:00Z",
        sensationScore: 2.9,
        politicalLean: -0.9,
        perspective:
          "Analytische blik op planologische en duurzaamheidsaspecten. Stelt vragen over bouw in groene gebieden en energiezuinigheidsnormen. Citeert stedenbouwkundigen en klimaatonderzoekers.",
        keyPhrases: [
          "duurzaamheid",
          "planologie",
          "groene gebieden",
          "energiezuinig",
          "stedenbouwkundigen",
        ],
      },
    ],
  },
  {
    slug: "klimaatdoelstellingen-nederland-65-procent-2030",
    title:
      "Klimaatraad adviseert verhoging CO₂-reductiedoelstelling naar 65% in 2030",
    summary:
      "De Nederlandse Klimaatraad heeft het kabinet geadviseerd de CO₂-reductiedoelstelling te verhogen van 55% naar 65% in 2030. Het advies volgt uit een rechterlijke uitspraak en Europese druk. Het kabinet moet binnen 90 dagen reageren.",
    objectiveReport: `Op 22 maart 2026 heeft de onafhankelijke Nederlandse Klimaatraad een formeel advies uitgebracht aan het kabinet-Schoof II om de nationale CO₂-reductiedoelstelling voor 2030 te verhogen van de huidige 55% naar 65% ten opzichte van 1990.

Het advies is mede het gevolg van een arrest van de Hoge Raad van december 2025, waarin werd geoordeeld dat de overheid onvoldoende voortgang boekt op klimaatgebied. De Klimaatraad stelt dat de huidige maatregelen ontoereikend zijn om aan het Klimaatverdrag van Parijs te voldoen.

Uit recente CBS-data blijkt dat Nederland in 2025 zijn CO₂-uitstoot met 43% heeft verminderd ten opzichte van 1990. De Klimaatraad acht een extra inspanning nodig via versnelde uitrol van wind- en zonne-energie, reductie van methaanemissies in de veehouderij en aanscherping van normen voor de industrie.

Het kabinet heeft op grond van de Wet klimaatbeleid 90 dagen de tijd om op het advies te reageren. Minister van Klimaat en Groene Groei Sophie Hermans (VVD) bevestigde ontvangst van het advies maar deed nog geen uitspraken over de inhoud. De totale extra kosten worden door de Klimaatraad geschat op €6,8 miljard tot 2030.`,
    intriguingFacts: [
      {
        fact: "Nederland genereerde in 2025 slechts 18% van zijn elektriciteit uit hernieuwbare bronnen, tegenover een EU-gemiddelde van 44%.",
        source: "Internationaal Energieagentschap, 2025",
      },
      {
        fact: "De Nederlandse veehouderij is verantwoordelijk voor circa 13% van de totale nationale broeikasgasuitstoot.",
        source: "RIVM, 2025",
      },
      {
        fact: "Rechter Klimaatvonnis: dit is het derde succesvolle klimaatrechtsproces in Nederland, na Urgenda (2015) en Shell (2021).",
        source: "Hoge Raad, december 2025",
      },
      {
        fact: "Duitsland heeft zijn equivalent doelstelling al op 65% gesteld en streeft naar 88% reductie in 2040.",
        source: "Bundesklimaschutzgesetz, 2024",
      },
    ],
    politicalContext: {
      parties: [
        {
          name: "GroenLinks-PvdA",
          abbreviation: "GL-PvdA",
          position: "for",
          context:
            "Steunt het advies volledig. Vraagt om bindende wetgeving en aanvullend budget van €10 miljard.",
        },
        {
          name: "PVV",
          abbreviation: "PVV",
          position: "against",
          context:
            "Verwerpt het advies. Stelt dat klimaatbeleid 'gewone Nederlanders' financieel schaadt.",
        },
        {
          name: "VVD",
          abbreviation: "VVD",
          position: "divided",
          context:
            "Intern verdeeld. Wil economische gevolgen laten doorrekenen voor reactie.",
        },
        {
          name: "D66",
          abbreviation: "D66",
          position: "for",
          context:
            "Steunt het advies en wil het vertalen in concrete maatregelen vóór de zomer.",
        },
      ],
      nextDebate: "15 april 2026",
    },
    category: "klimaat",
    publishedAt: new Date("2026-03-22T10:00:00Z"),
    sourceArticles: [
      {
        sourceKey: "nos",
        sourceName: "NOS Nieuws",
        originalTitle:
          "Klimaatraad: Nederland moet CO₂-doelstelling verhogen naar 65% in 2030",
        url: "https://nos.nl/artikel/klimaatraad-advies-65-procent-2026",
        publishedAt: "2026-03-22T09:00:00Z",
        sensationScore: 2.3,
        politicalLean: 0.0,
        perspective:
          "Feitelijke weergave van het advies en de wettelijke context. Citeert Klimaatraadvoorzitter en minister Hermans. Neutraal, geen waardeoordelen.",
        keyPhrases: ["klimaatadvies", "90 dagen", "65 procent", "Klimaatraad"],
      },
      {
        sourceKey: "telegraaf",
        sourceName: "De Telegraaf",
        originalTitle:
          "Klimaatclub wil nog STRENGERE doelen: gaat dit miljarden kosten voor u?",
        url: "https://telegraaf.nl/nieuws/klimaatdoelstellingen-kosten-burger",
        publishedAt: "2026-03-22T08:30:00Z",
        sensationScore: 8.2,
        politicalLean: 2.5,
        perspective:
          "Framing van de Klimaatraad als elitair orgaan dat gewone burgers benadeelt. Nadruk op kosten per huishouden. Citeert PVV-Kamerlid en een energielobbyist.",
        keyPhrases: [
          "klimaatclub",
          "strengere doelen",
          "miljarden",
          "kosten voor u",
          "rekening",
        ],
      },
      {
        sourceKey: "volkskrant",
        sourceName: "De Volkskrant",
        originalTitle:
          "Klimaatraad: doelstelling 65% is moreel noodzakelijk en economisch haalbaar",
        url: "https://volkskrant.nl/klimaat/klimaatraad-65-procent-haalbaar~e22334",
        publishedAt: "2026-03-22T10:15:00Z",
        sensationScore: 3.7,
        politicalLean: -2.1,
        perspective:
          "Positief-normatief frame: klimaatactie als morele verplichting. Citeert meerdere klimaatonderzoekers en een rapport van het IPCC. Weinig kritische vragen over economische haalbaarheid.",
        keyPhrases: [
          "moreel noodzakelijk",
          "klimaatcrisis",
          "wetenschappelijk onderbouwd",
          "haalbaar",
        ],
      },
      {
        sourceKey: "nd",
        sourceName: "Nederlands Dagblad",
        originalTitle:
          "Klimaatdoelen en rentmeesterschap: kerk roept politiek op tot actie",
        url: "https://nd.nl/nieuws/klimaat-rentmeesterschap-kerk",
        publishedAt: "2026-03-22T11:00:00Z",
        sensationScore: 3.0,
        politicalLean: 1.2,
        perspective:
          "Vanuit christelijk perspectief: de aarde beschermen als rentmeesterschap. Steunt ambitieuzere klimaatdoelen vanuit moreel-religieus argument, maar is kritisch op regulering van de veehouderij.",
        keyPhrases: [
          "rentmeesterschap",
          "schepping",
          "kerk",
          "veehouderij",
          "morele plicht",
        ],
      },
      {
        sourceKey: "rtl",
        sourceName: "RTL Nieuws",
        originalTitle:
          "Kabinet onder druk na klimaatadvies: wat betekent 65% reductie voor uw energierekening?",
        url: "https://rtlnieuws.nl/economie/klimaat-65-procent-energierekening",
        publishedAt: "2026-03-22T12:00:00Z",
        sensationScore: 5.1,
        politicalLean: 0.3,
        perspective:
          "Consumenten-angle: wat zijn de praktische gevolgen voor het huishouden? Combineert energierekening-berekeningen met politieke context. Evenwichtig maar consumentgericht.",
        keyPhrases: [
          "energierekening",
          "praktische gevolgen",
          "huishouden",
          "kabinet onder druk",
        ],
      },
    ],
  },
  {
    slug: "tweede-kamer-debat-europese-ai-verordening",
    title:
      "Tweede Kamer debatteert over implementatie Europese AI-verordening",
    summary:
      "De Tweede Kamer heeft gedebatteerd over de nationale implementatie van de Europese AI-verordening, die op 1 augustus 2026 van kracht wordt. Twistpunten zijn de handhavingsbevoegdheid en de gevolgen voor het Nederlandse MKB.",
    objectiveReport: `Op 21 maart 2026 voerde de Tweede Kamer een plenair debat over de nationale implementatiewet voor de EU AI Act (Verordening 2024/1689), die op 1 augustus 2026 volledig van kracht wordt in alle EU-lidstaten.

Staatssecretaris van Digitalisering Alexandra van Huffelen (D66) presenteerde het implementatievoorstel. De kern van de wet classificeert AI-systemen in risicocategorieën: verboden, hoog-risico, beperkt risico en minimaal risico. Hoog-risico toepassingen — waaronder AI in sollicitatieprocedures, rechtspraak en kritieke infrastructuur — zijn onderworpen aan verplichte conformiteitsbeoordelingen.

De handhaving wordt toebedeeld aan een nieuwe toezichthouder: het Nationaal Toezichtorgaan Algoritmen (NTA), dat per 1 juli 2026 operationeel moet zijn met een startbudget van €32 miljoen. Maximale boetes onder de verordening bedragen €35 miljoen of 7% van de wereldwijde jaarlijkse omzet.

MKB Nederland uitte zorgen dat kleinere bedrijven de compliancekosten niet kunnen dragen. Techlobby Nederland ICT pleit voor een tweejarig transitieregime voor bedrijven met minder dan 250 medewerkers.`,
    intriguingFacts: [
      {
        fact: "Nederlandstalige AI-tools worden momenteel door 4,2 miljoen werknemers dagelijks gebruikt op de werkvloer.",
        source: "TNO Arbeidsinspectie, 2025",
      },
      {
        fact: "De AI-verordening is de eerste bindende AI-wet ter wereld en werd door het Europees Parlement aangenomen met 523 stemmen voor.",
        source: "Europees Parlement, mei 2024",
      },
      {
        fact: "Schattingen suggereren dat 85% van de huidige AI-toepassingen in Nederlandse bedrijven in de 'laag risico' categorie vallen en dus nauwelijks extra verplichtingen krijgen.",
        source: "Nederland ICT, februari 2026",
      },
      {
        fact: "Nederland had in 2025 het hoogste percentage AI-adoptie bij bedrijven in de EU: 42%, tegenover een EU-gemiddelde van 28%.",
        source: "Eurostat Digital Economy Report, 2025",
      },
    ],
    politicalContext: {
      parties: [
        {
          name: "D66",
          abbreviation: "D66",
          position: "for",
          context:
            "Staatssecretaris Van Huffelen (D66) steunt de wet. D66 benadrukt mensenrechten en transparantie.",
        },
        {
          name: "VVD",
          abbreviation: "VVD",
          position: "divided",
          context:
            "Steunt regulering maar wil MKB-uitzonderingen en twee jaar implementatietijd.",
        },
        {
          name: "PVV",
          abbreviation: "PVV",
          position: "against",
          context:
            "Kritisch op 'Brusselse bureaucratie'. Wil nationale bevoegdheid behouden voor AI-toezicht.",
        },
        {
          name: "SP",
          abbreviation: "SP",
          position: "for",
          context:
            "Steunt strenge regulering, wil verbod op biometrische surveillance uitbreiden.",
        },
      ],
      nextDebate: "21 maart 2026 (afgerond)",
    },
    category: "technologie",
    publishedAt: new Date("2026-03-21T11:00:00Z"),
    sourceArticles: [
      {
        sourceKey: "nos",
        sourceName: "NOS Nieuws",
        originalTitle:
          "Tweede Kamer debatteert over invoering Europese AI-wet in Nederland",
        url: "https://nos.nl/artikel/ai-wet-tweede-kamer-debat",
        publishedAt: "2026-03-21T10:30:00Z",
        sensationScore: 2.0,
        politicalLean: 0.0,
        perspective:
          "Feitelijke verslaggeving van het Kamerdebat. Citeert staatssecretaris, coalitiefracties en oppositie evenredig. Geen waardeoordelen over de wet zelf.",
        keyPhrases: [
          "AI-verordening",
          "implementatiewet",
          "Nationaal Toezichtorgaan",
        ],
      },
      {
        sourceKey: "nrc",
        sourceName: "NRC",
        originalTitle:
          "AI-wet: Europa reguleert, maar Nederland hinkt achterop met toezicht",
        url: "https://nrc.nl/nieuws/ai-wet-nederland-toezicht-achterop",
        publishedAt: "2026-03-21T11:30:00Z",
        sensationScore: 3.1,
        politicalLean: -1.1,
        perspective:
          "Analytisch en kritisch-positief. Wijst op het risico dat het toezichtorgaan te laat operationeel is. Citeert wetenschappers en EU-experts. Wil stevigere handhaving.",
        keyPhrases: [
          "achterop",
          "toezicht",
          "handhaving",
          "EU-experts",
          "tijdlijn",
        ],
      },
      {
        sourceKey: "telegraaf",
        sourceName: "De Telegraaf",
        originalTitle:
          "Brussel bemoeit zich met AI: ondernemers vrezen regeldruk en boetes",
        url: "https://telegraaf.nl/nieuws/ai-wet-brussel-ondernemers-regeldruk",
        publishedAt: "2026-03-21T09:00:00Z",
        sensationScore: 7.0,
        politicalLean: 2.3,
        perspective:
          "Framing als Brusselse overregulering die ondernemers schaadt. Citeert VVD en MKB Nederland. Weinig aandacht voor bescherming van burgerrechten als argument voor de wet.",
        keyPhrases: [
          "Brussel bemoeit zich",
          "regeldruk",
          "boetes",
          "ondernemers",
          "bureaucratie",
        ],
      },
      {
        sourceKey: "volkskrant",
        sourceName: "De Volkskrant",
        originalTitle:
          "Strengere AI-regels zijn broodnodig: wat mag en mag niet straks?",
        url: "https://volkskrant.nl/tech/ai-wet-uitleg-rechten~f33445",
        publishedAt: "2026-03-21T12:00:00Z",
        sensationScore: 3.5,
        politicalLean: -1.8,
        perspective:
          "Legt nadruk op bescherming van burgerrechten en risico's van AI-discriminatie. Informatief en normatief tegelijk. Steunt de wet maar vindt hem op punten te zwak.",
        keyPhrases: [
          "burgerrechten",
          "AI-discriminatie",
          "gezichtsherkenning",
          "toezicht",
          "transparantie",
        ],
      },
      {
        sourceKey: "ad",
        sourceName: "Algemeen Dagblad",
        originalTitle:
          "Nieuwe AI-wet: wat verandert er voor jou op het werk en in het dagelijks leven?",
        url: "https://ad.nl/tech/ai-wet-gevolgen-werk-dagelijks-leven~g44556",
        publishedAt: "2026-03-21T13:00:00Z",
        sensationScore: 3.8,
        politicalLean: 0.3,
        perspective:
          "Consumentgericht: praktische gevolgen van de AI-wet voor gewone Nederlanders. Heldere uitleg zonder sterk politiek frame. Citeert zowel werkgevers als werknemersorganisaties.",
        keyPhrases: [
          "wat verandert er",
          "werk",
          "dagelijks leven",
          "praktisch",
          "gevolgen",
        ],
      },
    ],
  },
  {
    slug: "nederland-humanitaire-hulp-gaza-50-miljoen",
    title: "Nederland stelt €50 miljoen beschikbaar voor humanitaire hulp in Gaza",
    summary:
      "Minister van Buitenlandse Handel en Ontwikkelingshulp Reinette LeNoir heeft €50 miljoen beschikbaar gesteld voor humanitaire hulp in Gaza. Het geld gaat via VN-organisaties en het Rode Kruis. In de Kamer is debat over de effectiviteit en politieke context.",
    objectiveReport: `Op 20 maart 2026 maakte minister van Buitenlandse Handel en Ontwikkelingshulp Reinette LeNoir (NSC) bekend dat Nederland €50 miljoen beschikbaar stelt voor humanitaire hulp aan de bevolking van Gaza. De bijdrage wordt gekanaliseerd via UNRWA (€20 miljoen), het Internationaal Comité van het Rode Kruis (€15 miljoen) en het World Food Programme (€15 miljoen).

De minister onderbouwde de beslissing met VN-rapporten die spreken van een acute humanitaire crisis, waarbij meer dan 1,1 miljoen mensen afhankelijk zijn van voedselhulp. Nederland heeft in 2025 al €38 miljoen bijgedragen aan humanitaire hulp in de regio.

De toewijzing aan UNRWA is controversieel: in 2024 schortte Nederland de UNRWA-bijdragen tijdelijk op na beschuldigingen over betrokkenheid van medewerkers bij de aanslagen van 7 oktober 2023. Een onafhankelijk onderzoek door de Colonna-commissie concludeerde in februari 2024 dat UNRWA als organisatie niet verantwoordelijk kon worden gesteld, waarna de steun werd hervat.

De Tweede Kamer debatteert op 2 april 2026 over de bijdrage en de bredere Nederlandse Midden-Oostenpolitiek.`,
    intriguingFacts: [
      {
        fact: "Nederland is historisch gezien één van de grootste per-capita-donoren van UNRWA ter wereld.",
        source: "UNRWA Annual Report, 2024",
      },
      {
        fact: "De totale internationale humanitaire hulp voor Gaza in 2025 bedroeg $4,8 miljard, maar slechts 61% bereikte de beoogde ontvangers vanwege toegangsbelemmeringen.",
        source: "OCHA Gaza Aid Monitor, 2025",
      },
      {
        fact: "Het WFP rapporteerde dat 93% van de Gazabevolking in 2025 acute voedselonzekerheid ervaart — het hoogste percentage ooit gemeten in een actief conflict.",
        source: "WFP Integrated Food Security Phase Classification, Q4 2025",
      },
      {
        fact: "Nederland heeft als één van de weinige NAVO-lidstaten zowel humanitaire hulp als wapenexport aan Israël gecombineerd — een beleid dat in meerdere rechtszaken is aangevochten.",
        source: "Rechtbank Den Haag, 2024–2025",
      },
    ],
    politicalContext: {
      parties: [
        {
          name: "GroenLinks-PvdA",
          abbreviation: "GL-PvdA",
          position: "for",
          context:
            "Steunt de bijdrage maar eist gelijktijdig een volledige wapenexportstop naar Israël.",
        },
        {
          name: "PVV",
          abbreviation: "PVV",
          position: "against",
          context:
            "Tegen bijdrage aan UNRWA. Noemt organisatie 'doorgeefluik voor Hamas'.",
        },
        {
          name: "VVD",
          abbreviation: "VVD",
          position: "divided",
          context:
            "Steunt hulp via Rode Kruis, maar kritisch over UNRWA-financiering.",
        },
        {
          name: "D66",
          abbreviation: "D66",
          position: "for",
          context: "Steunt de volledige bijdrage en vraagt om EU-coördinatie.",
        },
        {
          name: "NSC",
          abbreviation: "NSC",
          position: "for",
          context: "Coalitiepartij achter het besluit. Benadrukt humanitair recht.",
        },
      ],
      nextDebate: "2 april 2026",
    },
    category: "buitenland",
    publishedAt: new Date("2026-03-20T10:00:00Z"),
    sourceArticles: [
      {
        sourceKey: "nos",
        sourceName: "NOS Nieuws",
        originalTitle:
          "Nederland geeft €50 miljoen aan humanitaire hulp Gaza via VN en Rode Kruis",
        url: "https://nos.nl/artikel/nederland-50-miljoen-gaza-hulp",
        publishedAt: "2026-03-20T09:30:00Z",
        sensationScore: 2.2,
        politicalLean: 0.0,
        perspective:
          "Neutrale feitenrapportage over de aankondiging. Citeert minister en vermeld de politieke context van de UNRWA-kwestie zakelijk.",
        keyPhrases: [
          "humanitaire hulp",
          "VN-organisaties",
          "Rode Kruis",
          "50 miljoen euro",
        ],
      },
      {
        sourceKey: "telegraaf",
        sourceName: "De Telegraaf",
        originalTitle:
          "Nederland stuurt 50 MILJOEN naar Gaza — ondanks banden Hamas met UNRWA",
        url: "https://telegraaf.nl/nieuws/nederland-50-miljoen-gaza-unrwa-hamas",
        publishedAt: "2026-03-20T08:00:00Z",
        sensationScore: 8.5,
        politicalLean: 2.6,
        perspective:
          "Sterk negatief frame rond de UNRWA-bijdrage. Plaatst Hamas-connectie prominent in de headline. Citeert PVV en een pro-Israël lobbyist. Weinig ruimte voor humanitaire noodzaak.",
        keyPhrases: [
          "ondanks",
          "Hamas-banden",
          "UNRWA-schandaal",
          "belastinggeld",
          "gevaarlijk",
        ],
      },
      {
        sourceKey: "volkskrant",
        sourceName: "De Volkskrant",
        originalTitle:
          "Nederland herstelt Gaza-hulp: goed nieuws voor hongerende bevolking, maar te weinig",
        url: "https://volkskrant.nl/buitenland/nederland-gaza-hulp-onvoldoende~h55667",
        publishedAt: "2026-03-20T10:45:00Z",
        sensationScore: 4.5,
        politicalLean: -2.0,
        perspective:
          "Welwillend tegenover de maatregel maar kritisch: het bedrag is onvoldoende gegeven de schaal van de crisis. Citeert VN-medewerkers en een correspondent in de regio.",
        keyPhrases: [
          "te weinig",
          "humanitaire nood",
          "hongerende bevolking",
          "correspondent",
          "crisis",
        ],
      },
      {
        sourceKey: "trouw",
        sourceName: "Trouw",
        originalTitle:
          "Gaza-hulp: hoe Nederland humanitaire principes en politieke druk probeert te combineren",
        url: "https://trouw.nl/buitenland/gaza-hulp-nederland-humanitaire-principes~i66778",
        publishedAt: "2026-03-20T11:00:00Z",
        sensationScore: 3.1,
        politicalLean: -0.8,
        perspective:
          "Diepgravende analyse van de spanning tussen humanitair recht en politieke realiteit. Evenwichtig, citeert juridische experts en hulporganisaties.",
        keyPhrases: [
          "humanitair recht",
          "politieke druk",
          "spanning",
          "juridisch",
          "principes",
        ],
      },
      {
        sourceKey: "ad",
        sourceName: "Algemeen Dagblad",
        originalTitle:
          "Minister trekt €50 miljoen uit voor Gaza: 'Mensen sterven van de honger'",
        url: "https://ad.nl/buitenland/minister-50-miljoen-gaza-honger~j77889",
        publishedAt: "2026-03-20T09:00:00Z",
        sensationScore: 5.0,
        politicalLean: 0.2,
        perspective:
          "Emotioneel instapanker via citaat over honger. Redelijk evenwichtig in de rest van het stuk. Brengt zowel voor- als tegenstanders aan het woord.",
        keyPhrases: [
          "mensen sterven",
          "honger",
          "minister",
          "emotioneel",
          "50 miljoen",
        ],
      },
    ],
  },
  {
    slug: "ns-staking-fnv-cao-driedaags",
    title: "FNV kondigt driedaagse staking aan bij NS vanwege cao-conflict",
    summary:
      "Vakbond FNV heeft een driedaagse staking aangekondigd bij de NS van 1 tot en met 3 april 2026. Inzet is een loonsverhoging van 7,5% en betere roosters. NS verwacht volledige uitval van treindiensten op de drie stakingsdagen.",
    objectiveReport: `Op 19 maart 2026 maakte vakbond FNV Spoor bekend dat treinpersoneel van NS van 1 tot en met 3 april 2026 het werk neer zal leggen. De staking is het gevolg van het mislukken van cao-onderhandelingen. FNV eist een loonsverhoging van 7,5% met terugwerkende kracht per 1 januari 2026, verbetering van roosters door minimaal 28 dagelijkse rusturen, en extra personeel om werkdruk te verlagen.

NS heeft in de onderhandelingen een bod van 4,8% loonsverhoging gedaan, gecombineerd met een eenmalige uitkering van €750 en een plan voor roosterverbetering over een periode van twee jaar. FNV heeft dit bod als onvoldoende afgewezen.

NS verwacht bij een volledige staking dat alle treinverbindingen — circa 400.000 dagelijkse reizigers — komen te vervallen. Alternatief openbaar vervoer (bus, metro, tram) valt buiten de staking en rijdt normaal. NS heeft een noodplan voor beperkte verbindingen op kritische trajecten, maar geeft aan dat dit niet gegarandeerd kan worden geoperationaliseerd.

De NS-cao is per 31 december 2025 verlopen. Een eerdere ééndag-staking op 8 februari 2026 leidde tot volledige treinuitval. De UOV (vakbond voor hogere NS-medewerkers) heeft de staking niet gesteund.`,
    intriguingFacts: [
      {
        fact: "Een ééndagse NS-staking kost de Nederlandse economie naar schatting €85 miljoen door productiviteitsverlies.",
        source: "SEO Economisch Onderzoek, 2024",
      },
      {
        fact: "Het ziekteverzuim bij NS-rijdend personeel lag in 2025 op 9,8% — bijna het dubbele van het landelijk gemiddelde van 5,1%.",
        source: "NS Jaarverslag, 2025",
      },
      {
        fact: "In Nederland gelden geen minimumdiensten voor het openbaar vervoer bij stakingen, in tegenstelling tot landen als Frankrijk en Italië.",
        source: "Arbeidswet Nederland / vergelijkend EU-onderzoek",
      },
      {
        fact: "De huidige NS-cao-onderhandelingen zijn de langste sinds 2001: ze lopen al 14 maanden.",
        source: "FNV Spoor, persbericht 19 maart 2026",
      },
    ],
    politicalContext: {
      parties: [
        {
          name: "SP",
          abbreviation: "SP",
          position: "for",
          context: "Steunt de staking. Eist NS-nationalisering en betere arbeidsomstandigheden.",
        },
        {
          name: "PVV",
          abbreviation: "PVV",
          position: "against",
          context:
            "Kritisch op de staking: 'reizigers worden gegijzeld door vakbondsradicalisme'.",
        },
        {
          name: "GroenLinks-PvdA",
          abbreviation: "GL-PvdA",
          position: "for",
          context:
            "Steunt stakingsrecht, vraagt kabinet NS aan te spreken op onderhandelingspositie.",
        },
        {
          name: "VVD",
          abbreviation: "VVD",
          position: "neutral",
          context: "Vindt staking arbeidsrechtelijk legitiem maar 'onwenselijk voor de reiziger'.",
        },
      ],
    },
    category: "economie",
    publishedAt: new Date("2026-03-19T11:00:00Z"),
    sourceArticles: [
      {
        sourceKey: "nos",
        sourceName: "NOS Nieuws",
        originalTitle:
          "FNV kondigt driedaagse staking aan bij NS: treinen rijden niet op 1, 2 en 3 april",
        url: "https://nos.nl/artikel/ns-staking-fnv-april-2026",
        publishedAt: "2026-03-19T10:00:00Z",
        sensationScore: 2.5,
        politicalLean: 0.0,
        perspective:
          "Feitelijke berichtgeving over de aankondiging. Citeert zowel FNV als NS. Vermeldt alternatief vervoer en praktische tips voor reizigers.",
        keyPhrases: [
          "driedaagse staking",
          "treinen rijden niet",
          "alternatief vervoer",
          "FNV",
        ],
      },
      {
        sourceKey: "telegraaf",
        sourceName: "De Telegraaf",
        originalTitle:
          "CHAOS OP DE RAILS: FNV legt treinen DRIE DAGEN plat — uw trein rijdt niet",
        url: "https://telegraaf.nl/nieuws/ns-staking-chaos-drie-dagen",
        publishedAt: "2026-03-19T08:00:00Z",
        sensationScore: 9.1,
        politicalLean: 2.2,
        perspective:
          "Maximale dramatisering van de impact. 'Chaos', 'gijzeling van reizigers'. Nadruk op overlast voor forenzen. Framing van FNV als onverantwoordelijk.",
        keyPhrases: [
          "chaos",
          "plat",
          "drie dagen",
          "gijzeling",
          "FNV-radicalisme",
          "reizigers de dupe",
        ],
      },
      {
        sourceKey: "ad",
        sourceName: "Algemeen Dagblad",
        originalTitle:
          "Staking NS: wat moet u weten en hoe kunt u zich voorbereiden?",
        url: "https://ad.nl/reizen/ns-staking-april-2026-voorbereiden~k88990",
        publishedAt: "2026-03-19T11:30:00Z",
        sensationScore: 3.9,
        politicalLean: 0.2,
        perspective:
          "Praktisch consumentgericht. Geeft stappenplan voor reizigers: alternatieven, terugbetalingsregelingen, werkgeversafspraken. Beperkt aandacht voor vakbondsstandpunt.",
        keyPhrases: [
          "wat moet u weten",
          "voorbereiden",
          "alternatieven",
          "terugbetaling",
          "forenzen",
        ],
      },
      {
        sourceKey: "parool",
        sourceName: "Het Parool",
        originalTitle:
          "NS-personeel bereikt grens: 'We rijden al jaren met kapotte roosters'",
        url: "https://parool.nl/amsterdam/ns-personeel-roosters-staking~l99001",
        publishedAt: "2026-03-19T12:00:00Z",
        sensationScore: 4.8,
        politicalLean: -1.6,
        perspective:
          "Geeft ruimschoots stem aan NS-medewerkers. Frame: uitgeputte werknemers die hun gezondheid opofferen. Kritisch op NS-directie, sympathiek tegenover vakbond.",
        keyPhrases: [
          "grens bereikt",
          "kapotte roosters",
          "werkdruk",
          "personeel",
          "uitgeput",
        ],
      },
      {
        sourceKey: "rtl",
        sourceName: "RTL Nieuws",
        originalTitle:
          "NS-staking duurt drie dagen: dit zijn de gevolgen voor uw woon-werkverkeer",
        url: "https://rtlnieuws.nl/economie/ns-staking-drie-dagen-gevolgen",
        publishedAt: "2026-03-19T09:30:00Z",
        sensationScore: 4.5,
        politicalLean: 0.1,
        perspective:
          "Breed opgezet: combineert reizigersinformatie met achtergrond cao-conflict. Evenwichtig, citeert FNV en NS gelijkwaardig.",
        keyPhrases: [
          "gevolgen",
          "woon-werkverkeer",
          "cao-conflict",
          "drie dagen",
        ],
      },
    ],
  },
  {
    slug: "energieprijzen-stijging-12-procent-winter-2026",
    title:
      "Energieprijzen stijgen 12% door aanhoudende koude en verminderde gasopslag",
    summary:
      "De Nederlandse energieprijzen zijn in maart 2026 met gemiddeld 12% gestegen ten opzichte van februari. De prijsstijging wordt verklaard door de aanhoudende koude, lage Europese gasopslagvoorraden en verminderde LNG-aanvoer uit de VS.",
    objectiveReport: `In de week van 17 maart 2026 zijn de Nederlandse energietarieven voor huishoudens gemiddeld met 12% gestegen ten opzichte van de voorgaande maand, aldus data van het Centraal Bureau voor de Statistiek (CBS) en energiemarktwaakhond ACM.

De gemiddelde variabele gasprijs steeg van €1,24 naar €1,39 per m³. De elektriciteitsprijs steeg van €0,31 naar €0,35 per kWh. Oorzaken zijn een combinatie van factoren: de aanhoudende koude (gemiddeld 3°C onder normaal in februari-maart 2026), de Europese gasopslagvoorraden die 42% bedragen (normaal voor deze tijd van het jaar: 55%), en een vertraging in LNG-leveranties vanuit de VS door logistieke problemen bij terminale in Louisiana.

TTF-gasprijzen op de Amsterdamse energiebeurs sloten op 17 maart op €52 per megawattuur, het hoogste niveau sinds januari 2023. Energiemaatschappijen Vattenfall, Eneco en Essent kondigden tariefaanpassingen aan die per 1 april ingaan voor vaste-contractklanten met een jaarlijkse herevaluatieclausule.

ACM stelde dat de prijsontwikkeling marktconform is en er geen aanwijzingen zijn voor marktmanipulatie. Het kabinet heeft geen noodmaatregelen aangekondigd.`,
    intriguingFacts: [
      {
        fact: "Nederlandse huishoudens geven gemiddeld €2.850 per jaar uit aan energie — 8% meer dan het Europees gemiddelde.",
        source: "Eurostat Energy Statistics, 2025",
      },
      {
        fact: "De gasopslagvoorraden in Europa waren per 1 maart 2026 op het laagste peil in tien jaar door een bijzonder koude winter.",
        source: "Gas Infrastructure Europe, maart 2026",
      },
      {
        fact: "Windenergie leverde in februari 2026 slechts 11% van de Nederlandse stroombehoefte door uitzonderlijk windstil weer — de zogenoemde 'Dunkelflaute'.",
        source: "Tennet, Q1 2026 Rapport",
      },
      {
        fact: "Het Nederlandse gasverbruik daalde in 2025 met 18% ten opzichte van 2021 dankzij isolatiesubsidies en warmtepompen, maar is nog steeds de op drie na hoogste per capita in de EU.",
        source: "RVO Nederland, 2025",
      },
    ],
    politicalContext: {
      parties: [
        {
          name: "SP",
          abbreviation: "SP",
          position: "for",
          context:
            "Eist een prijsplafond voor kleinverbruikers, vergelijkbaar met 2022–2023.",
        },
        {
          name: "PVV",
          abbreviation: "PVV",
          position: "for",
          context:
            "Pleit voor versnelde gaswinning in Groningen en verlaging van energiebelasting.",
        },
        {
          name: "VVD",
          abbreviation: "VVD",
          position: "against",
          context:
            "Tegen overheidsinterventie in de energiemarkt. Vertrouwt op marktwerking.",
        },
        {
          name: "GroenLinks-PvdA",
          abbreviation: "GL-PvdA",
          position: "divided",
          context:
            "Steunt tijdelijk prijsplafond voor lage inkomens, maar wil geen Groninger gaswinning.",
        },
      ],
    },
    category: "economie",
    publishedAt: new Date("2026-03-18T09:00:00Z"),
    sourceArticles: [
      {
        sourceKey: "nos",
        sourceName: "NOS Nieuws",
        originalTitle:
          "Energieprijzen stijgen 12 procent in maart door koude en lage gasvoorraden",
        url: "https://nos.nl/artikel/energieprijzen-stijging-maart-2026",
        publishedAt: "2026-03-18T08:30:00Z",
        sensationScore: 2.4,
        politicalLean: 0.0,
        perspective:
          "Feitelijke analyse van de prijsstijging met oorzaken. Citeert ACM, CBS en energiebedrijven. Zakelijk en informatief.",
        keyPhrases: [
          "12 procent stijging",
          "gasopslagvoorraden",
          "TTF-prijs",
          "marktconform",
        ],
      },
      {
        sourceKey: "telegraaf",
        sourceName: "De Telegraaf",
        originalTitle:
          "ENERGIESHOCK: Uw rekening omhoog terwijl Rutte in Brussel feest viert",
        url: "https://telegraaf.nl/nieuws/energieprijzen-stijging-shock-2026",
        publishedAt: "2026-03-18T07:00:00Z",
        sensationScore: 9.2,
        politicalLean: 2.5,
        perspective:
          "Koppelt energieprijzen aan Europees beleid op provocerende wijze. 'Uw rekening omhoog' als persoonlijke aanval. Geen oog voor marktwerking of mondiale oorzaken.",
        keyPhrases: [
          "energieshock",
          "rekening omhoog",
          "Brussel",
          "u betaalt",
          "kabinetsbeleid fout",
        ],
      },
      {
        sourceKey: "nrc",
        sourceName: "NRC",
        originalTitle:
          "Energieprijzen omhoog: structurele kwetsbaarheid of tijdelijk fenomeen?",
        url: "https://nrc.nl/nieuws/energieprijzen-structureel-analyse~m10112",
        publishedAt: "2026-03-18T10:00:00Z",
        sensationScore: 2.8,
        politicalLean: -1.0,
        perspective:
          "Diepgravende analyse: zijn de prijsstijgingen structureel of tijdelijk? Citeert energie-economen en Tennet. Stelt kritische vragen over afhankelijkheid van fossiel gas.",
        keyPhrases: [
          "structureel",
          "analyse",
          "Dunkelflaute",
          "energietransitie",
          "kwetsbaarheid",
        ],
      },
      {
        sourceKey: "ad",
        sourceName: "Algemeen Dagblad",
        originalTitle:
          "Energierekening weer hoger: zo beperkt u de schade deze maand",
        url: "https://ad.nl/economie/energierekening-hoger-tips-2026~n11223",
        publishedAt: "2026-03-18T09:00:00Z",
        sensationScore: 4.0,
        politicalLean: 0.3,
        perspective:
          "Praktisch: 10 concrete tips om op energie te besparen. Consumentgericht, geen diepgaande analyse van oorzaken. Verwijst wel naar mogelijke overheidshulp.",
        keyPhrases: [
          "energierekening",
          "tips",
          "besparen",
          "maand",
          "schade beperken",
        ],
      },
      {
        sourceKey: "volkskrant",
        sourceName: "De Volkskrant",
        originalTitle:
          "Stijgende energierekening treft arme huishoudens het hardst: 'We moeten kiezen tussen eten en verwarmen'",
        url: "https://volkskrant.nl/economie/energieprijzen-armoede-2026~o22334",
        publishedAt: "2026-03-18T11:00:00Z",
        sensationScore: 5.2,
        politicalLean: -1.9,
        perspective:
          "Frame van sociale ongelijkheid: energiearmoede treft kwetsbare huishoudens het zwaarst. Emotioneel citaat centraal. Pleit voor overheidsinterventie voor lage inkomens.",
        keyPhrases: [
          "arme huishoudens",
          "eten of verwarmen",
          "energiearmoede",
          "ongelijkheid",
          "overheidssteun",
        ],
      },
    ],
  },
];

// Generate 14 days of historical stats
export function generateMockDailyStats() {
  const sources = ["nos", "volkskrant", "nrc", "trouw", "parool", "ad", "telegraaf", "nd", "rtl"];
  const baseLeans: Record<string, number> = {
    nos: 0.0, volkskrant: -1.9, nrc: -1.2, trouw: -0.9, parool: -1.6,
    ad: 0.3, telegraaf: 2.4, nd: 1.3, rtl: 0.2,
  };
  const baseSensations: Record<string, number> = {
    nos: 1.8, volkskrant: 3.8, nrc: 2.6, trouw: 2.9, parool: 4.2,
    ad: 5.1, telegraaf: 7.6, nd: 3.2, rtl: 4.7,
  };

  const stats = [];
  const today = new Date("2026-03-26");

  for (let d = 13; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    date.setHours(0, 0, 0, 0);

    for (const source of sources) {
      const leanJitter = (Math.random() - 0.5) * 0.4;
      const sensationJitter = (Math.random() - 0.5) * 1.2;
      stats.push({
        sourceKey: source,
        date,
        avgSensation: Math.max(0, Math.min(10, baseSensations[source] + sensationJitter)),
        politicalLean: Math.max(-5, Math.min(5, baseLeans[source] + leanJitter)),
        articleCount: Math.floor(Math.random() * 12) + 4,
      });
    }
  }
  return stats;
}
