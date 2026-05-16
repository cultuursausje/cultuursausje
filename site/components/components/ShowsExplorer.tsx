"use client";

import { useEffect, useMemo, useState } from "react";
import { ShowCard } from "./ShowCard";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { monthsToShow, monthLabel, monthKey, pillForMonth } from "@/lib/dates";
import type { ShowDisplay } from "@/types";

interface Props {
  shows: ShowDisplay[];
}

interface MonthGroup {
  year: number;
  monthIdx: number;
  label: string;
  shows: { show: ShowDisplay; pill: string }[];
}

export function ShowsExplorer({ shows }: Props) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const months: MonthGroup[] = useMemo(() => {
    const list = monthsToShow(shows);
    return list.map(({ year, monthIdx }) => {
      const items = shows
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
  }, [shows]);

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleFlip = (key: string) => {
    // Als er een card uitgevergroot is: sluit die eerst en flip de nieuwe.
    if (expanded) {
      setExpanded(null);
      setFlipped(new Set([key]));
      return;
    }
    // Anders: alleen deze card flippen (alle andere unflip).
    setFlipped(prev => prev.has(key) ? new Set() : new Set([key]));
  };

  if (months.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center text-ink-muted">
        Geen voorstellingen om te tonen. Voeg er toe in je data of pas de filters aan.
      </div>
    );
  }

  return (
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
  );
}
