"use client";

import { ExternalLink } from "lucide-react";
import type { Gezelschap } from "@/types";

interface Props {
  gezelschappen: Gezelschap[];
}

const CITY_COLORS = ["#FF1A6B", "#FF6B35", "#2D4DEB", "#00B4FF", "#B85FFF", "#FF3D8B", "#00B488", "#E5B53A"];

function colorForCity(city: string): string {
  let h = 0;
  for (let i = 0; i < city.length; i++) {
    h = (h << 5) - h + city.charCodeAt(i);
    h |= 0;
  }
  return CITY_COLORS[Math.abs(h) % CITY_COLORS.length];
}

function groupByCity(items: Gezelschap[]): Array<[string, Gezelschap[]]> {
  const m = new Map<string, Gezelschap[]>();
  items.forEach(g => {
    const arr = m.get(g.stad) || [];
    arr.push(g);
    m.set(g.stad, arr);
  });
  return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0], "nl"));
}

export function GezelschappenSection({ gezelschappen }: Props) {
  const grouped = groupByCity(gezelschappen);

  return (
    <section className="relative -mx-6 px-6 py-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" style={{ background: "#EDF6E8" }}>
      <h2 className="font-display mb-3 text-3xl text-ink tracking-tight sm:text-4xl">
        Gezelschappen & collectieven
      </h2>
      <p className="mb-8 max-w-xl text-sm text-ink-muted">
        De grootste theatergezelschappen en theatercollectieven van Nederland.
      </p>

      <div className="space-y-10">
        {grouped.map(([city, list]) => (
          <div key={city}>
            <h3
              className="mb-5 text-xl font-bold tracking-tight sm:text-2xl"
              style={{ color: colorForCity(city) }}
            >
              {city}
            </h3>
            <div className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
              {list.map(g => (
                <div key={g.id}>
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-base font-bold text-ink hover:underline underline-offset-2"
                  >
                    {g.naam}
                    <ExternalLink size={12} className="text-ink-faint" />
                  </a>
                  <div className="mt-0.5 text-xs text-ink-faint">{g.type}</div>
                  {g.beschrijving && (
                    <p className="mt-1 text-sm text-ink-muted leading-snug">{g.beschrijving}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
