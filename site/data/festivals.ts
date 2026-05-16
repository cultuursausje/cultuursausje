import type { Festival } from "@/types";

export const festivals: Festival[] = [
  {
    id: "holland-festival",
    naam: "Holland Festival",
    periode: "Juni",
    plaats: "Amsterdam",
    beschrijving: "Het oudste en grootste internationale podiumkunstenfestival van Nederland. Toont jaarlijks gerenommeerde internationale gezelschappen en grensverleggend werk.",
    url: "https://www.hollandfestival.nl",
    accent: "#FF3D8B",
    match_keywords: ["holland festival"]
  },
  {
    id: "julidans",
    naam: "Julidans",
    periode: "Juli",
    plaats: "Amsterdam",
    beschrijving: "Het grootste festival voor hedendaagse internationale dans in Nederland. Twee weken lang vernieuwende choreografieën.",
    url: "https://www.julidans.nl",
    accent: "#9BD43F",
    match_keywords: ["julidans"]
  },
  {
    id: "oerol",
    naam: "Oerol",
    periode: "Juni",
    plaats: "Terschelling",
    beschrijving: "Tien dagen locatietheater, muziek en beeldende kunst op Terschelling. Het hele Waddeneiland is podium.",
    url: "https://www.oerol.nl",
    accent: "#2D4DEB",
    match_keywords: ["oerol"]
  },
  {
    id: "ntf",
    naam: "Nederlands Theater Festival",
    periode: "September",
    plaats: "Amsterdam",
    beschrijving: "De beste Nederlandse en Vlaamse theaterproducties van het afgelopen seizoen, samengebracht in één feestelijk festival.",
    url: "https://www.tf.nl",
    accent: "#E5B53A",
    match_keywords: ["nederlands theater festival", "ntf"]
  },
  {
    id: "amsterdam-fringe",
    naam: "Amsterdam Fringe Festival",
    periode: "September",
    plaats: "Amsterdam",
    beschrijving: "Elf dagen vernieuwend, eigenzinnig en internationaal theater door 70+ nieuwe makers in Amsterdam.",
    url: "https://www.amsterdamfringefestival.nl",
    accent: "#FF6B35",
    match_keywords: ["amsterdam fringe", "fringe"]
  },
  {
    id: "festival-boulevard",
    naam: "Festival Boulevard",
    periode: "Augustus",
    plaats: "'s-Hertogenbosch",
    beschrijving: "Tiendaags festival in Den Bosch met internationaal en Nederlands vernieuwend theater, dans en muziek.",
    url: "https://www.festivalboulevard.nl",
    accent: "#B85FFF",
    match_keywords: ["festival boulevard", "boulevard"]
  },
  {
    id: "karavaan",
    naam: "Karavaan Festival",
    periode: "Mei – Juni",
    plaats: "Noord-Holland",
    beschrijving: "Locatie- en straat-theater verspreid over Noord-Holland. Theater op bijzondere plekken, ver weg van de zaal.",
    url: "https://www.karavaan.nl",
    accent: "#00B4FF",
    match_keywords: ["karavaan"]
  },
  {
    id: "festival-ad-werf",
    naam: "Festival a/d Werf",
    periode: "Mei",
    plaats: "Utrecht",
    beschrijving: "Festival voor nieuwe makers en jong talent in Utrecht. Voorstellingen vaak op bijzondere locaties in en rond de stad.",
    url: "https://www.festivalaandewerf.nl",
    accent: "#FF6FA8",
    match_keywords: ["festival a/d werf", "festival aan de werf"]
  }
];
