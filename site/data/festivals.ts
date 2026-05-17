import type { Festival } from "@/types";

export const festivals: Festival[] = [
  {
    id: "bosfest",
    naam: "Bosfest",
    periode: "Augustus",
    plaats: "Amsterdam",
    beschrijving: "Theaterfestival midden in het Amsterdamse Bos. Twee weken lang kleinschalig theater verstopt tussen wortels en bladeren, met het bos niet als decor maar als hoofdrolspeler. Rauw, intiem, muzikaal en fysiek werk van opkomende makers.",
    beschrijving_en: "Theatre festival in the heart of the Amsterdamse Bos. Two weeks of small-scale theatre hidden among roots and leaves, with the forest not as backdrop but as leading character. Raw, intimate, musical and physical work by emerging makers.",
    url: "https://bostheater.nl/bosfest/",
    accent: "#3A7D44",
    match_keywords: ["bosfest", "bostheater"],
    foto_urls: [
      "https://bostheater.nl/wp-content/uploads/2026/04/Bosfest_2026-Socials-2-2-scaled.jpg",
      "https://bostheater.nl/wp-content/uploads/2025/09/resized_Bosfest-2025-LowRes-Guus-van-der-Aa-68.jpg",
      "https://bostheater.nl/wp-content/uploads/2025/08/Fluermulder_07__DSC7816-1-scaled.jpg",
      "https://bostheater.nl/wp-content/uploads/2025/08/Bosfest-PicsByGustav-19.jpg"
    ],
    foto_credit: "Guus van der Aa, Fluermulder, PicsByGustav, Bostheater"
  },
  {
    id: "holland-festival",
    naam: "Holland Festival",
    periode: "Juni",
    plaats: "Amsterdam",
    beschrijving: "Het oudste en grootste internationale podiumkunstenfestival van Nederland. Toont jaarlijks gerenommeerde internationale gezelschappen en grensverleggend werk.",
    beschrijving_en: "The oldest and largest international performing arts festival in the Netherlands. Each year showcases renowned international companies and boundary-pushing work.",
    url: "https://www.hollandfestival.nl",
    accent: "#FF3D8B",
    match_keywords: ["holland festival"],
    foto_urls: [
      "https://www.hollandfestival.nl/media/cache/text_image_2xl/media/2025/berenice/16062025_berenice__copy__elodie_vreeburg__2__1394x930.jpg?b803f8d0"
    ],
    foto_credit: "Elodie Vreeburg"
  },
  {
    id: "julidans",
    naam: "Julidans",
    periode: "Juli",
    plaats: "Amsterdam",
    beschrijving: "Het grootste festival voor hedendaagse internationale dans in Nederland. Twee weken lang vernieuwende choreografieën.",
    beschrijving_en: "The largest festival for contemporary international dance in the Netherlands. Two weeks of innovative choreography.",
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
        korte_omschrijving_en: "F*cking Future sends order and discipline reeling.",
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
        korte_omschrijving_en: "An energetic, idiosyncratic rollercoaster of image and movement. About progress, exhaustion and the faltering promise of a future.",
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
        korte_omschrijving_en: "Two radical dance worlds collide on a sizzling playing field where difference isn't a boundary but the engine of new movement.",
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
        korte_omschrijving_en: "In this hypnotic choreography, bodies, rhythm and space respond to one another non-stop, slowly pulling you into the cadence.",
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
        korte_omschrijving_en: "A danced manifesto for peace, co-created with Indigenous artists from North America.",
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
        korte_omschrijving_en: "The blues as a physical archive of resistance. Coulibaly honours his roots and shows that folklore is very much alive and open to reinvention.",
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
        korte_omschrijving_en: "A body in the eye of the storm.",
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
        korte_omschrijving_en: "Gripping dance theatre about resistance, conscience and the price an individual pays when standing up to power. In the spirit of Pina Bausch.",
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
        korte_omschrijving_en: "Two iconic bodies, two seemingly irreconcilable traditions. Flamenco and performance collide in a playful duel of rhythm, silence and physical tension.",
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
        korte_omschrijving_en: "An invitation to feel grief and beauty at once, and the strength to keep moving in the midst of loss.",
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
        korte_omschrijving_en: "Three performers weave sign language and dance into a single fluid movement vocabulary.",
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
        korte_omschrijving_en: "What if folklore isn't preserved but alive? A deep dive through myth, memory and fiery South American rhythms.",
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
    beschrijving_en: "Ten days of site-specific theatre, music and visual art on Terschelling. The entire Wadden island becomes the stage.",
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
        korte_omschrijving_en: "With visual, physical comedy, Bambie reveals the absurd complexity of contemporary nature management.",
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
        korte_omschrijving_en: "Enchanting music theatre that sprinkles love potion in your eyes and shakes you awake. About dreams, dissent and daring to do (nothing).",
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
        korte_omschrijving_en: "Katrien van Beurden performs this one-woman show: a true story you don't have to believe. About surviving and survivors, with music by Remy van Kesteren.",
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
        korte_omschrijving_en: "Hundred-year-old Magda celebrates her final hour alongside the music of climate activist and composer Ryuichi Sakamoto. What must not go to the grave with her?",
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
        korte_omschrijving_en: "An educational, musical show offering a fresh take on sex education for young and old. Here, warnings finally make way for pleasure.",
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
        korte_omschrijving_en: "Being yourself, losing yourself, finding yourself again. A group of dancers takes you on a shared journey to rise above the everyday.",
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
        korte_omschrijving_en: "In a clearing in the pine forest, five figures dance into being a world where past and future collide.",
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
        korte_omschrijving_en: "A danced manifesto for peace, co-created with Indigenous artists from North America.",
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
        korte_omschrijving_en: "Virtuoso harp, electronics and light art set in the dark landscape. A total experience on the island.",
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
        korte_omschrijving_en: "Four acrobats conjure the wildest dreams of the future on a seven-metre climbing frame. An invitation to look ahead and dare to imagine together.",
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
        korte_omschrijving_en: "A breathtaking aerial dance and ode to equality and empowerment that is winning hearts worldwide.",
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
        korte_omschrijving_en: "Exclusively for Oerol, performer Tom Lanoye presents 'his' Reynard as a serial: five hour-long episodes.",
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
    beschrijving_en: "The best Dutch and Flemish theatre productions of the past season, brought together in one celebratory festival.",
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
        korte_omschrijving_en: "Accessible and sparkling philosophical theatre around Arthur Schopenhauer: why life is suffering, and how to free yourself from it.",
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
    beschrijving_en: "Eleven days of innovative, idiosyncratic and international theatre by 70+ emerging makers in Amsterdam.",
    url: "https://www.amsterdamfringefestival.nl",
    accent: "#FF6B35",
    match_keywords: ["amsterdam fringe", "fringe"],
    foto_urls: [
      "https://amsterdamfringefestival.nl/wp-content/uploads/2025/10/DaddysLittleProblem_FotoAnneliesVerhelst-6-scaled.jpg"
    ],
    foto_credit: "Annelies Verhelst"
  },
  {
    id: "festival-boulevard",
    naam: "Festival Boulevard",
    periode: "Augustus",
    plaats: "'s-Hertogenbosch",
    beschrijving: "Tiendaags festival in Den Bosch met internationaal en Nederlands vernieuwend theater, dans en muziek.",
    beschrijving_en: "Ten-day festival in Den Bosch featuring innovative international and Dutch theatre, dance and music.",
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
    plaats: "Alkmaar",
    beschrijving: "Locatie- en straat-theater verspreid over Noord-Holland. Theater op bijzondere plekken, ver weg van de zaal.",
    beschrijving_en: "Site-specific and street theatre spread across North Holland. Theatre in unusual places, far from the auditorium.",
    url: "https://www.karavaan.nl",
    accent: "#00B4FF",
    match_keywords: ["karavaan"],
    foto_urls: [
      "https://www.karavaan.nl/wp-content/uploads/2026/01/KF26_Affichebeeld_HART_liggend_2_RGB-1060x596.jpg"
    ],
    foto_credit: "Karavaan Festival"
  },
  {
    id: "o-festival",
    naam: "O. Festival",
    periode: "Mei – Juni",
    plaats: "Rotterdam",
    beschrijving: "Internationaal festival voor opera, muziektheater en performance in Rotterdam. Grensverleggend werk op bijzondere plekken in de stad, van werven tot werkplaatsen.",
    beschrijving_en: "International festival for opera, music theatre and performance in Rotterdam. Boundary-pushing work in unusual places across the city, from shipyards to workshops.",
    url: "https://o-festival.nl/",
    accent: "#5BB8C2",
    match_keywords: ["o. festival", "o festival", "operadagen", "operadagen rotterdam"],
    foto_urls: [
      "https://o-festival.nl/wp-content/uploads/2025/06/Ofestival_27052025_RosaQuistPhotography_0038-scaled.jpg",
      "https://o-festival.nl/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-12-at-11.27.32-e1765816945300-900x553.jpeg"
    ],
    foto_credit: "Rosa Quist Photography, O. Festival",
    voorstellingen: [
      {
        id: "o-festival-remachine",
        titel: "REMACHINE",
        gezelschap: "Jefta van Dinther",
        type: "dans",
        english_friendly: true,
        korte_omschrijving: "Dansers navigeren over onstabiele grond in een hypergemachiniseerde omgeving. Een meditatie over arbeid en ritueel, met krachtige zanglijnen van componiste Anna von Hausswolff.",
        korte_omschrijving_en: "Dancers navigate unstable ground in a hyper-mechanised environment. A meditation on labour and ritual, with powerful vocal lines by composer Anna von Hausswolff.",
        url: "https://o-festival.nl/voorstelling/remachine/"
      },
      {
        id: "o-festival-mystica",
        titel: "Mystica",
        gezelschap: "MOVEDBYMATTER & Muziektheater Transparant",
        type: "muziek",
        english_friendly: true,
        korte_omschrijving: "Betoverend ritueel waarin zwevende haarhangers en koorzangers samen zoeken naar verbinding. Circus en muziektheater ontmoeten elkaar op teksten van middeleeuwse mystica.",
        korte_omschrijving_en: "An enchanting ritual where suspended hair-hangers and choir singers search together for connection. Circus and music theatre meet on texts by medieval mystics.",
        url: "https://o-festival.nl/voorstelling/mystica/"
      },
      {
        id: "o-festival-sexodus",
        titel: "SEXODUS",
        gezelschap: "Naomi Velissariou / Theater Utrecht",
        type: "toneel",
        korte_omschrijving: "Een actrice op de drempel van haar veertigste vecht tegen de dwingende schoonheidsidealen. Een rauwe wraakfantasie tegen een systeem dat floreert bij vrouwelijke onzekerheid.",
        korte_omschrijving_en: "An actress on the brink of forty fights back against oppressive beauty ideals. A raw revenge fantasy aimed at a system that thrives on female insecurity.",
        url: "https://o-festival.nl/voorstelling/sexodus-theater-utrecht-naomi-v/"
      },
      {
        id: "o-festival-tradwives",
        titel: "TRADWIVES de musical",
        gezelschap: "Club Satelliet",
        type: "muziek",
        korte_omschrijving: "Een niet-zo-traditionele comedy musical over traditionele vrouwen. Scherpe satire en pompende muziek sleuren je uit je bubbel.",
        korte_omschrijving_en: "A not-so-traditional comedy musical about traditional women. Sharp satire and pumping music drag you out of your bubble.",
        url: "https://o-festival.nl/voorstelling/tradwives-de-musical/"
      },
      {
        id: "o-festival-50cent-beckett",
        titel: "50cent & Beckett",
        gezelschap: "Productiehuis FLOW / Y.M.P. & Titus Muizelaar",
        type: "toneel",
        korte_omschrijving: "Een storytellers-duo bouwt op teksten van 50 Cent en Samuel Beckett een associatief jazz-stuk. Ode aan een turbulente vriendschap die alle conventies overstijgt.",
        korte_omschrijving_en: "A storytelling duo builds an associative jazz piece on texts by 50 Cent and Samuel Beckett. An ode to a turbulent friendship that transcends every convention.",
        url: "https://o-festival.nl/voorstelling/50cent-beckett/"
      },
      {
        id: "o-festival-big-fat-trojan-wedding",
        titel: "Big Fat Trojan Wedding",
        gezelschap: "Collectief Aqueerius",
        type: "muziek",
        korte_omschrijving: "Spektakelmusical in een partytent. Griekse mythologie met een hedendaagse queer twist, meer drama dan de Trojaanse Oorlog maar dan met betere outfits.",
        korte_omschrijving_en: "A spectacle musical in a party tent. Greek mythology with a contemporary queer twist, more drama than the Trojan War but with better outfits.",
        url: "https://o-festival.nl/voorstelling/big-fat-trojan-wedding/"
      },
      {
        id: "o-festival-pretty-privilege",
        titel: "Pretty Privilege",
        gezelschap: "Collectief Teder",
        type: "muziek",
        korte_omschrijving: "Feministische muziektheatervoorstelling over schoonheidsdruk en sociale positie. Met meerstemmige zang, saxofoon en elektronische beats.",
        korte_omschrijving_en: "A feminist music theatre piece about beauty pressure and social standing. With polyphonic vocals, saxophone and electronic beats.",
        url: "https://o-festival.nl/voorstelling/pretty-privilege/"
      },
      {
        id: "o-festival-metropolis-2126",
        titel: "Metropolis 2126",
        gezelschap: "O. Festival / Rajiv Bhagwanbali",
        type: "anders",
        korte_omschrijving: "Futuristische wandeling door de wereld over 100 jaar. Drie dagen lang verschillende toekomstscenario's op vijf locaties in het Rotterdam Central District.",
        korte_omschrijving_en: "A futuristic walk through the world a hundred years from now. Three days of different future scenarios at five locations across the Rotterdam Central District.",
        url: "https://o-festival.nl/voorstelling/metropolis-2126/"
      },
      {
        id: "o-festival-noise",
        titel: "NOISE",
        gezelschap: "Club Gewalt / Neuköllner Oper Berlin",
        type: "muziek",
        english_friendly: true,
        korte_omschrijving: "Lecture opera die begint als zelfhulp en eindigt in een cathartische onderdompeling in noise. Hoe stem je je zintuigen af onder de constante ruis van onheilstijdingen?",
        korte_omschrijving_en: "A lecture opera that starts as self-help and ends in a cathartic immersion in noise. How do you attune your senses under the constant hum of bad news?",
        url: "https://o-festival.nl/voorstelling/noise/"
      },
      {
        id: "o-festival-an-elegy",
        titel: "An Elegy",
        gezelschap: "Studio Vacuüm / NKK NXT",
        type: "muziek",
        korte_omschrijving: "Muzikale performance in het Kralingse Bos. Stem, adem en percussie versmelten met wind, zand en gras tot een levend muzikaal schilderij.",
        korte_omschrijving_en: "A musical performance in the Kralingse Bos. Voice, breath and percussion merge with wind, sand and grass into a living musical painting.",
        url: "https://o-festival.nl/voorstelling/an-elegy-studio-vacuum/"
      },
      {
        id: "o-festival-modraniht",
        titel: "MODRANIHT. Songs of Winter War",
        gezelschap: "Opera Aperta (Kyiv)",
        type: "muziek",
        english_friendly: true,
        korte_omschrijving: "Theatraal ritueel tegen duistere krachten. Hoe maak je opera in tijden van oorlog? Een nieuwe opera in de vorm van rizomatisch theater.",
        korte_omschrijving_en: "A theatrical ritual against dark forces. How do you make opera in times of war? A new opera in the form of rhizomatic theatre.",
        url: "https://o-festival.nl/voorstelling/modraniht-songs-of-winter-war/"
      },
      {
        id: "o-festival-aisa-demeter",
        titel: "Aisa Demeter",
        gezelschap: "Orkater / Anne-Fay Kops",
        type: "muziek",
        korte_omschrijving: "Moderne muzikale mythe over de kracht van woede, met intense zang, Caribische samples en diepe baslijnen.",
        korte_omschrijving_en: "A modern musical myth about the power of rage, with intense vocals, Caribbean samples and deep basslines.",
        url: "https://o-festival.nl/voorstelling/aisa-demeter/"
      }
    ]
  },
  {
    id: "spring-utrecht",
    naam: "SPRING Performing Arts Festival",
    periode: "Mei",
    plaats: "Utrecht",
    beschrijving: "Internationaal festival voor hedendaagse podiumkunsten in Utrecht. Tien dagen vernieuwend werk uit binnen- en buitenland, op grote en kleine podia én op locatie.",
    beschrijving_en: "International festival for contemporary performing arts in Utrecht. Ten days of innovative work from home and abroad, on large and small stages as well as on location.",
    url: "https://springutrecht.nl",
    accent: "#9B7EBD",
    match_keywords: ["spring", "spring utrecht", "spring performing arts"],
    foto_urls: [
      "https://springutrecht.nl/app/uploads/2025/05/wasted-land-opening-spring-23-mei-Allard-Willemse-1-1920x1080.jpg",
      "https://springutrecht.nl/app/uploads/2025/06/20250531-SPRING-Festival-005-┬⌐-Alex-Heuvink-1920x1080.jpg",
      "https://springutrecht.nl/app/uploads/2025/06/spring-2025-ekko-viktor-szeri-fatigue-22-1920x1080.jpg"
    ],
    foto_credit: "Allard Willemse, Alex Heuvink, SPRING Festival",
    voorstellingen: [
      {
        id: "spring-utrecht-klei",
        titel: "Klei",
        gezelschap: "Schweigman& i.c.w. Zoro Feigl & HIIIT",
        type: "dans",
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/signal-2025-10-21-114118-1080x1080.jpeg",
        foto_credit: "Schweigman&",
        korte_omschrijving: "In een onvoorspelbaar landschap van tien ton klei zoeken performers en slagwerkers naar de oeroude connectie tussen mens en aarde. Een uitnodiging om terug te gaan naar de essentie.",
        korte_omschrijving_en: "In an unpredictable landscape of ten tonnes of clay, performers and percussionists search for the primal connection between humans and the earth. An invitation to return to the essence.",
        url: "https://springutrecht.nl/programma/klei/"
      },
      {
        id: "spring-utrecht-lilith-aeon",
        titel: "LILITH.AEON",
        gezelschap: "AΦE",
        type: "dans",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/2-1080x1080.png",
        foto_credit: "AΦE",
        korte_omschrijving: "Een meeslepende ervaring die dans en AI mengt. Het publiek beweegt zich rond een enorme LED-kubus, waarbij hun bewegingen vorm geven aan de performance van een virtueel wezen.",
        korte_omschrijving_en: "An immersive experience that blends dance and AI. The audience moves around a huge LED cube, their movements shaping the performance of a virtual being.",
        url: "https://springutrecht.nl/programma/lilith-aeon/"
      },
      {
        id: "spring-utrecht-giselle-a-summary",
        titel: "Giselle: A Summary",
        gezelschap: "Hana Sakai x Toshiki Okada",
        type: "dans",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/Giselle1128_3120-©HATORI-Naoshi-1-1080x1080.jpg",
        foto_credit: "Hatori Naoshi",
        korte_omschrijving: "Voormalig eerste soliste van het Nationaal Ballet van Japan danst de romantische klassieker terwijl zij het persona van een YouTuber aanneemt. Ballet vermengt zich met humor en speels commentaar.",
        korte_omschrijving_en: "A former principal soloist of the National Ballet of Japan dances the romantic classic while slipping into the persona of a YouTuber. Ballet meets humour and playful commentary.",
        url: "https://springutrecht.nl/programma/giselle-a-summary/"
      },
      {
        id: "spring-utrecht-islandbar",
        titel: "IsLand Bar",
        gezelschap: "orangcosong & guests",
        type: "anders",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/03/Website-omslag-met-ASEF-1080x1080.png",
        foto_credit: "orangcosong",
        korte_omschrijving: "Een storytelling performance in Utrechtse cafés. Aan de bar serveren migranten je een persoonlijke cocktail, gemixt met hun eigen geschiedenis en identiteit.",
        korte_omschrijving_en: "A storytelling performance in Utrecht cafés. At the bar, migrants serve you a personal cocktail mixed with their own history and identity.",
        url: "https://springutrecht.nl/programma/islandbar/"
      },
      {
        id: "spring-utrecht-shrine",
        titel: "SHRINE",
        gezelschap: "Khadija El Kharraz Alami",
        type: "toneel",
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/Dit-beeld-willen-ze-als-campagnebeeld-gebruiken-1080x1080.jpg",
        foto_credit: "Khadija El Kharraz Alami",
        korte_omschrijving: "Een meeslepende voorstelling over rouw, woede en radicaal verzet. De moegestreden dochter zoekt toevlucht bij de Jinns, niet-menselijke wezens in een parallelle wereld.",
        korte_omschrijving_en: "An immersive piece about grief, rage and radical resistance. The battle-weary daughter takes refuge with the Jinn, non-human beings in a parallel world.",
        url: "https://springutrecht.nl/programma/shrine/"
      },
      {
        id: "spring-utrecht-everything-must-go",
        titel: "Everything Must Go",
        gezelschap: "Forced Entertainment",
        type: "toneel",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/Everything-Must-Go-v2-Forced-Entertainment-1080x1080.jpg",
        foto_credit: "Forced Entertainment",
        korte_omschrijving: "Laat op de avond proberen zes mensen zich vast te houden aan hun menselijkheid, maar de stemmen die je hoort zijn niet die van henzelf. Met lipsynchronisatie en AI.",
        korte_omschrijving_en: "Late at night, six people try to hold on to their humanity, but the voices you hear aren't their own. Featuring lip-sync and AI.",
        url: "https://springutrecht.nl/programma/everything-must-go/"
      },
      {
        id: "spring-utrecht-do-not-go-gentle",
        titel: "Do not go gentle into that good night",
        gezelschap: "Dries Verhoeven",
        type: "anders",
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/DSC8285_1536x1004-1080x1080.jpg",
        foto_credit: "Dries Verhoeven",
        korte_omschrijving: "Terwijl de wereld in elkaar stort, herleeft het activisme. Met deze interventie onderzoekt Dries Verhoeven de esthetiek van verzet. Kan een artistieke uiting verandering brengen?",
        korte_omschrijving_en: "As the world falls apart, activism is reawakening. With this intervention, Dries Verhoeven explores the aesthetics of resistance. Can an artistic gesture bring change?",
        url: "https://springutrecht.nl/programma/do-not-go-gentle-into-that-good-night/"
      },
      {
        id: "spring-utrecht-sweat-anthem",
        titel: "SWEAT (anthem)",
        gezelschap: "Milla Koistinen & DANCE ON Ensemble",
        type: "dans",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/3J0A5366-Edit-3-1080x1080.jpg",
        foto_credit: "DANCE ON Ensemble",
        korte_omschrijving: "Onderzoek naar veerkracht en uithoudingsvermogen, waarbij vastberadenheid een stille vorm van protest wordt. Een lofzang op verzet en vreugde.",
        korte_omschrijving_en: "An exploration of resilience and stamina, where determination becomes a quiet form of protest. A hymn to resistance and joy.",
        url: "https://springutrecht.nl/programma/sweat-anthem/"
      },
      {
        id: "spring-utrecht-sweet-spot",
        titel: "Sweet Spot",
        gezelschap: "Harald Beharie",
        type: "dans",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/Harald-Baharie-Presentatie-1080x1080.png",
        foto_credit: "Harald Beharie",
        korte_omschrijving: "Zes performers trekken je mee in een rusteloze wervelwind van dans en geluid. Geïnspireerd door Noorse volksmythen, met de indringende klanken van de Hardanger-viool.",
        korte_omschrijving_en: "Six performers pull you into a restless whirlwind of dance and sound. Inspired by Norwegian folk myths, with the haunting tones of the Hardanger fiddle.",
        url: "https://springutrecht.nl/programma/sweet-spot/"
      },
      {
        id: "spring-utrecht-radio-vinci-park",
        titel: "Radio Vinci Park",
        gezelschap: "Théo Mercier & François Chaignaud",
        type: "dans",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/Radio-Vinci-Park-©Erwan-Fichou-4-1-1080x1080.jpg",
        foto_credit: "Erwan Fichou",
        korte_omschrijving: "In een verborgen industriële ruimte ontvouwt zich een koortsachtig ritueel tussen mens en machine. Choreograaf François Chaignaud, een motorstuntman en een klavecinist versmelten.",
        korte_omschrijving_en: "Inside a hidden industrial space, a feverish ritual unfolds between human and machine. Choreographer François Chaignaud, a motorcycle stuntman and a harpsichordist merge into one.",
        url: "https://springutrecht.nl/programma/radio-vinci-park/"
      },
      {
        id: "spring-utrecht-asses-masses",
        titel: "asses.masses",
        gezelschap: "Patrick Blenkarn + Milton Lim",
        type: "anders",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/02/3D_asses.masses_AstralPlane_Photo_PatrickBlenkarnMiltonLim-1080x1080.png",
        foto_credit: "Patrick Blenkarn & Milton Lim",
        korte_omschrijving: "Een 7+ uur durende videogame, live in het theater, waar toeschouwers om de beurt een kudde werkloze ezels door een post-industriële wereld leiden.",
        korte_omschrijving_en: "A 7+ hour video game, live on stage, in which audience members take turns guiding a herd of unemployed donkeys through a post-industrial world.",
        url: "https://springutrecht.nl/programma/asses-masses/"
      },
      {
        id: "spring-utrecht-ridden",
        titel: "RIDDEN",
        gezelschap: "Leu Wijee & Mio Ishida",
        type: "dans",
        english_friendly: true,
        foto_url: "https://springutrecht.nl/app/uploads/2026/03/No.1_-©-Basir-Yang-Miller_Tainan-Arts-Festival-2025-1080x1080.jpg",
        foto_credit: "Basir Yang Miller",
        korte_omschrijving: "Een zintuiglijke voorstelling die schommelt tussen ritueel, sport en een bandoptreden. Onderzoek naar de relatie tussen mens en omgeving na een ramp.",
        korte_omschrijving_en: "A sensory performance that swings between ritual, sport and a band gig. An exploration of the relationship between people and their environment in the aftermath of disaster.",
        url: "https://springutrecht.nl/programma/ridden/"
      }
    ]
  },
  {
    id: "de-parade",
    naam: "De Parade",
    periode: "Juni – Augustus",
    plaats: "Rotterdam, Den Haag, Amsterdam, Utrecht",
    beschrijving: "Het enige rondreizende theaterfestival ter wereld. 80+ korte voorstellingen in theatertenten,theater, dans, mime en muziek, ieder zo'n 30 minuten zodat je er meerdere op een avond kan combineren. 's Zomers achtereenvolgens in Rotterdam, Den Haag, Amsterdam en Utrecht.",
    beschrijving_en: "The only travelling theatre festival in the world. 80+ short performances in circus tents,theatre, dance, mime and music, each about 30 minutes long so you can combine several in one evening. In summer it travels in succession through Rotterdam, The Hague, Amsterdam and Utrecht.",
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
        korte_omschrijving_en: "Stunning total theatre from the Ashton Brothers, this year celebrating 25 years at the Parade.",
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
        korte_omschrijving_en: "A festive audience favourite about dreams, the art of seduction and the joy of work.",
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
        korte_omschrijving_en: "Physical, absurdist theatre with a touch of illusionism.",
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
        korte_omschrijving_en: "A sing-along show, with a touch of Ancient Greek thrown in.",
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
        korte_omschrijving_en: "About one-on-ones, burnouts and company drinks.",
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
        korte_omschrijving_en: "Stand-up Philosophy, heart-wrenching and hilarious.",
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
        korte_omschrijving_en: "An energetic spectacle that bridges the virtuosic and the human.",
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
        korte_omschrijving_en: "A returning Parade hit for years: 'Chaplin meets Chopin'. Internationally acclaimed, and guaranteed to raise the roof.",
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
        korte_omschrijving_en: "Cinematic, musical theatre.",
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
        korte_omschrijving_en: "Poetic and polyphonic: word, sound and image melt into one.",
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
        korte_omschrijving_en: "A modern musical myth about the power of rage, with intense vocals, Caribbean samples and deep basslines.",
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
        korte_omschrijving_en: "A breakneck spy farce in which nothing is what it seems.",
        url: "https://deparade.nl/programma/stukk-op-spanning/"
      }
    ]
  }
];
