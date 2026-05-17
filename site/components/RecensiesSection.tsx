"use client";

import { Star, ExternalLink } from "lucide-react";
import type { ShowDisplay } from "@/types";

interface Props {
  shows: ShowDisplay[];
}

/** Selecteert ~2 shows met sterke recensies waarvan de premiere het
 *  dichtst bij vandaag ligt — currently playing of net gepremiered. */
function pickFeatured(shows: ShowDisplay[]): Array<{ show: ShowDisplay; quote: ShowDisplay["pers_quotes"][number] }> {
  const todayMs = Date.now();
  const candidates = shows
    .filter(s => s.pers_quotes.length > 0)
    .map(s => {
      const best = [...s.pers_quotes].sort(
        (a, b) => (b.sterren ?? 0) - (a.sterren ?? 0)
      )[0];
      const premiereMs = new Date(s.speelperiode_start).getTime();
      return { show: s, quote: best, premiereMs };
    })
    .filter(c => Number.isFinite(c.premiereMs))
    .sort((a, b) => Math.abs(todayMs - a.premiereMs) - Math.abs(todayMs - b.premiereMs))
    .slice(0, 2);

  return candidates.map(({ show, quote }) => ({ show, quote }));
}

export function RecensiesSection({ shows }: Props) {
  const featured = pickFeatured(shows);

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
          Een paar uitgelichte recensies van voorstellingen die nu spelen of net gepremiered hebben.
        </p>

        {featured.length === 0 ? (
          <p className="text-sm text-white/70 italic">
            Nog geen recensies om uit te lichten.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map(({ show, quote }) => (
              <div
                key={show.id}
                className="rounded-2xl p-5 sm:p-6 flex flex-col"
                style={{ background: "#F1EFE8" }}
              >
                {quote.sterren !== null && (
                  <div className="mb-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className={idx < (quote.sterren ?? 0)
                          ? "fill-[#E5B53A] stroke-[#E5B53A]"
                          : "stroke-line"}
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm italic text-ink leading-relaxed sm:text-base">
                  &ldquo;{quote.quote}&rdquo;
                </p>
                <div className="mt-2 text-xs text-ink-muted">— {quote.bron}</div>

                {/* Show-meta onderaan */}
                <div className="mt-4 pt-4 border-t border-white/70 flex items-center gap-3">
                  {show.foto_url && (
                    <img
                      src={show.foto_url}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink truncate">
                      {show.titel}
                    </div>
                    <div className="text-xs text-ink-muted truncate">
                      {show.gezelschap_display}
                    </div>
                  </div>
                  {show.ticket_url && (
                    <a
                      href={show.ticket_url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 flex items-center gap-1 text-xs text-ink-muted hover:text-ink underline-offset-2 hover:underline"
                      aria-label={`Naar ${show.titel}`}
                    >
                      Zie voorstelling
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
