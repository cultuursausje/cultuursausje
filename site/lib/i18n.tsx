"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "nl" | "en";

/** Vertalingen van UI-strings. Show-data (titels, samenvattingen) blijft
 *  in het Nederlands — die zijn inherent aan het Nederlandse theater. */
const T = {
  // Header
  "header.subtitle": {
    nl: "Theateragenda van Nederland, voorstellingen, festivals, gezelschappen en theaters op één plek.",
    en: "Dutch theatre agenda: shows, festivals, companies and venues in one place."
  },

  // Navigation
  "nav.recensies": { nl: "Niet te missen", en: "Must-see" },
  "nav.plan": { nl: "Plan", en: "Plan" },
  "nav.voorstellingen": { nl: "Voorstellingen", en: "Shows" },
  "nav.festivals": { nl: "Festivals", en: "Festivals" },
  "nav.voordeel": { nl: "Voordeel", en: "Discounts" },
  "nav.gezelschappen": { nl: "Gezelschappen", en: "Companies" },
  "nav.theaters": { nl: "Theaters", en: "Venues" },

  // Section titles
  "section.recensies.title": {
    nl: "Niet te missen voorstellingen",
    en: "Must-see shows"
  },
  "section.recensies.subtitle": {
    nl: "Voorstellingen met de meeste buzz dit seizoen, gemeten aan lovende recensies en uitverkochte speelperiodes.",
    en: "The most buzzed-about shows of the season, with rave reviews and sold-out runs."
  },
  "section.plan.title": {
    nl: "Plan je theateravond",
    en: "Plan your evening"
  },
  "section.plan.subtitle": {
    nl: "Kies een stad en datum, eventueel met English friendly, en zie welke voorstellingen of festivals die avond aansluiten.",
    en: "Pick a city and date, optionally with English friendly, and see which shows or festivals are on."
  },
  "section.voorstellingen.title": {
    nl: "Alle voorstellingen",
    en: "All shows"
  },
  "section.voorstellingen.subtitle": {
    nl: "Welke stad wil je zien? Standaard: Amsterdam. Selecteer er meer of een andere.",
    en: "Which city do you want to see? Default: Amsterdam. Select another or pick none."
  },
  "section.festivals.title": {
    nl: "Theaterfestivals",
    en: "Theatre festivals"
  },
  "section.festivals.subtitle": {
    nl: "De grootste theaterfestivals van Nederland, met locatietheater, internationale gezelschappen en grensverleggend werk. Klik op een festival voor meer info.",
    en: "The biggest theatre festivals in the Netherlands, with site-specific theatre, international companies and boundary-pushing work. Click a festival for more info."
  },
  "section.voordeel.title": {
    nl: "Met voordeel naar theater",
    en: "Theatre discounts"
  },
  "section.voordeel.subtitle": {
    nl: "Passen, regelingen en kortingsopties om voordeliger naar het theater te gaan.",
    en: "Passes, schemes and discount options to make theatre more affordable."
  },
  "section.gezelschappen.title": {
    nl: "Gezelschappen & collectieven",
    en: "Companies & collectives"
  },
  "section.gezelschappen.subtitle": {
    nl: "De grootste theatergezelschappen en theatercollectieven.",
    en: "The biggest theatre companies and collectives."
  },
  "section.theaters.title": {
    nl: "Theaters",
    en: "Venues"
  },
  "section.theaters.subtitle": {
    nl: "Plekken waar de voorstellingen spelen.",
    en: "Where the shows take place."
  },

  // Filter / picker labels
  "filter.pickCity": { nl: "Kies een stad", en: "Pick a city" },
  "filter.pickDate": { nl: "Kies een datum", en: "Pick a date" },
  "filter.englishFriendly": { nl: "English friendly", en: "English friendly" },
  "filter.none": { nl: "Geen", en: "None" },

  // Empty states
  "empty.noCity.title": {
    nl: "Je hebt nog geen stad gekozen.",
    en: "No city selected yet."
  },
  "empty.noCity.subtitle": {
    nl: "Klik hierboven op de stad-knop om een stad te selecteren.",
    en: "Click the city button above to select a city."
  },
  "empty.noFavorites.title": {
    nl: "Je hebt nog geen voorstellingen geliked.",
    en: "You haven't liked any shows yet."
  },
  "empty.noFavorites.subtitle": {
    nl: "Klik op het hartje op een kaart om 'm op te slaan.",
    en: "Tap the heart on a card to save it."
  },
  "empty.noShowsMonth": {
    nl: "Geen voorstellingen in deze maand.",
    en: "No shows in this month."
  },
  "empty.noShowsFilters": {
    nl: "Geen voorstellingen die aan je filters voldoen.",
    en: "No shows match your filters."
  },
  "empty.clearFilters": {
    nl: "Wis alle filters",
    en: "Clear all filters"
  },

  // Buttons
  "button.seeMore": { nl: "Bekijk meer", en: "See more" },
  "button.less": { nl: "Minder", en: "Less" },
  "button.lessReviews": { nl: "Minder recensies", en: "Fewer reviews" },
  "button.toShow": { nl: "Naar de voorstelling op", en: "Go to show on" },
  "button.tickets": { nl: "Naar tickets", en: "Get tickets" },
  "button.openMaps": { nl: "Open in Google Maps", en: "Open in Google Maps" },
  "button.moreAbout": { nl: "Meer over dit theater", en: "More about this venue" },
  "button.toFestivalWebsite": { nl: "Naar festival-website", en: "Go to festival website" },
  "button.toShowMaster": { nl: "Naar voorstelling", en: "Go to show" },

  // Show detail labels
  "show.speeldata": { nl: "Speeldata", en: "Dates" },
  "show.locatie": { nl: "Locatie", en: "Venue" },
  "show.locaties": { nl: "Locaties", en: "Venues" },
  "show.inDeMedia": { nl: "In de media", en: "In the media" },

  // Festival modal
  "festival.programmaVolgt": {
    nl: "Programma volgt, kijk op",
    en: "Programme to follow, check"
  },
  "festival.voorstellingenTijdens": {
    nl: "Voorstellingen tijdens dit festival",
    en: "Shows during this festival"
  },
  "festival.toWebsite": {
    nl: "Naar festival-website",
    en: "Go to festival website"
  },
  "festival.pill": { nl: "Festival", en: "Festival" },

  // Carousel navigation
  "carousel.prevMonth": { nl: "Terug naar", en: "Back to" },
  "carousel.nextMonth": { nl: "Toon", en: "Show" },

  // Theater
  "theater.onMap": { nl: "Op de kaart", en: "On the map" },

  // Detail panel labels
  "detail.datesViaLink": {
    nl: "Speeldata via de link hieronder",
    en: "Dates via the link below"
  },
  "detail.moreViaLink": {
    nl: "meer, zie link hieronder",
    en: "more, see link below"
  },

  // Plan section result message (composed)
  "plan.noResultsFor": {
    nl: "Geen voorstellingen of festivals gevonden voor",
    en: "No shows or festivals found for"
  },
  "plan.on": { nl: "op", en: "on" },
  "plan.withEnglish": {
    nl: "met English friendly",
    en: "with English friendly"
  }
};

