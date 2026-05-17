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
    nl: "De grootste theatergezelschappen en theatercollectieven van Nederland.",
    en: "The biggest theatre companies and collectives in the Netherlands."
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

  // Carousel navigation
  "carousel.prevMonth": { nl: "Terug naar", en: "Back to" },
  "carousel.nextMonth": { nl: "Toon", en: "Show" }
};

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
