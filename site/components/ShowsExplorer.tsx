"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { SmallShowCard, ShowDetailPanel } from "./ShowCard";
import { FestivalsSection } from "./FestivalsSection";
import { VoordeelSection } from "./VoordeelSection";
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

  // Steden waar daadwerkelijk voorstellingen plaatsvinden — bepaalt welke
  // items in de dropdown klikbaar zijn. Bron: alle venues per show.
  const citiesWithShows = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => {
      s.venues.forEach(v => {
        if (v.theater_stad) set.add(v.theater_stad);
      });
    });
    return set;
  }, [shows]);

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

  // Shows gefilterd op stad/theater/gezelschap — ZONDER hartje-filter.
  // Hier baseren we de maand-navigatie op, zodat het hartje de pills niet "leeg trekt".
  const filteredShowsForNav = useMemo(() => {
    if (selectedCities.size === 0) return [];
    return shows.filter(s => {
      const inCity = s.venues.some(v => selectedCities.has(v.theater_stad));
      if (!inCity) return false;
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
      return true;
    });
  }, [shows, selectedCities, selectedTheaters, selectedGezelschappen, theaterStadById]);

  // Volledig gefilterd (incl. hartje) — voor festival-panel
  const filteredShows = useMemo(() => {
    return showFavoritesOnly
      ? filteredShowsForNav.filter(s => favorites.has(s.id))
      : filteredShowsForNav;
  }, [filteredShowsForNav, showFavoritesOnly, favorites]);

  // Maanden voor navigatie — gebaseerd op stad/theater/gezelschap, ONGEACHT favorites,
  // zodat de pills stabiel blijven als je het hartje aan/uit zet
  const monthsForNav: MonthGroup[] = useMemo(() => {
    const list = monthsToShow(filteredShowsForNav);
    return list.map(({ year, monthIdx }) => {
      const items = filteredShowsForNav
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
  }, [filteredShowsForNav]);

  // Eén maand tegelijk zichtbaar — gebruiker navigeert met prev/next
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  // Reset naar eerste maand wanneer scope-filters veranderen (hartje verandert maandindex niet)
  useEffect(() => {
    setCurrentMonthIndex(0);
  }, [selectedCities, selectedTheaters, selectedGezelschappen]);

  // Huidige maand + prev/next uit monthsForNav — pills blijven dus stabiel
  const safeIdx = monthsForNav.length > 0 ? Math.min(currentMonthIndex, monthsForNav.length - 1) : 0;
  const currentMonth = monthsForNav.length > 0 ? monthsForNav[safeIdx] : null;
  const prevMonth = currentMonth && safeIdx > 0 ? monthsForNav[safeIdx - 1] : null;
  const nextMonth = currentMonth && safeIdx < monthsForNav.length - 1 ? monthsForNav[safeIdx + 1] : null;

  // Daadwerkelijk te tonen shows in de huidige maand — hartje-filter wordt hier toegepast
  const currentMonthShows = currentMonth
    ? currentMonth.shows.filter(({ show }) => !showFavoritesOnly || favorites.has(show.id))
    : [];

  // Alle gelikte voorstellingen (over alle maanden) — voor de favorieten-view zonder maand-kop
  const allFavoritedShows = useMemo(() => {
    if (!showFavoritesOnly) return [] as { show: ShowDisplay; pill: string }[];
    return filteredShowsForNav
      .filter(s => favorites.has(s.id))
      .map(show => {
        const [y, m] = show.speelperiode_start.split("-").map(Number);
        const pill = pillForMonth(show.speelperiode_start, show.speelperiode_end, y, m - 1) ?? "";
        return { show, pill };
      })
      .sort((a, b) => a.show.speelperiode_start.localeCompare(b.show.speelperiode_start));
  }, [showFavoritesOnly, filteredShowsForNav, favorites]);

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

  const hasActiveFilter =
    showFavoritesOnly ||
    selectedTheaters.size > 0 ||
    selectedGezelschappen.size > 0;
  const clearAllFilters = () => {
    setShowFavoritesOnly(false);
    setSelectedTheaters(new Set());
    setSelectedGezelschappen(new Set());
  };

  return (
    <>
      <section id="voorstellingen">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#FFE600" }}
      >
      {/* Sectietitel + filter chips */}
      <h2 className="font-display mb-2 text-3xl text-ink tracking-tight sm:text-4xl">
        Alle voorstellingen
      </h2>
      <p className="mb-6 text-sm text-ink-soft sm:text-base">
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
                    const isEnabled = citiesWithShows.has(city);
                    return (
                      <button
                        key={city}
                        disabled={!isEnabled}
                        onClick={() => {
                          if (!isEnabled) return;
                          setSelectedCities(prev => {
                            const next = new Set(prev);
                            if (next.has(city)) next.delete(city);
                            else next.add(city);
                            return next;
                          });
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                          !isEnabled
                            ? "text-ink-faint cursor-not-allowed opacity-50"
                            : isActive
                              ? "bg-[#F1EFE8] text-ink font-medium"
                              : "text-ink-soft hover:bg-[#F8F6EF]"
                        }`}
                      >
                        <span>{city}</span>
                        {isActive && isEnabled && (
                          <span className="text-ink shrink-0" aria-hidden="true">✓</span>
                        )}
                        {!isEnabled && (
                          <span className="text-[10px] text-ink-faint shrink-0">geen</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Maand-navigatie — verschijnt alleen wanneer er een vorige/volgende maand is */}
        {prevMonth && (
          <button
            onClick={() => setCurrentMonthIndex(i => Math.max(0, i - 1))}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:bg-[#F8F6EF] transition-colors"
          >
            <ChevronDown size={14} className="rotate-90" />
            <span className="capitalize">Terug naar {prevMonth.label}</span>
          </button>
        )}
        {nextMonth && (
          <button
            onClick={() => setCurrentMonthIndex(i => Math.min(monthsForNav.length - 1, i + 1))}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:bg-[#F8F6EF] transition-colors"
          >
            <span className="capitalize">Toon {nextMonth.label}</span>
            <ChevronDown size={14} className="-rotate-90" />
          </button>
        )}

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
        <div className="px-2 py-6 text-center">
          <div className="text-base text-ink">Je hebt nog geen stad gekozen.</div>
          <div className="mt-2 text-sm text-ink-soft">
            Klik hierboven op de stad-knop om een stad te selecteren.
          </div>
        </div>
      ) : monthsForNav.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-ink-muted">
          {hasActiveFilter ? (
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
      ) : showFavoritesOnly ? (
        // Favorieten-view: alle gelikte shows in één carousel, zonder maand-kop.
        allFavoritedShows.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <div className="text-base text-ink">Je hebt nog geen voorstellingen geliked.</div>
            <div className="mt-2 text-sm text-ink-soft">
              Klik op het hartje op een kaart om 'm op te slaan.
            </div>
          </div>
        ) : (
          <ShowCarousel
            items={allFavoritedShows.map(({ show, pill }) => ({ show, pill, key: `${show.id}--fav` }))}
            expandedKey={expanded}
            favorites={favorites}
            selectedCities={selectedCities}
            onSelect={(key) => setExpanded(prev => prev === key ? null : key)}
            onToggleFav={(id) => toggleFav(id)}
          />
        )
      ) : currentMonth ? (
        <div>
          <h3 className="font-display mb-4 text-3xl text-ink tracking-tight sm:text-4xl">
            {currentMonth.label}
          </h3>
          {currentMonthShows.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <div className="text-base text-ink">Geen voorstellingen in deze maand.</div>
            </div>
          ) : (
            <ShowCarousel
              items={currentMonthShows.map(({ show, pill }) => ({
                show, pill,
                key: `${show.id}--${monthKey(currentMonth.year, currentMonth.monthIdx)}`
              }))}
              expandedKey={expanded}
              favorites={favorites}
              selectedCities={selectedCities}
              viewMonth={{ year: currentMonth.year, monthIdx: currentMonth.monthIdx }}
              onSelect={(key) => setExpanded(prev => prev === key ? null : key)}
              onToggleFav={(id) => toggleFav(id)}
            />
          )}
        </div>
      ) : null}
      </div>
      </section>

      {/* Extra secties — staan altijd onderaan de pagina, ongeacht stad-selectie */}
      <FestivalsSection festivals={festivals} shows={filteredShows} />
      <GezelschappenSection gezelschappen={allGezelschappen} />
      <TheatersSection theaters={allTheaters} mentionedTheaters={theaters} />
      <VoordeelSection />
    </>
  );
}

// ── Carousel ────────────────────────────────────────────────────────────────
// Eén rij met kleine voorstellingscards + pijltjes; opent een detail-paneel
// onder de rij wanneer je op een card klikt.

interface CarouselItem {
  show: ShowDisplay;
  pill: string;
  key: string;
}

interface ShowCarouselProps {
  items: CarouselItem[];
  expandedKey: string | null;
  favorites: Set<string>;
  selectedCities: Set<string>;
  viewMonth?: { year: number; monthIdx: number };
  onSelect: (key: string) => void;
  onToggleFav: (id: string) => void;
}

function ShowCarousel({
  items, expandedKey, favorites, selectedCities, viewMonth, onSelect, onToggleFav
}: ShowCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ atStart: true, atEnd: false });

  const updateEdge = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      atStart: el.scrollLeft <= 0,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    });
  };

  useEffect(() => {
    const t = setTimeout(updateEdge, 50);
    return () => clearTimeout(t);
  }, [items.length]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const cardWidth = 176 + 12; // w-44 + gap-3
    el.scrollBy({ left: dir * cardWidth * 2, behavior: "smooth" });
  };

  const expandedItem = items.find(it => it.key === expandedKey);
  const cityResolvedVenues = expandedItem
    ? (() => {
        const cityFiltered = selectedCities.size === 0
          ? expandedItem.show.venues
          : expandedItem.show.venues.filter(v => selectedCities.has(v.theater_stad));
        return cityFiltered.length > 0 ? cityFiltered : expandedItem.show.venues;
      })()
    : [];

  return (
    <div>
      <div className="relative">
        <div
          ref={ref}
          onScroll={updateEdge}
          className="-mx-6 sm:-mx-10 px-6 sm:px-10 overflow-x-auto scrollbar-hide"
        >
          <div className="flex gap-3 snap-x snap-mandatory pb-2">
            {items.map(({ show, pill, key }) => (
              <SmallShowCard
                key={key}
                show={show}
                pill={pill}
                isFavorite={favorites.has(show.id)}
                isActive={expandedKey === key}
                onSelect={() => onSelect(key)}
                onToggleFav={() => onToggleFav(show.id)}
              />
            ))}
          </div>
        </div>

        {/* Pijltjes — alleen tonen als er meer is dan zichtbaar */}
        {items.length > 2 && (
          <>
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              disabled={edge.atStart}
              className="absolute top-1/2 -left-1 sm:-left-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
              aria-label="Vorige voorstellingen"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              disabled={edge.atEnd}
              className="absolute top-1/2 -right-1 sm:-right-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
              aria-label="Volgende voorstellingen"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {expandedItem && (
        <ShowDetailPanel
          show={expandedItem.show}
          venues={cityResolvedVenues}
          viewMonth={viewMonth}
          isFavorite={favorites.has(expandedItem.show.id)}
          onClose={() => onSelect(expandedItem.key)}
          onToggleFav={() => onToggleFav(expandedItem.show.id)}
        />
      )}
    </div>
  );
}