// Month and weekday helpers — locale-aware
const MONTH_NAMES_NL = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const MONTH_NAMES_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const MONTH_SHORT_NL = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
const MONTH_SHORT_EN = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const DAY_SHORT_NL = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const DAY_SHORT_EN = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Engels: maandnamen beginnen met hoofdletter. NL: lowercase. */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function monthLabelLang(year: number, monthIdx: number, lang: Lang): string {
  if (lang === "en") return `${capitalize(MONTH_NAMES_EN[monthIdx])} ${year}`;
  return `${MONTH_NAMES_NL[monthIdx]} ${year}`;
}

export function monthShortLang(monthIdx: number, lang: Lang): string {
  return (lang === "en" ? MONTH_SHORT_EN : MONTH_SHORT_NL)[monthIdx];
}

export function dayShortLang(weekday: number, lang: Lang): string {
  return (lang === "en" ? DAY_SHORT_EN : DAY_SHORT_NL)[weekday];
}

export function formatDateLang(d: Date, lang: Lang): string {
  return `${dayShortLang(d.getDay(), lang)} ${d.getDate()} ${monthShortLang(d.getMonth(), lang)}`;
}

/** Lang-aware pill: "9–14 May" of "9–14 mei", "Hele juni" of "Whole June". */
export function pillForMonthLang(
  startISO: string,
  endISO: string,
  year: number,
  monthIdx: number,
  lang: Lang
): string | null {
  const [sy, sm, sd] = startISO.split("-").map(Number);
  const [ey, em, ed] = endISO.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const monthStart = new Date(year, monthIdx, 1);
  const monthEnd = new Date(year, monthIdx + 1, 0);
  if (end < monthStart || start > monthEnd) return null;

  const periodStart = start < monthStart ? monthStart : start;
  const periodEnd = end > monthEnd ? monthEnd : end;
  const short = monthShortLang(monthIdx, lang);
  const shortCap = short.charAt(0).toUpperCase() + short.slice(1);
  const full = (lang === "en" ? MONTH_NAMES_EN : MONTH_NAMES_NL)[monthIdx];
  const fullCap = full.charAt(0).toUpperCase() + full.slice(1);

  if (periodStart.getDate() === 1 && periodEnd.getDate() === monthEnd.getDate()) {
    return lang === "en" ? `Whole ${fullCap}` : `Hele ${fullCap}`;
  }
  if (periodStart.getDate() === periodEnd.getDate()) {
    return `${periodStart.getDate()} ${shortCap}`;
  }
  return `${periodStart.getDate()}–${periodEnd.getDate()} ${shortCap}`;
}

