"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { ShowCard } from "./ShowCard";
import { FestivalsSection } from "./FestivalsSection";
import { GezelschappenSection } from "./GezelschappenSection";
import { TheatersSection } from "./TheatersSection";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { monthsToShow, monthLabel, monthKey, pillForMonth } from "@/lib/dates";
import type { ShowDisplay, Theater, Gezelschap, Festival } from "@/types";

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
  /** Theaters die voorkomen in shows — voor de filter-sidebar. */
  theaters: Theater[];
  /** Gezelschappen die voorkomen in shows — voor de filter-sidebar. */
  gezelschappen: Gezelschap[];
  /** Volledige theaters-lijst voor de Theaters-sectie. */
  allTheaters: Theater[];
  /** Volledige gezelschappen-lijst voor de Gezelschappen-sectie. */
  allGezelschappen: Gezelschap[];
  /** Festival-data voor de Festivals-sectie. */
  festivals: Festival[];
}

interface MonthGroup {
  year: number;
  monthIdx: number;
  label: string;
  shows: { show: ShowDisplay; pill: string }[];
}

export function ShowsExplorer({ shows, theaters, allTheaters, allGezelschappen, festivals }: Props) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Filter state — meerdere steden mogelijk, Amsterdam standaard geselecteerd
  const [selectedCities, setSelectedCities] = useState<Set<string>>(() => new Set(["Amsterdam"]));
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTheaters, setSelectedTheaters] = useState<Set<string>>(new Set());
  const [selectedGezelschappen, setSelectedGezelschappen] = useState<Set<string>>(new Set());
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());

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

  // Maand-dropdown state
  const [monthOpen, setMonthOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!monthOpen) return;
    const handler = (e: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(e.target as Node)) {
        setMonthOpen(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", handler); };
  }, [monthOpen]);

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

  // Filter de shows op basis van actieve filters
  const filteredShows = useMemo(() => {
    // Geen stad geselecteerd → geen shows
    if (selectedCities.size === 0) return [];
    return shows.filter(s => {
      // Stad-filter: primair theater óf één van de extra_theaters moet in een geselecteerde stad zijn
      const inCity =
        selectedCities.has(s.theater_stad) ||
        s.extra_theaters.some(id => {
          const stad = theaterStadById.get(id);
          return stad && selectedCities.has(stad);
        });
      if (!inCity) return false;
      if (showFavoritesOnly && !favorites.has(s.id)) return false;

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
  }, [shows, selectedCities, showFavoritesOnly, favorites, selectedTheaters, selectedGezelschappen, selectedMonths, theaterStadById]);

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

  // Eén maand tegelijk zichtbaar — gebruiker navigeert met prev/next
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  // Reset naar eerste maand wanneer filter-resultaten veranderen
  useEffect(() => {
    setCurrentMonthIndex(0);
  }, [selectedCities, selectedTheaters, selectedGezelschappen, selectedMonths, showFavoritesOnly]);

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
    selectedMonths.size > 0;
  const clearAllFilters = () => {
    setShowFavoritesOnly(false);
    setSelectedTheaters(new Set());
    setSelectedGezelschappen(new Set());
    setSelectedMonths(new Set());
  };

  return (
    <>
      {/* Sectietitel + filter chips */}
      <h2 className="font-display mb-2 text-3xl text-ink tracking-tight sm:text-4xl">
        Alle voorstellingen
      </h2>
      <p className="mb-6 text-sm text-ink-muted sm:text-base">
        Welke stad wil je zien? Standaard: Amsterdam. Selecteer er meer of een andere.
      </p>

      <div className="mb-8 flex flex-wrap items-center gap-2 sm:mb-10">
        {/* Multi-select city dropdown */}
        <div ref={cityRef} className="relative">
          <button
            onClick={() => setCityOpen(v => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCities.size > 0
                ? "bg-ink text-white hover:bg-black"
                : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
            }`}
          >
            <span>
              {selectedCities.size === 0
                ? "Kies een stad"
                : selectedCities.size === 1
                  ? Array.from(selectedCities)[0]
                  : `${Array.from(selectedCities)[0]} +${selectedCities.size - 1}`}
            </span>
            <ChevronDown size={14} />
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
              {selectedCities.size > 0 && (
                <div className="flex items-center justify-between px-3 py-2 border-b border-line text-xs">
                  <span className="text-ink-muted">{selectedCities.size} geselecteerd</span>
                  <button
                    onClick={() => setSelectedCities(new Set())}
                    className="text-ink-muted hover:text-ink"
                  >
                    Wis alle
                  </button>
                </div>
              )}
              <div className="max-h-64 overflow-y-auto p-2">
                {filteredCities.length === 0 ? (
                  <div className="px-3 py-2 text-sm italic text-ink-faint">Geen resultaten</div>
                ) : (
                  filteredCities.map(city => {
                    const isActive = selectedCities.has(city);
                    return (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCities(prev => {
                            const next = new Set(prev);
                            if (next.has(city)) next.delete(city);
                            else next.add(city);
                            return next;
                          });
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                          isActive
                            ? "bg-[#F1EFE8] text-ink font-medium"
                            : "text-ink-soft hover:bg-[#F8F6EF]"
                        }`}
                      >
                        <span>{city}</span>
                        {isActive && (
                          <span className="text-ink shrink-0" aria-hidden="true">✓</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Multi-select maand-dropdown */}
        <div ref={monthRef} className="relative">
          <button
            onClick={() => setMonthOpen(v => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedMonths.size > 0
                ? "bg-ink text-white hover:bg-black"
                : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
            }`}
          >
            <span>
              {selectedMonths.size === 0
                ? "Kies een maand"
                : selectedMonths.size === 1
                  ? availableMonths.find(m => m.key === Array.from(selectedMonths)[0])?.label ?? "1 maand"
                  : `${selectedMonths.size} maanden`}
            </span>
            <ChevronDown size={14} />
          </button>
          {monthOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-white shadow-xl overflow-hidden flex flex-col">
              {selectedMonths.size > 0 && (
                <div className="flex items-center justify-between px-3 py-2 border-b border-line text-xs">
                  <span className="text-ink-muted">{selectedMonths.size} geselecteerd</span>
                  <button
                    onClick={clearMonths}
                    className="text-ink-muted hover:text-ink"
                  >
                    Wis alle
                  </button>
                </div>
              )}
              <div className="max-h-64 overflow-y-auto p-2">
                {availableMonths.length === 0 ? (
                  <div className="px-3 py-2 text-sm italic text-ink-faint">Geen maanden beschikbaar</div>
                ) : (
                  availableMonths.map(m => {
                    const isActive = selectedMonths.has(m.key);
                    return (
                      <button
                        key={m.key}
                        onClick={() => toggleMonth(m.key)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                          isActive
                            ? "bg-[#F1EFE8] text-ink font-medium"
                            : "text-ink-soft hover:bg-[#F8F6EF]"
                        }`}
                      >
                        <span className="capitalize">{m.label}</span>
                        {isActive && (
                          <span className="text-ink shrink-0" aria-hidden="true">✓</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hartje — favorieten-toggle, laatste in het rijtje */}
        <button
          onClick={() => setShowFavoritesOnly(v => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            showFavoritesOnly
              ? "bg-[#FF3D8B] text-white hover:bg-[#E5306F]"
              : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
          }`}
          aria-label="Toon alleen favorieten"
        >
          <Heart
            size={14}
            className={showFavoritesOnly ? "fill-white stroke-white" : "stroke-current"}
          />
          {favorites.size > 0 && (
            <span className={showFavoritesOnly ? "text-white/90" : "text-ink-muted"}>
              {favorites.size}
            </span>
          )}
        </button>
      </div>

      {selectedCities.size === 0 ? (
        <div className="rounded-3xl border border-line bg-white p-12 text-center">
          <div className="text-2xl font-medium text-ink mb-2">Kies eerst een stad</div>
          <div className="text-sm text-ink-muted">
            Selecteer hierboven een of meer steden om voorstellingen te zien.
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
        <div className="space-y-8">
          {(() => {
            const idx = Math.min(currentMonthIndex, months.length - 1);
            const group = months[idx];
            const prev = idx > 0 ? months[idx - 1] : null;
            const next = idx < months.length - 1 ? months[idx + 1] : null;
            return (
              <>
                <section>
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
                {(prev || next) && (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {prev && (
                      <button
                        onClick={() => setCurrentMonthIndex(i => Math.max(0, i - 1))}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink-soft hover:bg-[#F8F6EF] transition-colors"
                      >
                        <ChevronDown size={14} className="rotate-90" />
                        Terug naar {prev.label}
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => setCurrentMonthIndex(i => Math.min(months.length - 1, i + 1))}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink-soft hover:bg-[#F8F6EF] transition-colors"
                      >
                        Toon {next.label}
                        <ChevronDown size={14} className="-rotate-90" />
                      </button>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Extra secties — staan altijd onderaan de pagina, ongeacht stad-selectie */}
      <FestivalsSection festivals={festivals} shows={filteredShows} />
      <GezelschappenSection gezelschappen={allGezelschappen} />
      <TheatersSection theaters={allTheaters} mentionedTheaters={theaters} />
    </>
  );
}
