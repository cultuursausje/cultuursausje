"use client";

import { useEffect, useMemo, useState } from "react";
import { ShowCard } from "./ShowCard";
import { FilterSidebar } from "./FilterSidebar";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { monthsToShow, monthLabel, monthKey, pillForMonth } from "@/lib/dates";
import type { ShowDisplay, Theater, Gezelschap } from "@/types";

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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTheaters, setSelectedTheaters] = useState<Set<string>>(new Set());
  const [selectedGezelschappen, setSelectedGezelschappen] = useState<Set<string>>(new Set());

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
    return shows.filter(s => {
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
      return true;
    });
  }, [shows, showFavoritesOnly, favorites, selectedTheaters, selectedGezelschappen]);

  const months: MonthGroup[] = useMemo(() => {
    const list = monthsToShow(filteredShows);
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
  }, [filteredShows]);

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

  const hasActiveFilter =
    showFavoritesOnly || selectedTheaters.size > 0 || selectedGezelschappen.size > 0;
  const clearAllFilters = () => {
    setShowFavoritesOnly(false);
    setSelectedTheaters(new Set());
    setSelectedGezelschappen(new Set());
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
      />

      {months.length === 0 ? (
        <div className="rounded-3xl border border-line bg-white p-10 text-center text-ink-muted">
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
                          ? "col-span-2 sm:col-span-3 md:col-span-3 xl:col-span-3 row-span-3"
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
