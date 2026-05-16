"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { ShowCard } from "./ShowCard";
import { FilterSidebar } from "./FilterSidebar";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { monthsToShow, monthLabel, monthKey, pillForMonth } from "@/lib/dates";
import type { ShowDisplay, Theater, Gezelschap } from "@/types";

// Grotere Nederlandse theater-steden — zodat de dropdown ook steden bevat
// die nog geen voorstellingen hebben (de gebruiker kan ze toch zoeken).
const DUTCH_THEATER_CITIES = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen",
  "Apeldoorn", "Haarlem", "Enschede", "Arnhem", "Amersfoort",
  "Maastricht", "Leiden", "'s-Hertogenbosch", "Zwolle", "Leeuwarden",
  "Dordrecht", "Heerlen", "Delft", "Castricum", "Alkmaar",
  "Hilversum", "Deventer", "Schiedam"
];

interface Props {
  shows: ShowDisplay[];
  theaters: Theater[];
  gezelschappen: Gezelschap[];
}

interface MonthGroup {
  year: number;
  monthIdx: number;
  label: string;
  shows: { show: ShowDisplay; pill: string }[];
}

export function ShowsExplorer({ shows, theaters, gezelschappen }: Props) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Filter state
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTheaters, setSelectedTheaters] = useState<Set<string>>(new Set());
  const [selectedGezelschappen, setSelectedGezelschappen] = useState<Set<string>>(new Set());
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());
  const [showThisWeek, setShowThisWeek] = useState(false);
  const [showTopRated, setShowTopRated] = useState(false);

  // Beschikbare steden: theaters die we hebben + grote NL theater-steden (gesorteerd)
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    theaters.forEach(t => { if (t.stad) set.add(t.stad); });
    DUTCH_THEATER_CITIES.forEach(c => set.add(c));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "nl"));
  }, [theaters]);

  // Lookup theater_id → stad voor extra_theaters check
  const theaterStadById = useMemo(() => {
    const m = new Map<string, string>();
    theaters.forEach(t => m.set(t.id, t.stad));
    return m;
  }, [theaters]);

  // Stad-dropdown state
  const [cityOpen, setCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cityOpen) return;
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", handler); };
  }, [cityOpen]);

  const filteredCities = useMemo(
    () => availableCities.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())),
    [availableCities, cityQuery]
  );

  useEffect(() => { setFavorites(loadFavorites()); }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => { saveFavorites(favorites); }, [favorites]);

  // Sluit expanded met Escape
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Helpers voor quick filters
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const weekEndISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  // Filter de shows op basis van actieve filters
  const filteredShows = useMemo(() => {
    // Voordat een stad gekozen is, tonen we niets
    if (!selectedCity) return [];
    return shows.filter(s => {
      // Stad-filter: primair theater óf één van de extra_theaters moet in de stad zijn
      const inCity =
        s.theater_stad === selectedCity ||
        s.extra_theaters.some(id => theaterStadById.get(id) === selectedCity);
      if (!inCity) return false;
      if (showFavoritesOnly && !favorites.has(s.id)) return false;

      // Deze week: speeldata of speelperiode binnen vandaag t/m vandaag+7
      if (showThisWeek) {
        const inSpeeldata = !!s.speeldata && s.speeldata.some(d => d >= todayISO && d <= weekEndISO);
        const inRange = s.speelperiode_start <= weekEndISO && s.speelperiode_end >= todayISO;
        if (!inSpeeldata && !inRange) return false;
      }

      // Best gerecenseerd: heeft minstens één pers-quote met sterren ≥ 4
      if (showTopRated) {
        const goodReviews = s.pers_quotes.some(p => (p.sterren ?? 0) >= 4);
        if (!goodReviews) return false;
      }

      if (selectedTheaters.size > 0) {
        const has =
          (s.theater_id && selectedTheaters.has(s.theater_id)) ||
          s.extra_theaters.some(t => selectedTheaters.has(t));
        if (!has) return false;
      }
      if (selectedGezelschappen.size > 0 &&
          !(s.gezelschap_id && selectedGezelschappen.has(s.gezelschap_id))) {
        return false;
      }
      if (selectedMonths.size > 0) {
        const anyMatch = Array.from(selectedMonths).some(key => {
          const [year, m] = key.split("-").map(Number);
          const monthStart = `${year}-${String(m).padStart(2, "0")}-01`;
          const lastDay = new Date(year, m, 0).getDate();
          const monthEnd = `${year}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
          return s.speelperiode_start <= monthEnd && s.speelperiode_end >= monthStart;
        });
        if (!anyMatch) return false;
      }
      return true;
    });
  }, [shows, selectedCity, showFavoritesOnly, favorites, selectedTheaters, selectedGezelschappen, selectedMonths, showThisWeek, showTopRated, todayISO, weekEndISO]);

  // Beschikbare maanden afgeleid uit alle shows (niet gefilterd)
  const availableMonths = useMemo(() => {
    return monthsToShow(shows).map(({ year, monthIdx }) => ({
      key: `${year}-${String(monthIdx + 1).padStart(2, "0")}`,
      label: monthLabel(year, monthIdx)
    }));
  }, [shows]);

  const months: MonthGroup[] = useMemo(() => {
    let list = monthsToShow(filteredShows);
    // Als de gebruiker specifieke maanden heeft geselecteerd, toon alleen die maand-secties
    if (selectedMonths.size > 0) {
      list = list.filter(({ year, monthIdx }) => {
        const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
        return selectedMonths.has(key);
      });
    }
    return list.map(({ year, monthIdx }) => {
      const items = filteredShows
        .map(show => {
          const pill = pillForMonth(show.speelperiode_start, show.speelperiode_end, year, monthIdx);
          return pill ? { show, pill } : null;
        })
        .filter((x): x is { show: ShowDisplay; pill: string } => x !== null)
        .sort((a, b) => a.show.speelperiode_start.localeCompare(b.show.speelperiode_start));
      return {
        year, monthIdx,
        label: monthLabel(year, monthIdx),
        shows: items
      };
    }).filter(g => g.shows.length > 0);
  }, [filteredShows, selectedMonths]);

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleFlip = (key: string) => {
    if (expanded) {
      setExpanded(null);
      setFlipped(new Set([key]));
      return;
    }
    setFlipped(prev => prev.has(key) ? new Set() : new Set([key]));
  };

  const toggleTheater = (id: string) => {
    setSelectedTheaters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const clearTheaters = () => setSelectedTheaters(new Set());

  const toggleGezelschap = (id: string) => {
    setSelectedGezelschappen(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const clearGezelschappen = () => setSelectedGezelschappen(new Set());

  const toggleMonth = (key: string) => {
    setSelectedMonths(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const clearMonths = () => setSelectedMonths(new Set());

  const hasActiveFilter =
    showFavoritesOnly ||
    selectedTheaters.size > 0 ||
    selectedGezelschappen.size > 0 ||
    selectedMonths.size > 0 ||
    showThisWeek ||
    showTopRated;
  const clearAllFilters = () => {
    setShowFavoritesOnly(false);
    setSelectedTheaters(new Set());
    setSelectedGezelschappen(new Set());
    setSelectedMonths(new Set());
    setShowThisWeek(false);
    setShowTopRated(false);
  };

  return (
    <>
      <FilterSidebar
        favoritesActive={showFavoritesOnly}
        favoritesCount={favorites.size}
        onToggleFavoritesFilter={() => setShowFavoritesOnly(v => !v)}
        theaters={theaters}
        selectedTheaters={selectedTheaters}
        onToggleTheater={toggleTheater}
        onClearTheaters={clearTheaters}
        gezelschappen={gezelschappen}
        selectedGezelschappen={selectedGezelschappen}
        onToggleGezelschap={toggleGezelschap}
        onClearGezelschappen={clearGezelschappen}
        availableMonths={availableMonths}
        selectedMonths={selectedMonths}
        onToggleMonth={toggleMonth}
        onClearMonths={clearMonths}
      />

      {/* Filter chips: eerst stad-dropdown (verplicht), dan streepje, dan quick filters */}
      <div className="mb-8 flex flex-wrap items-center gap-2 sm:mb-10">
        {/* Searchable city dropdown */}
        <div ref={cityRef} className="relative">
          <button
            onClick={() => setCityOpen(v => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCity
                ? "bg-ink text-white hover:bg-black"
                : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
            }`}
          >
            <span>{selectedCity || "Kies een stad"}</span>
            {selectedCity ? (
              <span
                role="button"
                onClick={e => { e.stopPropagation(); setSelectedCity(null); setCityOpen(false); }}
                className="-mr-1 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/15"
                aria-label="Stad wissen"
              >
                <X size={11} />
              </span>
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
          {cityOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-white shadow-xl overflow-hidden flex flex-col">
              <div className="p-2 border-b border-line">
                <input
                  autoFocus
                  type="text"
                  value={cityQuery}
                  onChange={e => setCityQuery(e.target.value)}
                  placeholder="Zoek een stad..."
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                />
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {filteredCities.length === 0 ? (
                  <div className="px-3 py-2 text-sm italic text-ink-faint">Geen resultaten</div>
                ) : (
                  filteredCities.map(city => {
                    const isActive = selectedCity === city;
                    return (
                      <button
                        key={city}
                        onClick={() => { setSelectedCity(city); setCityOpen(false); setCityQuery(""); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive
                            ? "bg-[#F1EFE8] text-ink font-medium"
                            : "text-ink-soft hover:bg-[#F8F6EF]"
                        }`}
                      >
                        {city}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-2 h-6 w-px bg-line" aria-hidden="true" />

        <button
          onClick={() => setShowThisWeek(v => !v)}
          disabled={!selectedCity}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            showThisWeek
              ? "bg-ink text-white hover:bg-black"
              : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Wat speelt er deze week
        </button>
        <button
          onClick={() => setShowTopRated(v => !v)}
          disabled={!selectedCity}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            showTopRated
              ? "bg-ink text-white hover:bg-black"
              : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Best gerecenseerd
        </button>
      </div>

      {!selectedCity ? (
        <div className="rounded-3xl border border-line bg-white p-12 text-center">
          <div className="text-2xl font-medium text-ink mb-2">Kies eerst een stad</div>
          <div className="text-sm text-ink-muted">
            Selecteer hierboven een stad om voorstellingen in die stad te zien.
          </div>
        </div>
      ) : months.length === 0 ? (
        <div className="rounded-3xl border border-line bg-white p-10 text-center text-ink-muted">
          {showFavoritesOnly && favorites.size === 0 ? (
            <>
              Je hebt nog geen voorstellingen geliked.
              <div className="mt-2 text-xs text-ink-faint">
                Klik op het hartje op een kaart om 'm op te slaan.
              </div>
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="block mx-auto mt-4 text-sm text-ink underline-offset-2 underline hover:no-underline"
              >
                Toon alle voorstellingen
              </button>
            </>
          ) : hasActiveFilter ? (
            <>
              Geen voorstellingen die aan je filters voldoen.
              <button
                onClick={clearAllFilters}
                className="block mx-auto mt-3 text-sm text-ink underline-offset-2 underline hover:no-underline"
              >
                Wis alle filters
              </button>
            </>
          ) : (
            "Geen voorstellingen om te tonen."
          )}
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-16">
          {months.map(group => (
            <section key={monthKey(group.year, group.monthIdx)}>
              <h2 className="font-display mb-5 text-3xl text-ink tracking-tight sm:text-4xl">
                {group.label}
              </h2>
              <div
                className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
                style={{ gridAutoFlow: "dense" }}
              >
                {group.shows.map(({ show, pill }) => {
                  const key = `${show.id}--${monthKey(group.year, group.monthIdx)}`;
                  const isExpandedHere = expanded === key;
                  return (
                    <div
                      key={key}
                      className={`transition-all duration-300 ${
                        isExpandedHere
                          ? "col-span-2 sm:col-span-3 md:col-span-3 xl:col-span-3 row-span-2"
                          : ""
                      }`}
                      style={{ alignSelf: "start" }}
                    >
                      <ShowCard
                        show={show}
                        pill={pill}
                        monthKey={key}
                        isFlipped={flipped.has(key)}
                        isExpanded={isExpandedHere}
                        isFavorite={favorites.has(show.id)}
                        isMobile={isMobile}
                        onFlip={() => toggleFlip(key)}
                        onExpand={() => { setExpanded(key); setFlipped(new Set()); }}
                        onCollapse={() => setExpanded(null)}
                        onToggleFav={() => toggleFav(show.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
