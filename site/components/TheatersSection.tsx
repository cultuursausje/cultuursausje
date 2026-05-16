"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, MapPin } from "lucide-react";
import type { Theater } from "@/types";

interface Props {
  theaters: Theater[];
}

const INITIAL_COUNT = 6;

const COLORS = ["#2D4DEB", "#FF3D8B", "#E5B53A", "#9BD43F", "#FF6B35", "#B85FFF", "#00B4FF"];

function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return COLORS[Math.abs(h) % COLORS.length];
}

function mapsLink(theater: string, stad: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater + ", " + stad)}`;
}

export function TheatersSection({ theaters }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? theaters : theaters.slice(0, INITIAL_COUNT);

  return (
    <section className="mt-24">
      <h2 className="font-display mb-5 text-3xl text-ink tracking-tight sm:text-4xl">
        Theaters
      </h2>
      <p className="mb-6 max-w-xl text-sm text-ink-muted">
        Plekken waar de voorstellingen spelen.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(t => {
          const color = colorFor(t.id);
          return (
            <div
              key={t.id}
              className="group relative overflow-hidden rounded-3xl border border-line bg-white p-5 transition-transform duration-300 hover:scale-[1.015] hover:-rotate-[0.4deg]"
            >
              <div
                className="absolute top-0 left-0 h-1.5 w-full"
                style={{ background: color }}
              />
              <h3 className="text-base font-medium text-ink leading-tight">{t.naam}</h3>
              <div className="mt-1 text-xs text-ink-muted">
                {t.stad}
              </div>
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
