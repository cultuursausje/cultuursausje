export interface Show {
  id: string;
  titel: string;
  gezelschap_id: string;
  gezelschap: string;
  theater_id: string;
  theater: string;
  extra_theaters: string[];
  speelperiode_start: string; // ISO YYYY-MM-DD
  speelperiode_end: string;   // ISO YYYY-MM-DD
  korte_samenvatting: string;
  lange_samenvatting: string;
  regisseur: string;
  based_on: string;
  foto_url: string;
  english_friendly: boolean;
  english_friendly_detail: string;
  categorieen: string[];
  ticket_url: string;
  interesting_because?: string;
  foto_credit?: string;
  /** Extra foto's voor de carousel op de uitvergrote card. */
  foto_urls?: string[];
  /** Specifieke speeldata in Amsterdam (ISO YYYY-MM-DD). Indien gevuld
   *  worden alleen deze datums getoond in de tickets-sectie. */
  speeldata?: string[];
}

export interface Theater {
  id: string;
  naam: string;
  afkorting: string;
  url: string;
  beschrijving?: string;
  stad: string;
}

export interface Gezelschap {
  id: string;
  naam: string;
  afkorting: string;
  type: string;
  stad: string;
  url: string;
  beschrijving?: string;
}

export interface PersQuote {
  show_id: string;
  bron: string;
  sterren: number | null;
  quote: string;
}

export interface MediaLink {
  show_id: string;
  type: string;
  titel: string;
  url: string;
}

export interface SiteData {
  shows: Show[];
  theaters: Theater[];
  gezelschappen: Gezelschap[];
  pers: PersQuote[];
  media: MediaLink[];
}

export interface Festival {
  id: string;
  naam: string;
  periode: string;
  plaats: string;
  beschrijving: string;
  url: string;
  accent: string; // hex kleur voor de teaser-card
  /** Categoriewoorden die in show.categorieen kunnen voorkomen om koppeling te bepalen */
  match_keywords: string[];
}

export interface ShowDisplay extends Show {
  pers_quotes: PersQuote[];
  media_links: MediaLink[];
  theater_display: string;
  theater_naam: string;
  theater_beschrijving: string;
  theater_url: string;
  theater_stad: string;
  gezelschap_display: string;
  gezelschap_beschrijving: string;
  gezelschap_url: string;
}
