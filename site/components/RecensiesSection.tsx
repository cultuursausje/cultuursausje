"use client";

import { Star, ExternalLink } from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";

interface Props {
  shows: ShowDisplay[];
}

const WINDOW_DAYS = 14;
const MIN_SOURCES = 3;

/** Selecteer shows die in de afgelopen 14 dagen drie of meer recensies
 *  van verschillende bronnen hebben gekregen. Sorteer op recentste
 *  recensie eerst. Max 2 shows uitlichten. */
function pickFeatured(shows: ShowDisplay[]): Array<{
  show: ShowDisplay;
  quotes: ShowDisplay["pers_quotes"];
  mostRecentMs: number;
}> {
  const now = Date.now();
  const cutoff = now - WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const candidates = shows
    .map(show => {
      // Pak alleen recensies met een geldige datum binnen het venster
      const recent = show.pers_quotes.filter(q => {
        if (!q.date) return false;
        const t = new Date(q.date).getTime();
        return Number.isFinite(t) && t >= cutoff && t <= now;
      });
      // Tel unieke bronnen
      const sources = new Set(recent.map(q => q.bron));
      if (sources.size < MIN_SOURCES) return null;
      // Pak één recensie per unieke bron (recentste)
      const perBron = new Map<string, ShowDisplay["pers_quotes"][number]>();
      [...recent]
        .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
        .forEach(q => {
          if (!perBron.has(q.bron)) perBron.set(q.bron, q);
        });
      const quotes = Array.from(perBron.values());
      const mostRecentMs = Math.max(...quotes.map(q => new Date(q.date!).getTime()));
      return { show, quotes, mostRecentMs };
    })
    .filter((c): c is { show: ShowDisplay; quotes: ShowDisplay["pers_quotes"]; mostRecentMs: number } => c !== null)
    .sort((a, b) => b.mostRecentMs - a.mostRecentMs)
    .slice(0, 2);

  return candidates;
}

function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${d} ${months[m - 1]}`;
}

export function RecensiesSection({ shows }: Props) {
  const featured = pickFeatured(shows);

  // Geen kandidaten met 3+ recente bronnen — sectie helemaal verbergen
  if (featured.length === 0) return null;

  return (
    <section id="recensies" className="mb-12 sm:mb-16">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#5C2D9B" }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight sm:text-4xl">
          Net binnen — recensies
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/80">
          Voorstellingen die in de afgelopen twee weken door minstens drie verschillende bronnen zijn gerecenseerd.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {featured.map(({ show, quotes }) => {
            const photoBg = photoBgForShow(show.id);
            return (
              <div
                key={show.id}
                className="flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                {/* Card links — foto met titel-overlay */}
                <div className="relative w-full shrink-0 sm:w-36 md:w-40">
                  <div
                    className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl"
                    style={{ background: photoBg }}
                  >
                    {show.foto_url && (
                      <img
                        src={show.foto_url}
                        alt=""
                        className="absolute inset-0 block h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-white">
                      <div className="text-sm font-medium leading-tight line-clamp-2">
                        {show.titel}
                      </div>
                      <div className="mt-0.5 text-[10px] text-white/85 leading-tight line-clamp-1">
                        {show.gezelschap_display}
                      </div>
                    </div>
                    {show.foto_credit && (
                      <div className="absolute bottom-1 right-2 z-10 text-[9px] text-white/70 leading-none pointer-events-none">
                        © {show.foto_credit}
                      </div>
                    )}
                  </div>
                  {show.ticket_url && (
                    <a
                      href={show.ticket_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/85 hover:text-white underline-offset-2 hover:underline"
                    >
                      Naar voorstelling
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                {/* Recensies-box rechts */}
                <div
                  className="flex-1 rounded-2xl p-4 sm:p-5"
                  style={{ background: "#F1EFE8" }}
                >
                  <div className="space-y-3">
                    {quotes.map((q, i) => (
                      <div key={i} className={i > 0 ? "border-t border-white/70 pt-3" : ""}>
                        {q.sterren !== null && (
                          <div className="mb-1 flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                size={11}
                                className={idx < (q.sterren ?? 0)
                                  ? "fill-[#E5B53A] stroke-[#E5B53A]"
                                  : "stroke-line"}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-xs italic text-ink-soft leading-relaxed sm:text-sm">
                          &ldquo;{q.quote}&rdquo;
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-muted">
                          <span>— {q.bron}</span>
                          {q.date && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="lowercase">{formatShortDate(q.date)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
