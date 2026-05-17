"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";

interface Props {
  shows: ShowDisplay[];
}

const WINDOW_DAYS = 14;
const MIN_SOURCES = 3;
const HIGH_STAR = 4;
const INITIAL_QUOTES = 1;
const MAX_FEATURED = 5;
const PANEL_BG = "#F1EFE8";

interface Featured {
  show: ShowDisplay;
  quotes: ShowDisplay["pers_quotes"];
}

function pickFeatured(shows: ShowDisplay[]): Featured[] {
  const now = Date.now();
  const cutoff = now - WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const recent = shows
    .map(show => {
      const r = show.pers_quotes.filter(q => {
        if (!q.date) return false;
        const t = new Date(q.date).getTime();
        return Number.isFinite(t) && t >= cutoff && t <= now;
      });
      const sources = new Set(r.map(q => q.bron));
      if (sources.size < MIN_SOURCES) return null;
      const perBron = new Map<string, ShowDisplay["pers_quotes"][number]>();
      [...r].sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
        .forEach(q => { if (!perBron.has(q.bron)) perBron.set(q.bron, q); });
      const quotes = Array.from(perBron.values());
      const mostRecentMs = Math.max(...quotes.map(q => new Date(q.date!).getTime()));
      return { show, quotes, mostRecentMs };
    })
    .filter((c): c is { show: ShowDisplay; quotes: ShowDisplay["pers_quotes"]; mostRecentMs: number } => c !== null)
    .sort((a, b) => b.mostRecentMs - a.mostRecentMs);

  const fallback = shows
    .filter(s => {
      const endMs = new Date(s.speelperiode_end).getTime();
      return Number.isFinite(endMs) && endMs >= now;
    })
    .map(show => {
      const highRated = show.pers_quotes.filter(q => (q.sterren ?? 0) >= HIGH_STAR);
      const sources = new Set(highRated.map(q => q.bron));
      if (sources.size < MIN_SOURCES) return null;
      const perBron = new Map<string, ShowDisplay["pers_quotes"][number]>();
      highRated.forEach(q => { if (!perBron.has(q.bron)) perBron.set(q.bron, q); });
      const quotes = Array.from(perBron.values());
      const avgStars = quotes.reduce((s, q) => s + (q.sterren ?? 0), 0) / quotes.length;
      const premiereMs = new Date(show.speelperiode_start).getTime();
      return { show, quotes, avgStars, premiereMs };
    })
    .filter((c): c is { show: ShowDisplay; quotes: ShowDisplay["pers_quotes"]; avgStars: number; premiereMs: number } => c !== null)
    .sort((a, b) => b.avgStars - a.avgStars || a.premiereMs - b.premiereMs);

  const seen = new Set(recent.map(r => r.show.id));
  const combined: Featured[] = recent.map(({ show, quotes }) => ({ show, quotes }));
  for (const f of fallback) {
    if (seen.has(f.show.id)) continue;
    combined.push({ show: f.show, quotes: f.quotes });
    if (combined.length >= MAX_FEATURED) break;
  }
  return combined.slice(0, MAX_FEATURED);
}

