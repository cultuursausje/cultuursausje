"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { Gezelschap } from "@/types";

interface Props {
  gezelschappen: Gezelschap[];
}

const INITIAL_COUNT = 6;

const COLORS = ["#FF3D8B", "#FF6B35", "#E5B53A", "#9BD43F", "#00B4FF", "#B85FFF", "#FF6FA8"];

function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return COLORS[Math.abs(h) % COLORS.length];
}

export function GezelschappenSection({ gezelschappen }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? gezelschappen : gezelschappen.slice(0, INITIAL_COUNT);

  return (
    <section className="mt-24">
      <h2 className="font-display mb-5 text-3xl text-ink tracking-tight sm:text-4xl">
        Gezelschappen & collectieven
      </h2>
      <p className="mb-6 max-w-xl text-sm text-ink-muted">
        De grootste theater­gezelschappen en theater­collectieven van Nederland.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(g => {
          const color = colorFor(g.id);
          return (
            <a
              key={g.id}
              href={g.url}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-3xl border border-line bg-white p-5 transition-transform duration-300 hover:scale-[1.015] hover:-rotate-[0.4deg]"
            >
              <div
                className="absolute top-0 left-0 h-1.5 w-full"
                style={{ background: color }}
              />
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
            </a>
          );
        })}
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
