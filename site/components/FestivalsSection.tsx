"use client";

import { useState } from "react";
import { X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import type { Festival, ShowDisplay } from "@/types";

interface Props {
  festivals: Festival[];
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
    <section className="mt-24">
      <h2 className="font-display mb-5 text-3xl text-ink tracking-tight sm:text-4xl">
        Theaterfestivals
      </h2>
      <p className="mb-6 max-w-xl text-sm text-ink-muted">
        De grootste podiumkunstenfestivals van Nederland. Klik op een festival om de programma-voorstellingen te zien.
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
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:bg-[#F8F6EF] transition-colors"
          >
            {expanded ? <>Minder <ChevronUp size={14} /></> : <>Bekijk meer <ChevronDown size={14} /></>}
          </button>
        </div>
      )}

      {/* Festival detail modal */}
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
              <div
                className="h-40 sm:h-48 flex items-end p-6 sm:p-8 text-white"
                style={{ background: open.accent }}
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                    {open.periode} · {open.plaats}
                  </div>
                  <h3 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">
                    {open.naam}
                  </h3>
                </div>
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
                  Nog geen voorstellingen voor dit festival in onze agenda.
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
