"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { Gezelschap } from "@/types";

interface Props {
  gezelschappen: Gezelschap[];
}

const INITIAL_COUNT = 6;

export function GezelschappenSection({ gezelschappen }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? gezelschappen : gezelschappen.slice(0, INITIAL_COUNT);

  return (
    <section className="relative -mx-6 px-6 py-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" style={{ background: "#EDF6E8" }}>
      <h2 className="font-display mb-3 text-3xl text-ink tracking-tight sm:text-4xl">
        Gezelschappen & collectieven
      </h2>
      <p className="mb-8 max-w-xl text-sm text-ink-muted">
        De grootste theatergezelschappen en theatercollectieven van Nederland.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(g => (
          <a
            key={g.id}
            href={g.url}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-line bg-white transition-transform duration-300 hover:scale-[1.015] hover:-rotate-[0.4deg]"
          >
            {/* Logo box */}
            <div className="relative flex h-32 items-center justify-center bg-[#F8F6EF] p-6">
              {g.logo_url ? (
                <img
                  src={g.logo_url}
                  alt={`${g.naam} logo`}
                  className="block max-h-full max-w-[80%] object-contain"
                />
              ) : (
                <div className="text-xl font-medium text-ink-faint">{g.afkorting}</div>
              )}
              {g.logo_credit && (
                <div className="absolute bottom-1.5 right-2 text-[9px] text-ink-faint leading-none">
                  © {g.logo_credit}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-medium text-ink leading-tight">{g.naam}</h3>
                <ExternalLink size={14} className="text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
              </div>
              <div className="text-xs text-ink-muted mb-3">
                {g.stad} · {g.type}
              </div>
              {g.beschrijving && (
                <p className="text-sm text-ink-soft leading-relaxed line-clamp-3">
                  {g.beschrijving}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {gezelschappen.length > INITIAL_COUNT && (
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
