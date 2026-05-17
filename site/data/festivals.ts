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
    foto_credit: "Julidans",
    voorstellingen: [
      {
        id: "julidans-fcking-future",
        titel: "F*cking Future",
        gezelschap: "Marco da Silva Ferreira",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/Ferreira_Danse25_A7R1106©BlandineSoulage.jpg",
        foto_credit: "Blandine Soulage",
        korte_omschrijving: "F*cking Future laat orde en discipline wankelen.",
        url: "https://julidans.nl/nl/voorstellingen/f-cking-future/5210761/"
      },
      {
        id: "julidans-its-the-end-of-the-amusement-phase",
        titel: "It's the end of the amusement phase",
        gezelschap: "Chara Kotsali",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/The_End_of_the_Amusement_Phase_ODD_25_@Pinelopi_Gerasimou_for_Onassis_Stegi_High-47.jpg",
        foto_credit: "Pinelopi Gerasimou",
        korte_omschrijving: "Een energieke en eigenzinnige rollercoaster van beeld en beweging. Over vooruitgang, uitputting en het wankelen van de belofte op een toekomst.",
        url: "https://julidans.nl/nl/voorstellingen/its-the-end-of-the-amusement-phase/5210842/"
      },
      {
        id: "julidans-lava",
        titel: "L.A.V.A.",
        gezelschap: "Emio Greco & Pieter C. Scholten / Roberto Zappalà / ICK Dans Amsterdam",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/L.A.V.A.-Publicity-Photo-Landscape-©-Alwin-Poiana.jpg",
        foto_credit: "Alwin Poiana",
        korte_omschrijving: "Twee radicale danswerelden ontmoeten elkaar in een zinderend speelveld waar verschil geen grens vormt, maar de motor van nieuwe beweging.",
        url: "https://julidans.nl/nl/voorstellingen/l-a-v-a/5210903/"
      },
      {
        id: "julidans-shiraz",
        titel: "Shiraz",
        gezelschap: "Armin Hokmi",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/sf2025-26april_SHIRAZ┬®rubenvuaran-7.jpg",
        foto_credit: "Ruben Vuaran",
        korte_omschrijving: "In deze hypnotische choreografie reageren lichamen, ritme en ruimte voortdurend op elkaar en word je langzaam meegetrokken in de cadans.",
        url: "https://julidans.nl/nl/voorstellingen/shiraz/5210864/"
      },
      {
        id: "julidans-room-in-our-house",
        titel: "ROOM IN OUR HOUSE",
        gezelschap: "Nicole Beutler Projects & Rematriation",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/ROOM-IN-OUR-HOUSE-Campagnebeeld-Design-Studio-Colorado-Photography-Kwadwo-Amfo.jpg",
        foto_credit: "Kwadwo Amfo",
        korte_omschrijving: "Een gedanst manifest voor vrede, in co-creatie met inheemse kunstenaars uit Noord-Amerika.",
        url: "https://julidans.nl/nl/voorstellingen/room-in-our-house/5210897/"
      },
      {
        id: "julidans-back-to-kidal",
        titel: "Back to Kidal",
        gezelschap: "Serge Aimé Coulibaly / Faso Danse Théâtre",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/A7400985.jpg",
        foto_credit: "Faso Danse Théâtre",
        korte_omschrijving: "De blues als fysiek archief van verzet. Coulibaly eert zijn roots en toont dat folklore springlevend is, en open voor vernieuwing.",
        url: "https://julidans.nl/nl/voorstellingen/back-to-kidal/5210801/"
      },
      {
        id: "julidans-tempest",
        titel: "Tempest",
        gezelschap: "Lisbeth Gruwez & Maarten Van Cauwenberghe / Voetvolk",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/Tempest_©Danny-Willems_Voetvolk_0DS9505_HiRes-4000pxl.JPG",
        foto_credit: "Danny Willems",
        korte_omschrijving: "Een lichaam in het oog van de storm.",
        url: "https://julidans.nl/nl/voorstellingen/tempest/5210830/"
      },
      {
        id: "julidans-antigone",
        titel: "Antigone",
        gezelschap: "Alan Lucien Øyen / winterguests",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/IMG_5590IMG_00-c-MATS-BÄCKER.JPG",
        foto_credit: "Mats Bäcker",
        korte_omschrijving: "Aangrijpend danstheater over verzet, geweten en de prijs die een individu betaalt wanneer het zich tegen de macht keert. In de geest van Pina Bausch.",
        url: "https://julidans.nl/nl/voorstellingen/antigone/5210807/"
      },
      {
        id: "julidans-ri-te",
        titel: "RI TE",
        gezelschap: "Israel Galván & Marlene Monteiro Freitas",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/LPH3538088©LaurentPhilippe.jpg",
        foto_credit: "Laurent Philippe",
        korte_omschrijving: "Twee iconische lichamen, twee schijnbaar onverenigbare tradities. Flamenco en performance botsen in een speels duel van ritme, stilte en fysieke spanning.",
        url: "https://julidans.nl/nl/voorstellingen/ri-te/5210870/"
      },
      {
        id: "julidans-delay-the-sadness",
        titel: "Delay the Sadness",
        gezelschap: "Sharon Eyal / S-E-D",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/25.jpg",
        foto_credit: "S-E-D",
        korte_omschrijving: "Nodigt uit om te voelen: verdriet en schoonheid tegelijk, en de kracht om,midden in verlies,te blijven bewegen.",
        url: "https://julidans.nl/nl/voorstellingen/delay-the-sadness/5210789/"
      },
      {
        id: "julidans-mercury-rising",
        titel: "Mercury Rising",
        gezelschap: "Jefta van Dinther",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/191125_MercuryRising_HAU2_@CeciliaGaeta_FINALS_012.jpg",
        foto_credit: "Cecilia Gaeta",
        korte_omschrijving: "Drie performers verweven gebarentaal en dans tot één vloeiende bewegingstaal.",
        url: "https://julidans.nl/nl/voorstellingen/mercury-rising/5210876/"
      },
      {
        id: "julidans-ultimo-helecho",
        titel: "Último Helecho",
        gezelschap: "Nina Laisné / François Chaignaud / Nadia Larcher",
        type: "dans",
        english_friendly: true,
        foto_url: "https://julidans.nl/img/singles/03-Último-helecho-©-Thaïs-Breton_2026-05-13-141513_pies.jpg",
        foto_credit: "Thaïs Breton",
        korte_omschrijving: "Wat als folklore niet bewaard wordt, maar leeft? Een diepe duik langs mythe, geheugen en vurige Zuid-Amerikaanse ritmes.",
        url: "https://julidans.nl/nl/voorstellingen/último-helecho/5210813/"
      }
    ]
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
    foto_credit: "Oerol Festival",
    voorstellingen: [
      {
        id: "oerol-bambie-gaat-tot-de-bodem",
        titel: "Bambie Gaat Tot De Bodem",
        gezelschap: "Bambie",
        type: "mime",
        foto_url: "https://oerol.nl/app/uploads/2026/04/bambie-gaat-tot-de-bodem-3-scaled.jpg",
        foto_credit: "Ben van Duin",
        korte_omschrijving: "Met beeldende, fysieke comedy toont Bambie de absurde complexiteit van hedendaags natuurbeheer.",
        url: "https://oerol.nl/programma/bambie-gaat-tot-de-bodem/"
      },
      {
        id: "oerol-pucks-midzomernachtsdroom",
        titel: "Pucks Midzomernachtsdroom",
        gezelschap: "Veenfabriek",
        type: "muziek",
        foto_url: "https://oerol.nl/app/uploads/2026/04/pucks-midzomernachtsdroom-1.jpg",
        foto_credit: "Lin Woldendorp",
        korte_omschrijving: "Betoverend muziektheater dat je liefdeskruid in de ogen strooit en wakker schudt. Over dromen, dwarsliggen en (n)iets durven doen.",
        url: "https://oerol.nl/programma/pucks-midzomernachtsdroom/"
      },
      {
        id: "oerol-harlekino",
        titel: "Harlekino",
        gezelschap: "Troupe Courage",
        type: "toneel",
        foto_url: "https://oerol.nl/app/uploads/2026/04/harlekino-1.jpg",
        foto_credit: "Sacha Muller",
        korte_omschrijving: "Katrien van Beurden speelt deze onewomanshow: een waargebeurd verhaal dat je niet hoeft te geloven. Over overleven en overlevers, met muziek van Remy van Kesteren.",
        url: "https://oerol.nl/programma/harlekino/"
      },
      {
        id: "oerol-coda",
        titel: "CODA",
        gezelschap: "Cello Octet Amsterdam / Sophie van Winden",
        type: "muziek",
        foto_url: "https://oerol.nl/app/uploads/2026/04/coda-1-scaled.jpg",
        foto_credit: "Cello Octet Amsterdam",
        korte_omschrijving: "De honderdjarige Magda viert samen met de muziek van klimaatactivist en componist Ryuichi Sakamoto haar laatste uur. Wat mag er niet mee haar graf in?",
        url: "https://oerol.nl/programma/coda/"
      },
      {
        id: "oerol-de-grote-kutshow",
        titel: "De Grote Kutshow",
        gezelschap: "De Grote Kutshow",
        type: "toneel",
        foto_url: "https://oerol.nl/app/uploads/2026/04/de-grote-kutshow-1.jpg",
        foto_credit: "De Grote Kutshow",
        korte_omschrijving: "Een educatieve en muzikale voorstelling met vernieuwende seksuele voorlichting voor jong én oud. Hier maakt waarschuwing eindelijk plaats voor plezier.",
        url: "https://oerol.nl/programma/de-grote-kutshow/"
      },
      {
        id: "oerol-spiral",
        titel: "Spiral",
        gezelschap: "Danstheater AYA / Anne Suurendonk",
        type: "dans",
        foto_url: "https://oerol.nl/app/uploads/2026/04/spiral.jpg",
        foto_credit: "Danstheater AYA",
        korte_omschrijving: "Jezelf zijn, jezelf verliezen, jezelf weer vinden. Een groep dansers neemt je mee op een gezamenlijke reis om het alledaagse te ontstijgen.",
        url: "https://oerol.nl/programma/spiral/"
      },
      {
        id: "oerol-chronos",
        titel: "Chronos",
        gezelschap: "Dunja Jocić / Silbersee",
        type: "dans",
        foto_url: "https://oerol.nl/app/uploads/2026/04/chronos-1-scaled.jpg",
        foto_credit: "Bowie Verschuuren",
        korte_omschrijving: "Op een open plek in het dennenbos dansen vijf figuren een wereld tevoorschijn waarin verleden en toekomst samenvallen.",
        url: "https://oerol.nl/programma/chronos/"
      },
      {
        id: "oerol-room-in-our-house",
        titel: "ROOM IN OUR HOUSE",
        gezelschap: "Nicole Beutler Projects / Rematriation",
        type: "dans",
        foto_url: "https://oerol.nl/app/uploads/2026/04/room-in-our-house-2.jpg",
        foto_credit: "Nicole Beutler Projects",
        korte_omschrijving: "Een gedanst manifest voor vrede, in co-creatie met inheemse kunstenaars uit Noord-Amerika.",
        url: "https://oerol.nl/programma/room-in-our-house/"
      },
      {
        id: "oerol-threads",
        titel: "Threads",
        gezelschap: "Remy van Kesteren",
        type: "muziek",
        foto_url: "https://oerol.nl/app/uploads/2026/04/threads-1-scaled.jpg",
        foto_credit: "Remy van Kesteren",
        korte_omschrijving: "Virtuoze harp, elektronica en lichtkunst in het donkere landschap. Een totaalervaring op het eiland.",
        url: "https://oerol.nl/programma/threads/"
      },
      {
        id: "oerol-uitkijkers",
        titel: "Uitkijkers",
        gezelschap: "Monki Business",
        type: "anders",
        foto_url: "https://oerol.nl/app/uploads/2026/04/uitkijkers-1.jpg",
        foto_credit: "Monki Business",
        korte_omschrijving: "Vier acrobaten verbeelden de wildste toekomstdromen op een klimtoestel van zeven meter hoog. Een uitnodiging om vooruit te kijken en samen te durven fantaseren.",
        url: "https://oerol.nl/programma/uitkijkers/"
      },
      {
        id: "oerol-the-air-between-us",
        titel: "The Air Between Us",
        gezelschap: "Chloe Loftus Dance",
        type: "dans",
        english_friendly: true,
        foto_url: "https://oerol.nl/app/uploads/2026/04/the-air-between-us-1.jpg",
        foto_credit: "Chloe Loftus Dance",
        korte_omschrijving: "Een adembenemende luchtdans en ode aan gelijkheid en empowerment, die wereldwijd harten verovert.",
        url: "https://oerol.nl/programma/the-air-between-us/"
      },
      {
        id: "oerol-reinaard",
        titel: "ReinAard",
        gezelschap: "Tom Lanoye",
        type: "toneel",
        foto_url: "https://oerol.nl/app/uploads/2026/04/reinaard-1-scaled.jpg",
        foto_credit: "Tom Lanoye / Behoud de Begeerte",
        korte_omschrijving: "Exclusief voor Oerol brengt performer Tom Lanoye 'zijn' Reinaard in de vorm van een feuilleton: vijf afleveringen van elk een uur.",
        url: "https://oerol.nl/programma/reinaard/"
      }
    ]
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
    foto_credit: "Mark Bolk, Jaap Kroon,Nederlands Theater Festival",
    voorstellingen: [
      {
        id: "ntf-schopenhauer",
        titel: "Schopenhauer",
        gezelschap: "Het Zuidelijk Toneel & Stefaan van Brabandt",
        type: "toneel",
        foto_url: "https://tf.nl/wp-content/uploads/2025/06/Schopenhauer_Het-Zuidelijk-Toneel_Sofie-Knijff_liggend-webres-scaled.jpg",
        foto_credit: "Sofie Knijff",
        korte_omschrijving: "Toegankelijk en sprankelend filosofisch theater rond Arthur Schopenhauer: waarom leven lijden is,en hoe je je daarvan kunt bevrijden.",
        url: "https://tf.nl/programma/schopenhauer/"
      },
      {
        id: "ntf-de-vlucht-naar-voren",
        titel: "De Vlucht naar voren – op naar een nieuw cultuurbestel",
        type: "toneel",
        foto_url: "https://tf.nl/wp-content/uploads/2025/11/WEB-Fotografie-NTF-PRO-94-of-120-600x360.jpg",
        foto_credit: "Nederlands Theater Festival",
        url: "https://tf.nl/programma/de-vlucht-naar-voren-op-naar-een-nieuw-cultuurbestel/"
      },
      {
        id: "ntf-de-herontdekking-van-de-hemel",
        titel: "De Herontdekking van De Hemel",
        gezelschap: "Paradiso Melkweg Productiehuis | DOX | Manu van Kersbergen | .multibeat",
        type: "toneel",
        foto_url: "https://tf.nl/wp-content/uploads/2025/06/HDVH-POSTER-LIGGEND-e1750955077725-600x360.jpg",
        foto_credit: "Paradiso Melkweg Productiehuis",
        url: "https://tf.nl/programma/de-herontdekking-van-de-hemel/"
      },
      {
        id: "ntf-hardkoor",
        titel: "HARDKOOR",
        gezelschap: "Naomi Velissariou | Theater Utrecht",
        type: "mime",
        foto_url: "https://tf.nl/wp-content/uploads/2025/06/24_Hardkoor-Atelier-Pamfilie-3_Liggend-600x360.jpg",
        foto_credit: "Atelier Pamfilie",
        url: "https://tf.nl/programma/hardkoor/"
      },
      {
        id: "ntf-dear-frail-male",
        titel: "Dear Frail Male",
        gezelschap: "Just van Bommel / Frascati Producties",
        type: "toneel",
        foto_url: "https://tf.nl/wp-content/uploads/2025/06/DEAR-FRAIL-MALE-fotografie-Bas-de-Brouwer-naamsvermelding-altijd-verplicht-10-Gemiddeld-600x360.jpg",
        foto_credit: "Bas de Brouwer",
        url: "https://tf.nl/programma/dear-frail-male/"
      },
      {
        id: "ntf-the-horse-of-jenin",
        titel: "The Horse of Jenin",
        gezelschap: "Alaa Shehada | Troupe Courage",
        type: "toneel",
        english_friendly: true,
        foto_url: "https://tf.nl/wp-content/uploads/2025/06/Alaa-_-002b-_-©DarioMisja-photography-600x360.jpeg",
        foto_credit: "Dario Misja",
        url: "https://tf.nl/programma/the-horse-of-jenin/"
      },
      {
        id: "ntf-gobek-aski",
        titel: "Göbek Aşkı",
        gezelschap: "Çiğdem Polat",
        type: "toneel",
        foto_url: "https://tf.nl/wp-content/uploads/2025/06/Fotograaf-Jaap-Kroon-Gemiddeld-600x360.jpg",
        foto_credit: "Jaap Kroon",
        url: "https://tf.nl/programma/gobek-aski/"
      },
      {
        id: "ntf-bestfriends",
        titel: "BestFriends 7+",
        gezelschap: "de zAAk A",
        type: "toneel",
        foto_url: "https://tf.nl/wp-content/uploads/2025/06/zAAk-A-Best-Friend-scenefotos-©Julian-Maiwald-2-600x360.jpg",
        foto_credit: "Julian Maiwald",
        url: "https://tf.nl/programma/bestfriends/"
      }
    ]
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
    foto_credit: "Karin Jonkers, Kim van der Weerden,Theaterfestival Boulevard"
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
    id: "o-festival",
    naam: "O. Festival",
    periode: "Eind mei – begin juni",
    plaats: "Rotterdam",
    beschrijving: "Internationaal festival voor opera, muziektheater en performance in Rotterdam. Grensverleggend werk op bijzondere plekken in de stad, van werven tot werkplaatsen.",
    url: "https://ofestival.nl",
    accent: "#5BB8C2",
    match_keywords: ["o. festival", "o festival", "operadagen", "operadagen rotterdam"],
    foto_urls: [
      "https://picsum.photos/seed/o-festival-1/1280/720",
      "https://picsum.photos/seed/o-festival-2/1280/720",
      "https://picsum.photos/seed/o-festival-3/1280/720"
    ],
    foto_credit: "Placeholder via Lorem Picsum"
  },
  {
    id: "spring-utrecht",
    naam: "SPRING Performing Arts Festival",
    periode: "Eind mei",
    plaats: "Utrecht",
    beschrijving: "Internationaal festival voor hedendaagse podiumkunsten in Utrecht. Tien dagen vernieuwend werk uit binnen- en buitenland, op grote en kleine podia én op locatie.",
    url: "https://springutrecht.nl",
    accent: "#9B7EBD",
    match_keywords: ["spring", "spring utrecht", "spring performing arts"],
    foto_urls: [
      "https://picsum.photos/seed/spring-utrecht-1/1280/720",
      "https://picsum.photos/seed/spring-utrecht-2/1280/720",
      "https://picsum.photos/seed/spring-utrecht-3/1280/720"
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
  },
  {
    id: "de-parade",
    naam: "De Parade",
    periode: "Juni – Augustus",
    plaats: "Rotterdam, Den Haag, Amsterdam, Utrecht",
    beschrijving: "Het enige rondreizende theaterfestival ter wereld. 80+ korte voorstellingen in theatertenten,theater, dans, mime en muziek, ieder zo'n 30 minuten zodat je er meerdere op een avond kan combineren. 's Zomers achtereenvolgens in Rotterdam, Den Haag, Amsterdam en Utrecht.",
    url: "https://deparade.nl",
    accent: "#FF8A33",
    match_keywords: ["de parade", "parade"],
    foto_urls: [
      "https://deparade.nl/wp-content/uploads/2026/05/Parade-Rotterdam-2026-Erik-van-t-hof-1-1920x1280.jpg",
      "https://deparade.nl/wp-content/uploads/2026/05/Screenshot-2026-05-13-at-09.48.34.png"
    ],
    foto_credit: "Erik van 't Hof,De Parade",
    voorstellingen: [
      {
        id: "de-parade-ashton-brothers-25-jaar",
        titel: "Ashton Brothers,25 jaar Parade",
        gezelschap: "Ashton Brothers",
        type: "anders",
        english_friendly: true,
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-2-500x400.jpg",
        foto_credit: "Ashton Brothers",
        korte_omschrijving: "Verbluffend totaaltheater van de Ashton Brothers, dit jaar 25 jaar op de Parade.",
        url: "https://deparade.nl/programma/ashton-brothers-ashton-brothers-25-jaar-parade/"
      },
      {
        id: "de-parade-conny-janssen-danst-manoeuvres",
        titel: "Manoeuvres",
        gezelschap: "Conny Janssen Danst",
        type: "dans",
        english_friendly: true,
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-1-500x400.jpg",
        foto_credit: "Conny Janssen Danst",
        korte_omschrijving: "Feestelijke publieksfavoriet over dromen, verleidingskunsten en arbeidsvitaminen.",
        url: "https://deparade.nl/programma/conny-janssen-danst-manoeuvres/"
      },
      {
        id: "de-parade-jakop-ahlbom-desillusionist",
        titel: "Desillusionist",
        gezelschap: "Jakop Ahlbom Company",
        type: "mime",
        english_friendly: true,
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-1-500x400.jpg",
        foto_credit: "Jakop Ahlbom Company",
        korte_omschrijving: "Fysiek, absurdistisch theater met een vleugje illusionisme.",
        url: "https://deparade.nl/programma/jakop-ahlbom-company-desillusionist/"
      },
      {
        id: "de-parade-ellen-ten-damme-club-medusa",
        titel: "Ellen ten Damme's Club Medusa",
        gezelschap: "Ellen ten Damme",
        type: "muziek",
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-1-500x400.jpg",
        foto_credit: "Ellen ten Damme",
        korte_omschrijving: "Een meezing-show, met onder andere Oudgrieks.",
        url: "https://deparade.nl/programma/ellen-ten-damme-ellen-ten-dammes-club-medusa/"
      },
      {
        id: "de-parade-het-zuidelijk-toneel-boomer-galore",
        titel: "Boomer Galore",
        gezelschap: "Het Zuidelijk Toneel",
        type: "toneel",
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-2-500x400.jpg",
        foto_credit: "Het Zuidelijk Toneel",
        korte_omschrijving: "Over bila's, burn-outs en bedrijfsborrels.",
        url: "https://deparade.nl/programma/het-zuidelijk-toneel-boomer-galore/"
      },
      {
        id: "de-parade-laura-van-dolron-liefhebben",
        titel: "Liefhebben",
        gezelschap: "Laura van Dolron",
        type: "toneel",
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/thumbnail-Laura-500x400.jpg",
        foto_credit: "Laura van Dolron",
        korte_omschrijving: "Stand-up Philosophy,hartverscheurend en hilarisch.",
        url: "https://deparade.nl/programma/laura-van-dolron-liefhebben/"
      },
      {
        id: "de-parade-panama-pictures-world-turned-upside-down",
        titel: "The world turned upside down",
        gezelschap: "Panama Pictures",
        type: "dans",
        english_friendly: true,
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-1-500x400.jpg",
        foto_credit: "Panama Pictures",
        korte_omschrijving: "Energiek schouwspel dat het virtuoze en het menselijke verbindt.",
        url: "https://deparade.nl/programma/panama-pictures-the-world-turned-upside-down/"
      },
      {
        id: "de-parade-slapstick-scherzo",
        titel: "Slâpstick's Schërzo",
        gezelschap: "SLÄPSTICK",
        type: "muziek",
        english_friendly: true,
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/thumbnail-Slapstick-500x400.jpg",
        foto_credit: "SLÄPSTICK",
        korte_omschrijving: "Al jaren een terugkerende hit op de Parade: 'Chaplin meets Chopin'. Internationaal gelauwerd, en het dak moet eraf.",
        url: "https://deparade.nl/programma/slapstick-slapsticks-scherzo/"
      },
      {
        id: "de-parade-wilfried-cok-mist",
        titel: "Mist",
        gezelschap: "Wilfried de Jong & Cok van Vuuren",
        type: "muziek",
        foto_url: "https://deparade.nl/wp-content/uploads/2026/04/Thumbnail-Wilfried_03-500x400.jpg",
        foto_credit: "De Parade",
        korte_omschrijving: "Filmisch en muzikaal theater.",
        url: "https://deparade.nl/programma/wilfried-de-jong-cok-van-vuuren-mist/"
      },
      {
        id: "de-parade-gershwin-bonevacia-gershwins-garden",
        titel: "Gershwin's Garden",
        gezelschap: "Gershwin Bonevacia",
        type: "toneel",
        english_friendly: true,
        foto_url: "https://deparade.nl/wp-content/uploads/2026/04/Gerschwin_01-500x400.jpg",
        foto_credit: "Gershwin Bonevacia",
        korte_omschrijving: "Poëtisch en meerstemmig: woord, klank en beeld smelten samen tot één.",
        url: "https://deparade.nl/programma/gershwin-bonevacia-gershwins-garden/"
      },
      {
        id: "de-parade-orkater-anne-fay-aisa-demeter",
        titel: "Aisa Demeter",
        gezelschap: "Orkater / Anne-Fay",
        type: "muziek",
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-2-500x400.jpg",
        foto_credit: "Orkater",
        korte_omschrijving: "Een moderne muzikale mythe over de kracht van woede, met intense zang, Caribische samples en diepe baslijnen.",
        url: "https://deparade.nl/programma/orkater-anne-fay-aisa-demeter/"
      },
      {
        id: "de-parade-stukk-op-spanning",
        titel: "Op Spanning",
        gezelschap: "STUKK",
        type: "toneel",
        foto_url: "https://deparade.nl/wp-content/uploads/2026/05/Thumbnail-1-500x400.jpg",
        foto_credit: "STUKK",
        korte_omschrijving: "Een razendsnelle spionageklucht waarin niets is wat het lijkt.",
        url: "https://deparade.nl/programma/stukk-op-spanning/"
      }
    ]
  }
];
