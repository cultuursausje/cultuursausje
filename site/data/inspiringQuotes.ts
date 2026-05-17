/**
 * Inspirerende citaten over theater — getoond als handgeschreven briefjes
 * tussen de secties op de pagina. Bron: Nederlandse Toneeljury.
 */
export interface InspiringQuoteEntry {
  quote: string;
  quote_en: string;
  author: string;
  /** "Nederlandse Toneeljury" → "Dutch Theatre Jury" als achtervoegsel in EN. */
  author_en?: string;
  /** Optionele rotatie voor visuele variatie tussen quotes. */
  tilt?: number;
  align?: "left" | "center" | "right";
}

export const inspiringQuotes: InspiringQuoteEntry[] = [
  {
    quote:
      "De voorstelling liet me iets over mezelf zien wat ik tot daarvoor nog niet gezien had. Ik liep naderhand als een opgeladen batterij terug naar huis. Ik ben net naar een voorstelling geweest, maar eigenlijk ben ik thuisgekomen in mezelf.",
    quote_en:
      "The performance showed me something about myself I hadn't seen before. Afterwards I walked home like a fully charged battery. I'd just been to a show, but really I'd come home to myself.",
    author: "Abdelkader Benali (Nederlandse Toneeljury)",
    author_en: "Abdelkader Benali (Dutch Theatre Jury)",
    tilt: -1.2,
    align: "left"
  },
  {
    quote:
      "Ik las altijd al veel maar dat is toch een best eenzame ervaring. Ik ontdekte dat theater het literaire kan combineren met een gezamenlijke ervaring. Ik dacht toen meteen: dit is voor mij.",
    quote_en:
      "I'd always read a lot, but it's a fairly lonely experience. I discovered that theatre can combine the literary with a shared experience. I thought right away: this is for me.",
    author: "Han van Wieringen (Nederlandse Toneeljury)",
    author_en: "Han van Wieringen (Dutch Theatre Jury)",
    tilt: 1,
    align: "right"
  },
  {
    quote:
      "Theater is de plek waar we tijd, ruimte en concentratie delen. Daar houden we niet mee op, het wordt eerder een nieuwe waarde. Het is de enige plek die nog over is waar we onze mobiele telefoon uitzetten. Je beleeft er samen iets, ook al ken je er niemand.",
    quote_en:
      "Theatre is the place where we share time, space and attention. We're not going to stop doing that — if anything, it's becoming a new kind of value. It's the only place left where we turn our phones off. You experience something together, even if you don't know anyone there.",
    author: "Anneke van der Linden (Nederlandse Toneeljury)",
    author_en: "Anneke van der Linden (Dutch Theatre Jury)",
    tilt: -0.8,
    align: "center"
  },
  {
    quote:
      "Theater biedt je een blik op de wereld door de ogen van de kunstenaar. Die doet een voorstel, daagt je uit om je daartoe te verhouden, en brengt je mentaal in beweging. De theatermaker scherpt je ideeën over mensen en samenlevingen, en hoe je daar zelf in past aan.",
    quote_en:
      "Theatre offers you a view of the world through the eyes of the artist. They put forward a proposition, challenge you to take a position, and set your mind in motion. The theatremaker sharpens your ideas about people and society, and how you fit into them.",
    author: "Hadassah de Boer (Nederlandse Toneeljury)",
    author_en: "Hadassah de Boer (Dutch Theatre Jury)",
    tilt: 1.4,
    align: "left"
  },
  {
    quote:
      "Theater is het verbeelden van andere denkwijzen, het is mind-stretchen. De spelers namen mij mee naar hun wereld, die ik nauwelijks ken.",
    quote_en:
      "Theatre is imagining other ways of thinking — it's mind-stretching. The performers took me into their world, one I barely know.",
    author: "Saskia Tilanus (Nederlandse Toneeljury)",
    author_en: "Saskia Tilanus (Dutch Theatre Jury)",
    tilt: -1.5,
    align: "right"
  },
  {
    quote:
      "Als je zoveel theater ziet, ga je vanzelf ook patronen zien. Dat zegt wat over de generatie kunstenaars. Ze maken ons duidelijk wat er schort aan onze samenleving en dat is heel confronterend.",
    quote_en:
      "When you see this much theatre, you start to see patterns. It says something about this generation of artists. They make clear what's wrong with our society, and that is deeply confronting.",
    author: "Hadassah de Boer (Nederlandse Toneeljury)",
    author_en: "Hadassah de Boer (Dutch Theatre Jury)",
    tilt: 0.7,
    align: "center"
  },
  {
    quote:
      "Voor mij is een theateravond geslaagd als je het gevoel hebt dat er een paradigmaverschuiving plaatsvindt: als je uit de vaste manier van denken wordt getrokken en wordt geconfronteerd met een manier waarop je nooit naar de wereld had gekeken.",
    quote_en:
      "For me a night at the theatre succeeds when you feel a paradigm shift happen — when you're pulled out of your usual way of thinking and confronted with a way of looking at the world you'd never considered.",
    author: "Bram Jacobs (Nederlandse Toneeljury)",
    author_en: "Bram Jacobs (Dutch Theatre Jury)",
    tilt: -1,
    align: "left"
  }
];