function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${d} ${months[m - 1]}`;
}

function QuoteRow({ quote }: { quote: ShowDisplay["pers_quotes"][number] }) {
  const inner = (
    <>
      {quote.sterren !== null && (
        <div className="mb-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={11}
              className={idx < (quote.sterren ?? 0)
                ? "fill-[#E5B53A] stroke-[#E5B53A]"
                : "stroke-line"}
            />
          ))}
        </div>
      )}
      <p className="text-sm italic text-ink-soft leading-relaxed">
        &ldquo;{quote.quote}&rdquo;
      </p>
      <div className="mt-0.5 text-[11px] text-ink-muted inline-flex items-center gap-1">
        {quote.bron}
        {quote.date && (
          <>
            <span aria-hidden="true">·</span>
            <span className="lowercase">{formatShortDate(quote.date)}</span>
          </>
        )}
        {quote.url && <ExternalLink size={9} className="text-ink-faint" />}
      </div>
    </>
  );
  return quote.url ? (
    <a href={quote.url} target="_blank" rel="noreferrer" className="block hover:opacity-80 transition-opacity">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

export function RecensiesSection({ shows }: Props) {
  const featured = pickFeatured(shows);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Carousel scroll-state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ atStart: true, atEnd: false });
  const updateEdge = () => {
    const el = carouselRef.current;
    if (!el) return;
    setEdge({
      atStart: el.scrollLeft <= 0,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    });
  };
  useEffect(() => {
    const t = setTimeout(updateEdge, 50);
    return () => clearTimeout(t);
  }, [featured.length]);
  const scrollByCards = (dir: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  };

  if (featured.length === 0) return null;

  const toggleReviews = (id: string) => {
    setExpandedReviews(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <section id="recensies" className="mb-12 sm:mb-16">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#5C2D9B" }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight sm:text-4xl">
          Niet te missen voorstellingen
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/80">
          Voorstellingen met de meeste buzz dit seizoen, gemeten aan lovende recensies en uitverkochte speelperiodes.
        </p>

        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={updateEdge}
            className="-mx-6 sm:-mx-10 px-6 sm:px-10 overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-6 snap-x snap-mandatory pb-2 w-full">
              {featured.map(({ show, quotes }) => {
                const photoBg = photoBgForShow(show.id);
                const isOpenReviews = expandedReviews.has(show.id);
                const visible = isOpenReviews ? quotes : quotes.slice(0, INITIAL_QUOTES);
                return (
                  <div
                    key={show.id}
                    className="shrink-0 snap-start w-[88%] sm:w-[calc((100%-1.5rem)/2)] flex flex-col gap-4"
                  >
                    {/* Foto-card — niet klikbaar, statisch */}
                    <div
                      className="relative overflow-hidden rounded-2xl"
                      style={{ background: photoBg }}
                    >
                      <div className="relative aspect-[3/2]">
                        {show.foto_url && (
                          <img
                            src={show.foto_url}
                            alt={show.titel}
                            className="absolute inset-0 block h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <div className="text-xl font-medium leading-tight sm:text-2xl">
                            {show.titel}
                          </div>
                          <div className="mt-0.5 text-xs text-white/85 leading-tight">
                            {show.gezelschap_display}
                          </div>
                        </div>
                        {show.foto_credit && (
                          <div className="absolute bottom-1.5 right-2.5 z-10 text-[9px] text-white/70 leading-none pointer-events-none">
                            © {show.foto_credit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recensies-vlak (beige) onder de foto */}
                    <div
                      className="rounded-2xl p-4 sm:p-5 space-y-3"
                      style={{ background: PANEL_BG }}
                    >
                      {visible.map((q, i) => (
                        <QuoteRow key={i} quote={q} />
                      ))}
                      {quotes.length > INITIAL_QUOTES && (
                        <button
                          type="button"
                          onClick={() => toggleReviews(show.id)}
                          className="text-xs font-medium text-ink hover:underline underline-offset-2"
                        >
                          {isOpenReviews
                            ? "Minder recensies"
                            : `+${quotes.length - INITIAL_QUOTES} meer recensies`}
                        </button>
                      )}
                      {show.ticket_url && (
                        <a
                          href={show.ticket_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block pt-3 border-t border-white/70 text-xs font-medium text-ink hover:underline underline-offset-2 inline-flex items-center gap-1"
                        >
                          Naar de voorstelling op {show.gezelschap_display}
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {featured.length > 2 && (
            <>
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={edge.atStart}
                className="absolute top-32 -left-1 sm:-left-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
                aria-label="Vorige voorstellingen"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={edge.atEnd}
                className="absolute top-32 -right-1 sm:-right-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
                aria-label="Volgende voorstellingen"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
