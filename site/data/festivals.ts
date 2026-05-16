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
    match_keywords: ["holland festival"],
    foto_urls: [
      "https://picsum.photos/seed/holland-festival-1/1280/720",
      "https://picsum.photos/seed/holland-festival-2/1280/720",
      "https://picsum.photos/seed/holland-festival-3/1280/720"
    ],
    foto_credit: "Placeholder via Lorem Picsum"
  },
  {
    id: "julidans",
    naam: "Julidans",
    periode: "Juli",
    plaats: "Amsterdam",
    beschrijving: "Het grootste festival voor hedendaagse internationale dans in Nederland. Twee weken lang vernieuwende choreografieën.",
    url: "https://www.julidans.nl",
    accent: "#9BD43F",
    match_keywords: ["julidans"],
    foto_urls: [
      "https://julidans.nl/img/singles/cropped-beeld-zonder-iets-voor-website.jpg?w=1280&h=720&fit=crop-50-50",
      "https://julidans.nl/img/singles/ROOM-IN-OUR-HOUSE-Campagnebeeld-Design-Studio-Colorado-Photography-Kwadwo-Amfo.jpg?w=1280&h=720&fit=crop-50-50",
      "https://julidans.nl/img/singles/Tempest_%C2%A9Danny-Willems_Voetvolk_0DS9505_HiRes-4000pxl.JPG?w=1280&h=720&fit=crop-50-50"
    ],
    foto_credit: "Julidans"
  },
  {
    id: "oerol",
    naam: "Oerol",
    periode: "Juni",
    plaats: "Terschelling",
    beschrijving: "Tien dagen locatietheater, muziek en beeldende kunst op Terschelling. Het hele Waddeneiland is podium.",
    url: "https://www.oerol.nl",
    accent: "#2D4DEB",
    match_keywords: ["oerol"],
    foto_urls: [
      "https://oerol.nl/app/uploads/2026/02/Header-Youtube-2026_2048-x-1152-scaled.jpg",
      "https://oerol.nl/app/uploads/2024/02/Nieuwsbrief.png"
    ],
    foto_credit: "Oerol Festival"
  },
  {
    id: "ntf",
    naam: "Nederlands Theater Festival",
    periode: "September",
    plaats: "Amsterdam",
    beschrijving: "De beste Nederlandse en Vlaamse theaterproducties van het afgelopen seizoen, samengebracht in één feestelijk festival.",
    url: "https://www.tf.nl",
    accent: "#E5B53A",
    match_keywords: ["nederlands theater festival", "ntf"],
    foto_urls: [
      "https://tf.nl/wp-content/uploads/2025/07/NTF25_Website-headers6-2.jpg",
      "https://tf.nl/wp-content/uploads/2026/02/Lage-Landen-Liefde-2025-Mark-Bolk-600x360.jpg",
      "https://tf.nl/wp-content/uploads/2026/04/Farnoosh-en-Tobias-foto-door-Jaap-Kroon-600x360.jpg"
    ],
    foto_credit: "Mark Bolk, Jaap Kroon — Nederlands Theater Festival"
  },
  {
    id: "amsterdam-fringe",
    naam: "Amsterdam Fringe Festival",
    periode: "September",
    plaats: "Amsterdam",
    beschrijving: "Elf dagen vernieuwend, eigenzinnig en internationaal theater door 70+ nieuwe makers in Amsterdam.",
    url: "https://www.amsterdamfringefestival.nl",
    accent: "#FF6B35",
    match_keywords: ["amsterdam fringe", "fringe"],
    foto_urls: [
      "https://picsum.photos/seed/fringe-amsterdam-1/1280/720",
      "https://picsum.photos/seed/fringe-amsterdam-2/1280/720",
      "https://picsum.photos/seed/fringe-amsterdam-3/1280/720"
    ],
    foto_credit: "Placeholder via Lorem Picsum"
  },
  {
    id: "festival-boulevard",
    naam: "Festival Boulevard",
    periode: "Augustus",
    plaats: "'s-Hertogenbosch",
    beschrijving: "Tiendaags festival in Den Bosch met internationaal en Nederlands vernieuwend theater, dans en muziek.",
    url: "https://www.festivalboulevard.nl",
    accent: "#B85FFF",
    match_keywords: ["festival boulevard", "boulevard"],
    foto_urls: [
      "https://media.festivalboulevard.nl/media/berlin-karin-jonkers-1920x1080.jpg?guid=39589b14-6463-44d5-a139-1abf2a056eef",
      "https://media.festivalboulevard.nl/media/20250815_plein_kimvanderweerden_000_1.jpg?guid=243427f7-1b1c-4efa-bfa8-ed31d368e7c8",
      "https://media.festivalboulevard.nl/media/20250815_plein_kimvanderweerden_000_6.jpg?guid=f3cf6421-7669-473b-810b-fd111f5c1d75"
    ],
    foto_credit: "Karin Jonkers, Kim van der Weerden — Theaterfestival Boulevard"
  },
  {
    id: "karavaan",
    naam: "Karavaan Festival",
    periode: "Mei – Juni",
    plaats: "Noord-Holland",
    beschrijving: "Locatie- en straat-theater verspreid over Noord-Holland. Theater op bijzondere plekken, ver weg van de zaal.",
    url: "https://www.karavaan.nl",
    accent: "#00B4FF",
    match_keywords: ["karavaan"],
    foto_urls: [
      "https://picsum.photos/seed/karavaan-1/1280/720",
      "https://picsum.photos/seed/karavaan-2/1280/720",
      "https://picsum.photos/seed/karavaan-3/1280/720"
    ],
    foto_credit: "Placeholder via Lorem Picsum"
  },
  {
    id: "festival-ad-werf",
    naam: "Festival a/d Werf",
    periode: "Mei",
    plaats: "Utrecht",
    beschrijving: "Festival voor nieuwe makers en jong talent in Utrecht. Voorstellingen vaak op bijzondere locaties in en rond de stad.",
    url: "https://www.festivalaandewerf.nl",
    accent: "#FF6FA8",
    match_keywords: ["festival a/d werf", "festival aan de werf"],
    foto_urls: [
      "https://picsum.photos/seed/werf-utrecht-1/1280/720",
      "https://picsum.photos/seed/werf-utrecht-2/1280/720",
      "https://picsum.photos/seed/werf-utrecht-3/1280/720"
    ],
    foto_credit: "Placeholder via Lorem Picsum"
  }
];
