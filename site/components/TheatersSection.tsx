"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, MapPin } from "lucide-react";
import { photoBgForShow } from "@/lib/colors";
import type { Theater } from "@/types";

interface Props {
  theaters: Theater[];
}

const INITIAL_COUNT = 6;

function mapsLink(theater: string, stad: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater + ", " + stad)}`;
}

function mapsOverviewEmbed(theaters: Theater[]): string {
  // Embed centered op Amsterdam, met zoek-query die meerdere theaters toont
  // Gebruikt query string die meerdere venues benoemt
  const stad = theaters[0]?.stad || "Amsterdam";
  return `https://maps.google.com/maps?q=${encodeURIComponent("theater " + stad)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
}

export function TheatersSection({ theaters }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? theaters : theaters.slice(0, INITIAL_COUNT);

  return (
    <section className="relative -mx-6 px-6 py-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" style={{ background: "#E8EFFD" }}>
      <h2 className="font-display mb-3 text-3xl text-ink tracking-tight sm:text-4xl">
        Theaters
      </h2>
      <p className="mb-8 max-w-xl text-sm text-ink-muted">
        Plekken waar de voorstellingen spelen.
      </p>

      {/* Google Maps overzicht van theaters */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-line bg-white">
        <div className="aspect-[16/8]">
          <iframe
            src={mapsOverviewEmbed(theaters)}
            className="block h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Overzicht van theaters"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(t => {
          const photoBg = photoBgForShow(t.id);
          return (
            <div
              key={t.id}
              className="group relative overflow-hidden rounded-3xl border border-line bg-white transition-transform duration-300 hover:scale-[1.015] hover:-rotate-[0.4deg]"
            >
              {/* Foto / placeholder */}
              <div
                className="relative flex h-40 items-end p-4"
                style={{ background: photoBg }}
              >
                {t.foto_url && (
                  <img
                    src={t.foto_url}
                    alt={`${t.naam} foto`}
                    className="absolute inset-0 block h-full w-full object-cover"
                  />
                )}
                <div className="relative z-10 text-white">
                  <div className="text-lg font-medium leading-tight tracking-tight">
                    {t.afkorting !== t.naam ? t.afkorting : t.naam}
                  </div>
                </div>
                {t.foto_credit && (
                  <div className="absolute bottom-1.5 right-2 z-10 text-[9px] text-white/80 leading-none">
                    © {t.foto_credit}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-base font-medium text-ink leading-tight">{t.naam}</h3>
                <div className="mt-1 text-xs text-ink-muted">{t.stad}</div>
                {t.beschrijving && (
                  <p className="mt-3 text-sm text-ink-soft leading-relaxed line-clamp-3">
                    {t.beschrijving}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  {t.url && (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-ink-muted hover:text-ink underline-offset-2 hover:underline"
                    >
                      Website <ExternalLink size={11} />
                    </a>
                  )}
                  <a
                    href={mapsLink(t.naam, t.stad)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-ink-muted hover:text-ink underline-offset-2 hover:underline"
                  >
                    <MapPin size={11} /> Op de kaart
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {theaters.length > INITIAL_COUNT && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setExpanded(v => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:bg-[#F8F6EF] transition-colors"
          >
            {expanded ? <>Minder <ChevronUp size={14} /></> : <>Bekijk meer <ChevronDown size={14} /></>}
          </button>
        </div>
      )}
    </section>
  );
}
