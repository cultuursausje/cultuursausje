import type { Gezelschap } from "@/types";

// Logo's zijn opgehaald van cultuursausje.nl/gezelschappen
// (Squarespace CDN — werkt zonder API-key)
const CDN = "https://images.squarespace-cdn.com/content/v1/664268bf61d9c829d28a522a";

export const gezelschappen: Gezelschap[] = [
  {
    id: "ita", naam: "Internationaal Theater Amsterdam", afkorting: "ITA",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Amsterdam", url: "https://ita.nl",
    beschrijving: "Amsterdams ensemble onder Eline Arbo, met spraakmakende producties en internationale topregisseurs.",
    logo_url: `${CDN}/e2ac0d68-9de1-4071-93b3-cf3f9c10ee43/ITA_logo_2023_zwart.png`,
    logo_credit: "ITA"
  },
  {
    id: "theater-rotterdam", naam: "Theater Rotterdam", afkorting: "TR",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Rotterdam", url: "https://www.theaterrotterdam.nl/",
    beschrijving: "Rotterdams gezelschap onder Alida Dors. Maakt grenzeloos theater en geeft jonge makers ruimte.",
    logo_url: `${CDN}/fdb5df23-ec57-48c7-bbfd-1a1e9bab91d4/theater_rotterdam.jpg`,
    logo_credit: "Theater Rotterdam"
  },
  {
    id: "theater-oostpool", naam: "Theater Oostpool", afkorting: "Oostpool",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Arnhem", url: "https://www.oostpool.nl/",
    beschrijving: "Arnhems gezelschap onder Daria Bukvić. Brengt actuele, vurige verhalen vanuit diverse achtergronden.",
    logo_url: `${CDN}/79330da9-1715-4528-a641-b07aaff3627b/1922052760-c2db2c294deb2e9163af50bf8c6f4b7e3c7c26e2fc5654bf5d1307b73b81da8d-d.png`,
    logo_credit: "Theater Oostpool"
  },
  {
    id: "nite", naam: "Nationaal Interdisciplinair Theater Ensemble", afkorting: "NITE",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Groningen", url: "https://nite.nl/",
    beschrijving: "Gronings interdisciplinair gezelschap onder Guy Weizman. Energiek totaaltheater, vaak meertalig.",
    logo_url: `${CDN}/36aecaf7-4072-4f2a-91eb-5b1845ee3b72/nite.png`,
    logo_credit: "NITE"
  },
  {
    id: "toneelgroep-maastricht", naam: "Toneelgroep Maastricht", afkorting: "TM",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Maastricht", url: "https://www.toneelgroepmaastricht.nl/",
    beschrijving: "Maastrichts gezelschap onder Michel Sluysmans. Verbindende, herkenbare verhalen vol empathie.",
    logo_url: `${CDN}/74e0e407-f531-4443-8e93-4260129115a3/LOGO+STANDAARD.jpg`,
    logo_credit: "Toneelgroep Maastricht"
  },
  {
    id: "het-zuidelijk-toneel", naam: "Het Zuidelijk Toneel", afkorting: "HZT",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Tilburg", url: "https://www.hzt.nl/",
    beschrijving: "Tilburgs gezelschap onder Sarah Moeremans. Prikkelende, eigenzinnige theatrale ontmoetingen.",
    logo_url: `${CDN}/9ffe1cc0-8f24-4302-9c44-044da55fe060/Het-Zuidelijk-Toneel-logo.png`,
    logo_credit: "Het Zuidelijk Toneel"
  },
  {
    id: "het-nationale-theater", naam: "Het Nationale Theater", afkorting: "HNT",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Den Haag", url: "https://www.hnt.nl/",
    beschrijving: "Haags gezelschap onder Eric de Vroedt. Stelt voor hoe het niet moet en wel kan.",
    logo_url: `${CDN}/dcb0158c-85dd-4f50-99a5-e2d31e6b67e0/HNT_logo_black.png`,
    logo_credit: "Het Nationale Theater"
  },
  {
    id: "theater-utrecht", naam: "Theater Utrecht", afkorting: "Theater Utrecht",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Utrecht", url: "https://www.theaterutrecht.nl/",
    beschrijving: "Utrechts gezelschap onder Anne Breure. Spraakmakend en vernieuwend voor breed publiek.",
    logo_url: `${CDN}/d01b9549-0630-481b-bb16-05a1525eb6eb/logo-with-tag.png`,
    logo_credit: "Theater Utrecht"
  },
  {
    id: "tryater", naam: "Tryater", afkorting: "Tryater",
    type: "Rijksgesubsidieerd theatergezelschap", stad: "Leeuwarden", url: "https://tryater.com/",
    beschrijving: "Leeuwardens gezelschap onder Tatiana Pratley. Meertalig theater, dicht op de huid van het publiek.",
    logo_url: `${CDN}/fc7341dc-d839-42c9-8779-2da355af6548/tryater.jpg`,
    logo_credit: "Tryater"
  },
  {
    id: "wunderbaum", naam: "Wunderbaum", afkorting: "Wunderbaum",
    type: "Theatercollectief", stad: "Rotterdam", url: "https://wunderbaum.nl/",
    beschrijving: "Rotterdams collectief sinds 2001. Stukken over tijdloze actuele thema's, met internationale samenwerking.",
    logo_url: `${CDN}/a994be36-ba35-4058-8bdc-b12398fd2bc8/wunderbaum.png`,
    logo_credit: "Wunderbaum"
  },
  {
    id: "dood-paard", naam: "Dood Paard", afkorting: "Dood Paard",
    type: "Theatercollectief", stad: "Amsterdam", url: "https://doodpaard.nl/",
    beschrijving: "Amsterdams collectief sinds 1993. Eigenzinnig en open theater op basis van klassieke en moderne teksten.",
    logo_url: `${CDN}/06ce2452-5926-4cb9-8137-1102cbdd6e3c/DoodPaard_social.png`,
    logo_credit: "Dood Paard"
  },
  {
    id: "de-warme-winkel", naam: "De Warme Winkel", afkorting: "DWW",
    type: "Theatercollectief", stad: "Amsterdam", url: "https://dewarmewinkel.nl/",
    beschrijving: "Amsterdams collectief sinds 2003. Geestig, brutaal en intelligent theater dat zichzelf graag bevraagt.",
    logo_url: `${CDN}/9f874175-0a85-4a72-97ca-30fe37f28dd6/dewarmewinkel.png`,
    logo_credit: "De Warme Winkel"
  },
  {
    id: "orkater", naam: "Orkater", afkorting: "Orkater",
    type: "Theatercollectief (muziektheater)", stad: "Amsterdam", url: "https://orkater.nl/",
    beschrijving: "Amsterdams muziektheatercollectief sinds 1971. ORKest + theATER van eigenzinnige makers.",
    logo_url: `${CDN}/0d151c2f-0972-4e8b-a32e-04b8cd7ca788/orkater.png`,
    logo_credit: "Orkater"
  },
  {
    id: "bureau-vergezicht", naam: "Bureau Vergezicht", afkorting: "Bureau Vergezicht",
    type: "Theatercollectief", stad: "Amsterdam", url: "https://www.bureauvergezicht.nl",
    beschrijving: "Amsterdams collectief sinds 2024. Theater over de klimaatcrisis, voor publiek én politiek.",
    logo_url: `${CDN}/394cd125-3251-41fc-bd7f-1da51ae0cd7d/Screenshot+2025-05-11+at+08.47.50.png`,
    logo_credit: "Bureau Vergezicht"
  },
  {
    id: "toneelschuur-producties", naam: "Toneelschuur Producties", afkorting: "TSP",
    type: "Productiehuis", stad: "Haarlem", url: "https://www.toneelschuurproducties.nl/",
    beschrijving: "Haarlems productiehuis sinds 1969. Biedt jonge theatermakers ruimte om nieuwe producties te maken.",
    logo_url: `${CDN}/627802c3-dcb5-4d4f-8310-63fb77fe7c08/icoon_STP_logo_zwart.png`,
    logo_credit: "Toneelschuur Producties"
  },
  {
    id: "rightaboutnow-inc", naam: "RIGHTABOUTNOW INC.", afkorting: "RAN INC.",
    type: "Productiehuis (interdisciplinair hiphop/urban)", stad: "Amsterdam", url: "https://rightaboutnowinc.com/",
    beschrijving: "Amsterdams productiehuis sinds 1971. Interdisciplinair hiphop- en urban-theater met sociaal-maatschappelijke projecten.",
    logo_url: `${CDN}/c8e627a4-fd7b-4457-b900-4e63972a1230/RAN+inc.png`,
    logo_credit: "RIGHTABOUTNOW INC."
  }
];
