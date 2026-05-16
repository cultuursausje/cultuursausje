export interface TourStop {
  /** Theater-id van de extra speel-locatie. */
  theater_id: string;
  /** Speeldata bij deze speel-locatie (ISO YYYY-MM-DD). Optioneel:
   *  als afwezig wordt "datums via ticketlink" getoond. */
  speeldata?: string[];
}

export interface Show {
  id: string;
  titel: string;
  gezelschap_id: string;
  gezelschap: string;
  /** Primaire speel-locatie (waar de show "thuishoort" voor v1-doeleinden). */
  theater_id: string;
  theater: string;
  /** Legacy lijst van extra theater-ids zonder datums. Nieuwe shows
   *  gebruiken in plaats hiervan `tour` met datums per stop. */
  extra_theaters: string[];
  /** Speelperiode-range over alle stops (vroegste start, laatste einde). */
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
  /** Speeldata bij de primaire theater_id (ISO YYYY-MM-DD). */
  speeldata?: string[];
  /** Tour-stops: aanvullende speel-locaties met eigen speeldata. */
  tour?: TourStop[];
}

export interface Theater {
  id: string;
  naam: string;
  afkorting: string;
  url: string;
  beschrijving?: string;
  stad: string;
  foto_url?: string;
  foto_credit?: string;
}

export interface Gezelschap {
  id: string;
  naam: string;
  afkorting: string;
  type: string;
  stad: string;
  url: string;
  beschrijving?: string;
  logo_url?: string;
  logo_credit?: string;
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

export interface FestivalShow {
  /** Stabiele id voor React-key — meestal festival-id + slug. */
  id: string;
  titel: string;
  gezelschap?: string;
  /** Voor de pill op de kleine card. */
  type: "dans" | "toneel" | "muziek" | "mime" | "anders";
  english_friendly?: boolean;
  foto_url?: string;
  foto_credit?: string;
  /** Korte tekst die in het detail-paneel verschijnt — waarom interessant. */
  korte_omschrijving?: string;
  /** Link naar de voorstelling op de festival-website. */
  url: string;
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
  foto_urls?: string[];
  foto_credit?: string;
  logo_url?: string;
  /** Programma — voorstellingen die op het festival spelen, opgehaald
   *  uit de festival-website. Optioneel; bij ontbreken valt de UI
   *  terug op match_keywords tegen `show.categorieen`. */
  voorstellingen?: FestivalShow[];
}

export interface VenueDisplay {
  theater_id: string;
  theater_naam: string;
  theater_afkorting: string;
  theater_stad: string;
  theater_url?: string;
  theater_foto_url?: string;
  theater_foto_credit?: string;
  /** Speeldata bij dit specifieke theater. Leeg = "datums via ticketlink". */
  speeldata: string[];
  /** Vlag voor de primaire venue (theater_id van de show zelf). */
  is_primary: boolean;
}

export interface ShowDisplay extends Show {
  pers_quotes: PersQuote[];
  media_links: MediaLink[];
  theater_display: string;
  theater_naam: string;
  theater_beschrijving: string;
  theater_url: string;
  theater_stad: string;
  theater_foto_url?: string;
  theater_foto_credit?: string;
  gezelschap_display: string;
  gezelschap_beschrijving: string;
  gezelschap_url: string;
  /** Alle speel-locaties met enriched theater-info. Eerste is primair,
   *  daarna eventuele tour-stops (en legacy extra_theaters zonder datums). */
  venues: VenueDisplay[];
}
