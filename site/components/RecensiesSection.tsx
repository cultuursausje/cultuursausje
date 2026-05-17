"use client";

import { useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";

interface Props {
  shows: ShowDisplay[];
}

const WINDOW_DAYS = 14;
const MIN_SOURCES = 3;
const HIGH_STAR = 4;
const INITIAL_QUOTES = 2;

interface Featured {
  show: ShowDisplay;
  quotes: ShowDisplay["pers_quotes"];
}

function pickFeatured(shows: ShowDisplay[]): Featured[] {
  const now = Date.now();
  const cutoff = now - WINDOW_DAYS * 24 * 60 * 60 * 1000;

  // Primair — recente recensies (≤14 dagen)
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
    .sort((a, b) => b.mostRecentMs - a.mostRecentMs)
    .slice(0, 2);

  if (recent.length > 0) {
    return recent.map(({ show, quotes }) => ({ show, quotes }));
  }

  // Fallback — aankomende voorstellingen met hoge waarderingen (reprise-quotes)
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
    .sort((a, b) => b.avgStars - a.avgStars || a.premiereMs - b.premiereMs)
    .slice(0, 2);

  return fallback.map(({ show, quotes }) => ({ show, quotes }));
}

function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${d} ${months[m - 1]}`;
}

interface QuoteProps {
  quote: ShowDisplay["pers_quotes"][number];
}

function QuoteRow({ quote }: QuoteProps) {
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
                : "stroke-white/30"}
            />
          ))}
        </div>
      )}
      <p className="text-sm italic text-white leading-relaxed">
        &ldquo;{quote.quote}&rdquo;
      </p>
      <div className="mt-0.5 text-[11px] text-white/70 inline-flex items-center gap-1">
        {quote.bron}
        {quote.date && (
          <>
            <span aria-hidden="true">·</span>
            <span className="lowercase">{formatShortDate(quote.date)}</span>
          </>
        )}
        {quote.url && <ExternalLink size={9} className="text-white/60" />}
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (featured.length === 0) return null;

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
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
          Voorstellingen met de meeste buzz dit seizoen, gemeten aan lovende recensies en doorlopende uitverkochte speelperiodes.
        </p>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {featured.map(({ show, quotes }) => {
            const photoBg = photoBgForShow(show.id);
            const isOpen = expanded.has(show.id);
            const visible = isOpen ? quotes : quotes.slice(0, INITIAL_QUOTES);
            return (
              <div key={show.id} className="flex flex-col gap-4">
                {/* Brede card bovenin, landscape verhouding */}
                <a
                  href={show.ticket_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-2xl transition-transform hover:scale-[1.01]"
                  style={{ background: photoBg }}
                >
                  <div className="relative aspect-[3/2]">
                    {show.foto_url && (
                      <img
                        src={show.foto_url}
                        alt=""
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
                </a>

                {/* Recensies eronder, geen los vlak */}
                <div className="space-y-4">
                  {visible.map((q, i) => (
                    <QuoteRow key={i} quote={q} />
                  ))}
                  {quotes.length > INITIAL_QUOTES && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(show.id)}
                      className="text-xs font-medium text-white hover:underline underline-offset-2"
                    >
                      {isOpen
                        ? "Minder recensies"
                        : `+${quotes.length - INITIAL_QUOTES} meer recensies`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
