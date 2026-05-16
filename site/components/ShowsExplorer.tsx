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
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());

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
  }, [shows, showFavoritesOnly, favorites, selectedTheaters, selectedGezelschappen, selectedMonths]);

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
    selectedMonths.size > 0;
  const clearAllFilters = () => {
    setShowFavoritesOnly(false);
    setSelectedTheaters(new Set());
    setSelectedGezelschappen(new Set());
    setSelectedMonths(new Set());
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

      {months.length === 0 ? (
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
