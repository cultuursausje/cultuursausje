/**
 * Inspirerende citaten over theater — getoond als handgeschreven briefjes
 * tussen de secties op de pagina. Bron: Nederlandse Toneeljury.
 */
export interface InspiringQuoteEntry {
  quote: string;
  author: string;
  /** Optionele rotatie voor visuele variatie tussen quotes. */
  tilt?: number;
  align?: "left" | "center" | "right";
}

export const inspiringQuotes: InspiringQuoteEntry[] = [
  {
    quote:
      "De voorstelling liet me iets over mezelf zien wat ik tot daarvoor nog niet gezien had. Ik liep naderhand als een opgeladen batterij terug naar huis. Ik ben net naar een voorstelling geweest, maar eigenlijk ben ik thuisgekomen in mezelf.",
    author: "Abdelkader Benali (Nederlandse Toneeljury)",
    tilt: -1.2,
    align: "left"
  },
  {
    quote:
      "Ik las altijd al veel maar dat is toch een best eenzame ervaring. Ik ontdekte dat theater het literaire kan combineren met een gezamenlijke ervaring. Ik dacht toen meteen: dit is voor mij.",
    author: "Han van Wieringen (Nederlandse Toneeljury)",
    tilt: 1,
    align: "right"
  },
  {
    quote:
      "Theater is de plek waar we tijd, ruimte en concentratie delen. Daar houden we niet mee op, het wordt eerder een nieuwe waarde. Het is de enige plek die nog over is waar we onze mobiele telefoon uitzetten. Je beleeft er samen iets, ook al ken je er niemand.",
    author: "Anneke van der Linden (Nederlandse Toneeljury)",
    tilt: -0.8,
    align: "center"
  },
  {
    quote:
      "Theater biedt je een blik op de wereld door de ogen van de kunstenaar. Die doet een voorstel, daagt je uit om je daartoe te verhouden, en brengt je mentaal in beweging. De theatermaker scherpt je ideeën over mensen en samenlevingen, en hoe je daar zelf in past aan.",
    author: "Hadassah de Boer (Nederlandse Toneeljury)",
    tilt: 1.4,
    align: "left"
  },
  {
    quote:
      "Theater is het verbeelden van andere denkwijzen, het is mind-stretchen. De spelers namen mij mee naar hun wereld, die ik nauwelijks ken.",
    author: "Saskia Tilanus (Nederlandse Toneeljury)",
    tilt: -1.5,
    align: "right"
  },
  {
    quote:
      "Als je zoveel theater ziet, ga je vanzelf ook patronen zien. Dat zegt wat over de generatie kunstenaars. Ze maken ons duidelijk wat er schort aan onze samenleving en dat is heel confronterend.",
    author: "Hadassah de Boer (Nederlandse Toneeljury)",
    tilt: 0.7,
    align: "center"
  },
  {
    quote:
      "Voor mij is een theateravond geslaagd als je het gevoel hebt dat er een paradigmaverschuiving plaatsvindt: als je uit de vaste manier van denken wordt getrokken en wordt geconfronteerd met een manier waarop je nooit naar de wereld had gekeken.",
    author: "Bram Jacobs (Nederlandse Toneeljury)",
    tilt: -1,
    align: "left"
  }
];