/** Vertaalt Nederlandse maandnamen in vrije tekst (zoals festival-periode
 *  "Mei – Juni" of "Eind mei – begin juni") naar Engels. Behoudt hoofd/kleine
 *  letters van de oorspronkelijke tekst per match. */
const PERIODE_NL_TO_EN_FULL: Record<string, string> = {
  januari: "January", februari: "February", maart: "March", april: "April",
  mei: "May", juni: "June", juli: "July", augustus: "August",
  september: "September", oktober: "October", november: "November", december: "December"
};
const PERIODE_NL_TO_EN_SHORT: Record<string, string> = {
  jan: "Jan", feb: "Feb", mrt: "Mar", apr: "Apr",
  jun: "Jun", jul: "Jul", aug: "Aug", sep: "Sep",
  okt: "Oct", nov: "Nov", dec: "Dec"
  // "mei" en "mar" overlappen — "mei" wordt door FULL afgehandeld
};
const PERIODE_PHRASES_NL_TO_EN: Record<string, string> = {
  eind: "End of", begin: "Early", halverwege: "Mid", medio: "Mid"
};

export function translatePeriode(periode: string, lang: Lang): string {
  if (lang === "nl") return periode;
  let out = periode;
  // Lange maandnamen (case-insensitive) — match hoofdletter aan eerste letter
  for (const [nl, en] of Object.entries(PERIODE_NL_TO_EN_FULL)) {
    out = out.replace(new RegExp(`\\b${nl}\\b`, "gi"), (m) =>
      m[0] === m[0].toUpperCase() ? en : en.toLowerCase()
    );
  }
  // Korte maandnamen (3 letters)
  for (const [nl, en] of Object.entries(PERIODE_NL_TO_EN_SHORT)) {
    out = out.replace(new RegExp(`\\b${nl}\\b`, "gi"), (m) =>
      m[0] === m[0].toUpperCase() ? en : en.toLowerCase()
    );
  }
  // Beschrijvende woorden
  for (const [nl, en] of Object.entries(PERIODE_PHRASES_NL_TO_EN)) {
    out = out.replace(new RegExp(`\\b${nl}\\b`, "gi"), (m) =>
      m[0] === m[0].toUpperCase() ? en : en.toLowerCase()
    );
  }
  return out;
}

/** Vertaalt het Nederlandse `type`-label van een gezelschap naar Engels.
 *  De typen zijn een beperkte set; alles dat we niet herkennen valt terug
 *  op de NL-versie. */
const GEZELSCHAP_TYPE_NL_TO_EN: Record<string, string> = {
  "Rijksgesubsidieerd theatergezelschap": "State-subsidised theatre company",
  "Theatercollectief": "Theatre collective",
  "Theatercollectief (muziektheater)": "Theatre collective (music theatre)",
  "Productiehuis": "Production house",
  "Productiehuis (interdisciplinair hiphop/urban)": "Production house (interdisciplinary hip-hop/urban)"
};

export function translateGezelschapType(type: string, lang: Lang): string {
  if (lang === "nl") return type;
  return GEZELSCHAP_TYPE_NL_TO_EN[type] ?? type;
}

type Key = keyof typeof T;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "nl",
  setLang: () => {}
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cultuursausje-lang");
      if (saved === "en" || saved === "nl") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      window.localStorage.setItem("cultuursausje-lang", newLang);
    } catch {}
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}

export function useT() {
  const { lang } = useLang();
  return (key: Key): string => {
    const entry = T[key];
    if (!entry) return key as string;
    return entry[lang] ?? entry.nl ?? (key as string);
  };
}
