"use client";

import { useState } from "react";
import { X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import type { Festival, ShowDisplay } from "@/types";

interface Props {
  festivals: Festival[];
  /** Reeds gefilterde shows (city/month/theater/gezelschap filters al toegepast) */
  shows: ShowDisplay[];
}

const INITIAL_COUNT = 4;

function showsForFestival(festival: Festival, shows: ShowDisplay[]): ShowDisplay[] {
  const keys = festival.match_keywords.map(k => k.toLowerCase());
  return shows.filter(s =>
    s.categorieen.some(c => keys.includes(c.toLowerCase()))
  );
}

export function FestivalsSection({ festivals, shows }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = expanded ? festivals : festivals.slice(0, INITIAL_COUNT);
  const open = openId ? festivals.find(f => f.id === openId) : null;
  const openShows = open ? showsForFestival(open, shows) : [];

  return (
    <section className="mt-20 sm:mt-24">
      {/* Prominent vlak met opvallende kleur */}
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#FF6FA8" }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight sm:text-4xl">
          Theaterfestivals
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/85">
          De grootste podiumkunstenfestivals van Nederland. Klik op een festival om de programma-voorstellingen te zien (op basis van je actieve filters).
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map(f => (
            <button
              key={f.id}
              onClick={() => setOpenId(f.id)}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl text-left transition-transform duration-300 hover:scale-[1.02] hover:-rotate-[0.6deg]"
              style={{ background: f.accent }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                  {f.periode} · {f.plaats}
                </div>
                <div>
                  <div className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                    {f.naam}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {festivals.length > INITIAL_COUNT && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              {expanded ? <>Minder <ChevronUp size={14} /></> : <>Bekijk meer <ChevronDown size={14} /></>}
            </button>
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <div
            className="mx-auto my-0 min-h-screen w-full bg-white sm:my-8 sm:min-h-0 sm:max-w-3xl sm:rounded-3xl sm:overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setOpenId(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EFE8] hover:bg-line transition-colors"
                aria-label="Sluiten"
              >
                <X size={18} />
              </button>
              {/* Carousel placeholder — gradient varianten van de accentkleur */}
              <div className="flex h-56 sm:h-64 snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                {(open.foto_urls && open.foto_urls.length > 0
                  ? open.foto_urls.map((url, i) => ({ kind: "img" as const, url, i }))
                  : [0, 1, 2].map(i => ({ kind: "ph" as const, url: "", i }))
                ).map((item) => (
                  <div
                    key={item.i}
                    className="snap-center shrink-0 w-full relative"
                    style={{ background: open.accent, minWidth: "100%" }}
                  >
                    {item.kind === "img" && (
                      <img src={item.url} alt="" className="absolute inset-0 block h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 flex items-end p-6 sm:p-8 text-white">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                          {open.periode} · {open.plaats}
                        </div>
                        <div className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">
                          {open.naam}
                        </div>
                      </div>
                    </div>
                    {open.foto_credit && item.kind === "img" && (
                      <div className="absolute bottom-2 right-3 text-[10px] text-white/80 leading-none">
                        © {open.foto_credit}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm text-ink-soft leading-relaxed">{open.beschrijving}</p>
              {open.url && (
                <a
                  href={open.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink underline-offset-2 underline"
                >
                  Naar festival-website <ExternalLink size={11} />
                </a>
              )}
            </div>
            <div className="border-t border-line p-6 sm:p-8">
              <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-muted">
                Voorstellingen tijdens dit festival
              </h4>
              {openShows.length === 0 ? (
                <p className="text-sm text-ink-muted italic">
                  Geen voorstellingen voor dit festival in de huidige selectie. Wis je filters of kies een andere stad.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {openShows.map(s => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-line p-4"
                    >
                      <div className="text-base font-medium text-ink leading-tight">
                        {s.titel}
                      </div>
                      <div className="mt-1 text-xs text-ink-muted">
                        {s.gezelschap_display} · {s.theater_display}
                      </div>
                      {s.korte_samenvatting && (
                        <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3">
                          {s.korte_samenvatting}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
