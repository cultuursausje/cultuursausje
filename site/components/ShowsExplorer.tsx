"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { ShowCard, ExpandedContent } from "./ShowCard";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { monthsToShow, monthLabel, monthKey, pillForMonth } from "@/lib/dates";
import { accentForShow, photoBgForShow } from "@/lib/colors";
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

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

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
    if (expanded) return;
    setFlipped(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const expandedShowId = expanded ? expanded.split("--")[0] : null;
  const expandedShow = expandedShowId ? shows.find(s => s.id === expandedShowId) : null;

  if (months.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center text-ink-muted">
        Geen voorstellingen om te tonen. Voeg er toe in je data of pas de filters aan.
      </div>
    );
  }

  return (
    <>
      <LayoutGroup>
        <div className="space-y-12 sm:space-y-16">
          {months.map(group => (
            <section key={monthKey(group.year, group.monthIdx)}>
              <h2 className="font-display mb-5 text-3xl text-ink tracking-tight sm:text-4xl">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:auto-rows-[1fr] lg:grid-cols-3">
                {group.shows.map(({ show, pill }) => {
                  const key = `${show.id}--${monthKey(group.year, group.monthIdx)}`;
                  const isExpandedHere = expanded === key;
                  return (
                    <ShowCard
                      key={key}
                      show={show}
                      pill={pill}
                      monthKey={key}
                      isFlipped={flipped.has(key)}
                      isExpanded={isExpandedHere && !isMobile}
                      isFavorite={favorites.has(show.id)}
                      isMobile={isMobile}
                      onFlip={() => toggleFlip(key)}
                      onExpand={() => setExpanded(key)}
                      onCollapse={() => { setExpanded(null); setFlipped(new Set()); }}
                      onToggleFav={() => toggleFav(show.id)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </LayoutGroup>

      {/* Mobile fullscreen modal */}
      <AnimatePresence>
        {expandedShow && isMobile && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ExpandedContent
              show={expandedShow}
              pill={pillFromKey(expandedShow, expanded!)}
              accent={accentForShow(expandedShow.id)}
              photoBg={photoBgForShow(expandedShow.id)}
              hasPhoto={!!expandedShow.foto_url}
              isFavorite={favorites.has(expandedShow.id)}
              onClose={() => setExpanded(null)}
              onToggleFav={() => toggleFav(expandedShow.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function pillFromKey(show: ShowDisplay, key: string): string {
  const parts = key.split("--");
  const monthPart = parts[1] ?? show.speelperiode_start.slice(0, 7);
  const [y, m] = monthPart.split("-").map(Number);
  return pillForMonth(show.speelperiode_start, show.speelperiode_end, y, m - 1) ?? "";
}
