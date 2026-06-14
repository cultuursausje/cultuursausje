"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Instagram } from "lucide-react";
import { SmallShowCard, ShowDetailPanel } from "./ShowCard";
import { useT, useLang, monthLabelLang, pillForMonthLang, translatePeriode } from "@/lib/i18n";
import { isNotBelgianCity } from "@/lib/locations";
import { RecensiesSection } from "./RecensiesSection";
import { FestivalsSection } from "./FestivalsSection";
import { FestivalModal } from "./FestivalModal";
import { PlanSection } from "./PlanSection";
import { VoordeelSection } from "./VoordeelSection";
import { GezelschappenSection } from "./GezelschappenSection";
import { TheatersSection } from "./TheatersSection";
import { InspiringQuote } from "./InspiringQuote";
import { inspiringQuotes } from "@/data/inspiringQuotes";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { monthKey } from "@/lib/dates";
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
  const t = useT();
  const { lang } = useLang();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openFestivalId, setOpenFestivalId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Filter state — Amsterdam standaard geselecteerd
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
  // Belgische steden worden uitgesloten: Cultuursausje richt zich op NL.
  const citiesWithShows = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => {
      s.venues.forEach(v => {
        if (v.theater_stad && isNotBelgianCity(v.theater_stad)) set.add(v.theater_stad);
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

  // Maanden voor navigatie — opgebouwd uit de echte venue-speeldata van elke show,
  // gefilterd op de geselecteerde steden. Een show verschijnt alleen in een maand
  // als minstens één van zijn venues (in een geselecteerde stad) speeldata in die
  // maand heeft.
  const monthsForNav: MonthGroup[] = useMemo(() => {
    type Bucket = { year: number; monthIdx: number; entries: { show: ShowDisplay; days: number[] }[] };
    const buckets = new Map<string, Bucket>();

    filteredShowsForNav.forEach(show => {
      // Verzamel dagen per "YYYY-MM" uit de venues binnen de stad-selectie
      const perMonth = new Map<string, number[]>();
      show.venues.forEach(v => {
        if (selectedCities.size > 0 && !selectedCities.has(v.theater_stad)) return;
        v.speeldata.forEach(d => {
          if (typeof d !== "string" || d.length < 10) return;
          const ym = d.slice(0, 7);
          const day = parseInt(d.slice(8, 10), 10);
          if (Number.isNaN(day)) return;
          const arr = perMonth.get(ym) ?? [];
          arr.push(day);
          perMonth.set(ym, arr);
        });
      });

      perMonth.forEach((days, ym) => {
        const year = parseInt(ym.slice(0, 4), 10);
        const monthIdx = parseInt(ym.slice(5, 7), 10) - 1;
        const bucket = buckets.get(ym) ?? { year, monthIdx, entries: [] };
        bucket.entries.push({ show, days });
        buckets.set(ym, bucket);
      });
    });

    // Verbergen wat in het verleden ligt (maand < huidige maand van vandaag)
    const today = new Date();
    const curY = today.getFullYear();
    const curM = today.getMonth();

    return Array.from(buckets.values())
      .filter(b => b.year > curY || (b.year === curY && b.monthIdx >= curM))
      .sort((a, b) => a.year - b.year || a.monthIdx - b.monthIdx)
      .map(b => {
        const sorted = [...b.entries].sort((x, y) => Math.min(...x.days) - Math.min(...y.days));
        return {
          year: b.year,
          monthIdx: b.monthIdx,
          label: monthLabelLang(b.year, b.monthIdx, lang),
          shows: sorted.map(({ show, days }) => {
            const uniqueSorted = Array.from(new Set(days)).sort((a, b) => a - b);
            const minD = uniqueSorted[0];
            const maxD = uniqueSorted[uniqueSorted.length - 1];
            const mm = String(b.monthIdx + 1).padStart(2, "0");
            const minIso = `${b.year}-${mm}-${String(minD).padStart(2, "0")}`;
            const maxIso = `${b.year}-${mm}-${String(maxD).padStart(2, "0")}`;
            const pill = pillForMonthLang(minIso, maxIso, b.year, b.monthIdx, lang) ?? `${minD} ${b.monthIdx}`;
            return { show, pill };
          })
        };
      });
  }, [filteredShowsForNav, selectedCities, lang]);

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
        // Pak alle speeldata uit alle venues (zonder city-filter voor favorieten)
        const allDates = show.venues.flatMap(v => v.speeldata).filter(d => typeof d === "string" && d.length >= 10).sort();
        if (allDates.length === 0) {
          return { show, pill: "", sortKey: show.speelperiode_start || "9999-99" };
        }
        const minIso = allDates[0];
        const maxIso = allDates[allDates.length - 1];
        const [y, m] = minIso.split("-").map(Number);
        const pill = pillForMonthLang(minIso, maxIso, y, m - 1, lang) ?? "";
        return { show, pill, sortKey: minIso };
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ show, pill }) => ({ show, pill }));
  }, [showFavoritesOnly, filteredShowsForNav, favorites, lang]);

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
      <RecensiesSection shows={shows} />

      <InspiringQuote {...inspiringQuotes[0]} />

      <PlanSection
        shows={shows}
        festivals={festivals}
        favorites={favorites}
        onToggleFav={toggleFav}
      />

      <InspiringQuote {...inspiringQuotes[1]} />

      <section id="voorstellingen" className="mt-20 sm:mt-24">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#FFE600" }}
      >
      {/* Sectietitel + filter chips */}
      <h2 className="font-display mb-2 text-3xl text-ink tracking-tight sm:text-4xl">
        {t("section.voorstellingen.title")}
      </h2>
      <p className="mb-6 max-w-xl text-sm text-ink-soft">
        {t("section.voorstellingen.subtitle")}
      </p>

      <div className="mb-8 flex flex-wrap items-center gap-2 sm:mb-10">
        {/* Stad-dropdown — single-select, gelijke stijl als bij Plan */}
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
              {selectedCities.size === 1 ? Array.from(selectedCities)[0] : t("filter.pickCity")}
            </span>
            <ChevronDown size={14} />
          </button>
          {cityOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-white shadow-xl overflow-hidden">
              <div className="max-h-72 overflow-y-auto p-2">
                <button
                  onClick={() => { setSelectedCities(new Set()); setCityOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg italic transition-colors ${
                    selectedCities.size === 0
                      ? "bg-[#F1EFE8] text-ink font-medium"
                      : "text-ink-soft hover:bg-[#F8F6EF]"
                  }`}
                >
                  {t("filter.none")}
                </button>
                {Array.from(citiesWithShows).sort((a, b) =>
                  a.replace(/^[^a-zA-Z]+/, "").localeCompare(b.replace(/^[^a-zA-Z]+/, ""), "nl")
                ).map(city => {
                  const isActive = selectedCities.has(city);
                  return (
                    <button
                      key={city}
                      onClick={() => { setSelectedCities(new Set([city])); setCityOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#F1EFE8] text-ink font-medium"
                          : "text-ink-soft hover:bg-[#F8F6EF]"
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}
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
            <span>{t("carousel.prevMonth")} {prevMonth.label}</span>
          </button>
        )}
        {nextMonth && (
          <button
            onClick={() => setCurrentMonthIndex(i => Math.min(monthsForNav.length - 1, i + 1))}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:bg-[#F8F6EF] transition-colors"
          >
            <span>{t("carousel.nextMonth")} {nextMonth.label}</span>
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
          <div className="text-base text-ink">{t("empty.noCity.title")}</div>
          <div className="mt-2 text-sm text-ink-soft">
            {t("empty.noCity.subtitle")}
          </div>
        </div>
      ) : monthsForNav.length === 0 ? (
        <div className="px-2 py-6 text-center text-ink-soft">
          {hasActiveFilter ? (
            <>
              <div className="text-base text-ink">{t("empty.noShowsFilters")}</div>
              <button
                onClick={clearAllFilters}
                className="block mx-auto mt-3 text-sm text-ink underline-offset-2 underline hover:no-underline"
              >
                {t("empty.clearFilters")}
              </button>
            </>
          ) : (
            <div className="text-base text-ink">{t("empty.noShowsMonth")}</div>
          )}
        </div>
      ) : showFavoritesOnly ? (
        // Favorieten-view: alle gelikte shows in één carousel, zonder maand-kop.
        allFavoritedShows.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <div className="text-base text-ink">{t("empty.noFavorites.title")}</div>
            <div className="mt-2 text-sm text-ink-soft">
              {t("empty.noFavorites.subtitle")}
            </div>
          </div>
        ) : (
          <ShowCarousel
            items={allFavoritedShows.map(({ show, pill }): CarouselItem => ({
              kind: "show",
              show, pill,
              key: `${show.id}--fav`
            }))}
            expandedKey={expanded}
            favorites={favorites}
            selectedCities={selectedCities}
            onSelect={(key) => setExpanded(prev => prev === key ? null : key)}
            onToggleFav={(id) => toggleFav(id)}
            onFestivalSelect={(id) => setOpenFestivalId(id)}
          />
        )
      ) : currentMonth ? (
        <div>
          <h3 className="font-display mb-4 text-3xl text-ink tracking-tight sm:text-4xl">
            {currentMonth.label.charAt(0).toUpperCase() + currentMonth.label.slice(1)}
          </h3>
          {(() => {
            // Bouw de gemengde items-lijst: eerst festival-kaarten voor
            // festivals die deze maand spelen in de gekozen stad/steden,
            // daarna alle reguliere show-kaarten. Festivals krijgen
            // voorrang omdat ze vaak meerdere voorstellingen bundelen.
            const festivalItems: CarouselItem[] = festivalsForMonth(
              festivals, currentMonth.year, currentMonth.monthIdx, selectedCities
            ).map((f): CarouselItem => ({
              kind: "festival",
              festival: f,
              key: `festival-${f.id}--${monthKey(currentMonth.year, currentMonth.monthIdx)}`
            }));
            const showItems: CarouselItem[] = currentMonthShows.map(({ show, pill }): CarouselItem => ({
              kind: "show",
              show, pill,
              key: `${show.id}--${monthKey(currentMonth.year, currentMonth.monthIdx)}`
            }));
            const allItems = [...festivalItems, ...showItems];
            if (allItems.length === 0) {
              return (
                <div className="px-2 py-6 text-center">
                  <div className="text-base text-ink">{t("empty.noShowsMonth")}</div>
                </div>
              );
            }
            return (
              <ShowCarousel
                items={allItems}
                expandedKey={expanded}
                favorites={favorites}
                selectedCities={selectedCities}
                viewMonth={{ year: currentMonth.year, monthIdx: currentMonth.monthIdx }}
                onSelect={(key) => setExpanded(prev => prev === key ? null : key)}
                onToggleFav={(id) => toggleFav(id)}
                onFestivalSelect={(id) => setOpenFestivalId(id)}
              />
            );
          })()}
        </div>
      ) : null}
      </div>
      </section>

      <InspiringQuote {...inspiringQuotes[2]} />

      {/* Extra secties — staan altijd onderaan de pagina, ongeacht stad-selectie */}
      <FestivalsSection festivals={festivals} shows={filteredShows} />

      <InspiringQuote {...inspiringQuotes[3]} />

      <VoordeelSection />

      <InspiringQuote {...inspiringQuotes[4]} />

      {/* Gezelschappen + Theaters — paired side-by-side op desktop met natuurlijke
          hoogtes (geen stretch). Op mobiel stapelen ze met hun normale mt-20.
          Wanneer ze gestapeld zijn (< lg) verschijnt er een quote tussen de
          twee secties; op desktop staan beide quotes onderaan. */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-stretch">
        <GezelschappenSection gezelschappen={allGezelschappen} />
        <div className="lg:hidden">
          <InspiringQuote {...inspiringQuotes[5]} />
        </div>
        <TheatersSection theaters={allTheaters} mentionedTheaters={theaters} />
      </div>

      <div className="hidden lg:block lg:mt-8">
        <InspiringQuote {...inspiringQuotes[5]} />
      </div>
      <InspiringQuote {...inspiringQuotes[6]} />

      {/* Cultuursausje-zegel — onderaan de pagina, lichtjes naar rechts
          gekanteld. Bij hover een subtiele beweging + scherpe gele
          TL-gloed (bottle-sticker class in globals.css). Daarnaast een
          link naar Instagram. */}
      <div className="mt-2 mb-2 flex items-center justify-center gap-4 sm:gap-6">
        <a
          href="https://instagram.com/cultuursausje"
          target="_blank"
          rel="noreferrer"
          aria-label="Cultuursausje op Instagram"
          className="text-ink"
        >
          <Instagram size={28} strokeWidth={2} />
        </a>
        <img
          src="/cultuursausje-bottle.png"
          alt="Cultuursausje"
          className="bottle-sticker w-40 sm:w-48"
        />
      </div>

      {/* Festival-modal — geopend wanneer er op een festival-kaart in de
          "alle voorstellingen"-rij wordt geklikt. Gebruikt dezelfde modal
          als de Theaterfestivals-sectie zodat de uitklap-ervaring met
          voorstellingen-carousel identiek is. */}
      {openFestivalId && (() => {
        const f = festivals.find(x => x.id === openFestivalId);
        if (!f) return null;
        return (
          <FestivalModal
            festival={f}
            shows={shows}
            onClose={() => setOpenFestivalId(null)}
          />
        );
      })()}
    </>
  );
}

// ── Carousel ────────────────────────────────────────────────────────────────
// Eén rij met kleine voorstellingscards + pijltjes; opent een detail-paneel
// onder de rij wanneer je op een card klikt.

/** Discriminated union — een carousel-item is óf een show-kaart óf een
 *  festival-kaart. Festival-kaarten verschijnen in dezelfde rij als de
 *  reguliere voorstellingen, zodat bezoekers in één blik zien wat er
 *  een gegeven maand allemaal speelt (inclusief grote festivals). */
type CarouselItem =
  | { kind: "show"; show: ShowDisplay; pill: string; key: string }
  | { kind: "festival"; festival: Festival; key: string };

const MONTHS_NL_LOOKUP: Record<string, number> = {
  januari: 1, februari: 2, maart: 3, april: 4, mei: 5, juni: 6,
  juli: 7, augustus: 8, september: 9, oktober: 10, november: 11, december: 12
};

function parseFestivalPeriode(periode: string): { start: number; end: number } {
  const parts = periode.toLowerCase().split(/[–-]/).map(s => s.trim());
  const findMonth = (text: string): number => {
    for (const [name, num] of Object.entries(MONTHS_NL_LOOKUP)) {
      if (text.includes(name)) return num;
    }
    return 12;
  };
  const start = findMonth(parts[0]);
  const end = parts[1] ? findMonth(parts[1]) : start;
  return { start, end };
}

/** Festivals die in de actieve maand spelen in een van de geselecteerde
 *  steden. Voor festivals met `periode_start`/`periode_end` gebruiken we
 *  ISO-datum-overlap (precies); voor festivals zonder die velden vallen
 *  we terug op maand-parsing van het `periode`-tekstveld. */
function festivalsForMonth(
  festivals: Festival[],
  year: number,
  monthIdx: number,
  selectedCities: Set<string>
): Festival[] {
  const m = monthIdx + 1;
  const monthStartMs = new Date(year, monthIdx, 1).getTime();
  const monthEndMs = new Date(year, monthIdx + 1, 0, 23, 59, 59).getTime();
  return festivals.filter(f => {
    if (selectedCities.size > 0) {
      const plaatsLower = f.plaats.toLowerCase();
      const cityMatch = Array.from(selectedCities).some(c =>
        plaatsLower.includes(c.toLowerCase())
      );
      if (!cityMatch) return false;
    }
    if (f.periode_start && f.periode_end) {
      const startMs = new Date(f.periode_start + "T00:00:00").getTime();
      const endMs = new Date(f.periode_end + "T23:59:59").getTime();
      return startMs <= monthEndMs && endMs >= monthStartMs;
    }
    const parsed = parseFestivalPeriode(f.periode);
    return m >= parsed.start && m <= parsed.end;
  });
}

interface ShowCarouselProps {
  items: CarouselItem[];
  expandedKey: string | null;
  favorites: Set<string>;
  selectedCities: Set<string>;
  viewMonth?: { year: number; monthIdx: number };
  onSelect: (key: string) => void;
  onToggleFav: (id: string) => void;
  /** Wanneer een festival-kaart wordt geklikt — opent de FestivalModal
   *  buiten dit component. */
  onFestivalSelect: (festivalId: string) => void;
}

function ShowCarousel({
  items, expandedKey, favorites, selectedCities, viewMonth, onSelect, onToggleFav, onFestivalSelect
}: ShowCarouselProps) {
  const { lang } = useLang();
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
    const cardWidth = 288 + 16; // lg-breedte + gap-4
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  // Voor het detail-paneel onder de carousel: alleen show-items kunnen
  // uitgeklapt zijn (festival-kaarten openen een eigen modal).
  const expandedItem = items.find(it => it.key === expandedKey && it.kind === "show") as
    | (CarouselItem & { kind: "show" })
    | undefined;
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
          <div className="flex gap-4 snap-x snap-mandatory pb-2 w-full">
            {items.map(item => {
              if (item.kind === "festival") {
                const f = item.festival;
                const hero = f.foto_urls?.[0];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onFestivalSelect(f.id)}
                    className="group relative shrink-0 snap-start w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] overflow-hidden rounded-2xl text-left transition-transform hover:scale-[1.02] hover:-rotate-[0.6deg]"
                    style={{ background: f.accent }}
                  >
                    <div className="relative aspect-[4/5]">
                      {hero && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={hero}
                          alt=""
                          className="absolute inset-0 block h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      <div className="pointer-events-none absolute top-2 left-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink">
                          Festival
                        </span>
                        {f.english_friendly && (
                          <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink inline-flex items-center gap-1">
                            <span aria-hidden="true">🇬🇧</span>
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-white">
                        <div className="text-sm font-medium leading-tight line-clamp-2">
                          {f.naam}
                        </div>
                        <div className="mt-0.5 text-[10px] text-white/85 leading-tight line-clamp-1">
                          {translatePeriode(f.periode, lang)} · {f.plaats}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              }
              return (
                <SmallShowCard
                  key={item.key}
                  show={item.show}
                  pill={item.pill}
                  isFavorite={favorites.has(item.show.id)}
                  isActive={expandedKey === item.key}
                  onSelect={() => onSelect(item.key)}
                  onToggleFav={() => onToggleFav(item.show.id)}
                />
              );
            })}
            {/* Trailing spacer — geeft de laatste kaart ademruimte aan de
                rechterkant, gelijk aan de padding aan de linkerkant van het
                scroll-paneel. Zonder dit plakt de laatste kaart tegen de
                rand omdat browsers padding-right vaak negeren bij overflow. */}
            <div className="shrink-0 w-6 sm:w-10" aria-hidden="true" />
          </div>
        </div>
        {items.length > 4 && !edge.atStart && (
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="absolute top-1/2 -left-1 sm:-left-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition sm:flex"
            aria-label="Vorige voorstellingen"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {items.length > 4 && !edge.atEnd && (
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="absolute top-1/2 -right-1 sm:-right-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition sm:flex"
            aria-label="Volgende voorstellingen"
          >
            <ChevronRight size={18} />
          </button>
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
