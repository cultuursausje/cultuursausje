"use client";

import { useState } from "react";
import { ExternalLink, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import type { Theater } from "@/types";
import { useT } from "@/lib/i18n";
import { isNotBelgianCity } from "@/lib/locations";

interface Props {
  /** Alle theaters voor in de lijst, gegroepeerd per stad. */
  theaters: Theater[];
  /** Alleen de theaters die in voorstellingen genoemd worden (niet gebruikt nu, behouden voor API-compat). */
  mentionedTheaters: Theater[];
}

const CITY_COLORS = ["#FF5722", "#FF3B7C", "#1A1A18", "#2D4DEB", "#FFFFFF", "#5C2D9B", "#FF8A6E", "#E8849A"];

function colorForCity(city: string): string {
  let h = 0;
  for (let i = 0; i < city.length; i++) {
    h = (h << 5) - h + city.charCodeAt(i);
    h |= 0;
  }
  return CITY_COLORS[Math.abs(h) % CITY_COLORS.length];
}

function groupByCity(items: Theater[]): Array<[string, Theater[]]> {
  const m = new Map<string, Theater[]>();
  items.forEach(t => {
    const arr = m.get(t.stad) || [];
    arr.push(t);
    m.set(t.stad, arr);
  });
  // Sorteer per stad alfabetisch + items binnen elke stad alfabetisch.
  // Steden die met een leesteken beginnen (bv. 's-Hertogenbosch) sorteren
  // op hun eerste letter (dus onder S).
  return Array.from(m.entries())
    .sort(([a], [b]) =>
      a.replace(/^[^a-zA-Z]+/, "").localeCompare(b.replace(/^[^a-zA-Z]+/, ""), "nl")
    )
    .map(([city, list]) => [
      city,
      [...list].sort((x, y) => x.naam.localeCompare(y.naam, "nl"))
    ] as [string, Theater[]]);
}

function mapsLinkForTheater(theater: string, stad: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater + ", " + stad)}`;
}

const INITIAL_CITY_COUNT = 3;

export function TheatersSection({ theaters }: Props) {
  const t = useT();
  // Theaters in Belgische steden (bv. NTGent in Gent) verschijnen niet in
  // de Theaters-sectie — Cultuursausje richt zich op het Nederlandse
  // theaterlandschap.
  const nlTheaters = theaters.filter(th => isNotBelgianCity(th.stad));
  const grouped = groupByCity(nlTheaters);
  const [expanded, setExpanded] = useState(false);
  const visibleCities = expanded ? grouped : grouped.slice(0, INITIAL_CITY_COUNT);
  const hasMore = grouped.length > INITIAL_CITY_COUNT;

  return (
    <section id="theaters" className="mt-20 sm:mt-24">
      <div
        className="rounded-3xl px-6 pt-10 pb-8 sm:px-10 sm:pt-14 sm:pb-10"
        style={{ background: "#C7DC2D" }}
      >
        <h2 className="font-display mb-3 text-3xl text-ink tracking-tight sm:text-4xl">
          {t("section.theaters.title")}
        </h2>
        <p className="mb-8 max-w-xl text-sm text-ink-soft">
          {t("section.theaters.subtitle")}
        </p>

        <div className="space-y-10">
          {visibleCities.map(([city, list]) => (
            <div key={city}>
              <h3
                className="mb-5 text-xl font-bold tracking-tight sm:text-2xl"
                style={{ color: colorForCity(city) }}
              >
                {city}
              </h3>
              <div className="grid grid-cols-1 gap-x-12 gap-y-3 md:grid-cols-2">
                {list.map(th => (
                  <div key={th.id}>
                    <a
                      href={th.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-base font-bold text-ink hover:underline underline-offset-2"
                    >
                      {th.naam}
                      <ExternalLink size={12} className="text-ink-soft" />
                    </a>
                    <a
                      href={mapsLinkForTheater(th.naam, th.stad)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink underline-offset-2 hover:underline"
                    >
                      <MapPin size={11} /> {t("theater.onMap")}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              {expanded ? <>{t("button.less")} <ChevronUp size={14} /></> : <>{t("button.seeMore")} <ChevronDown size={14} /></>}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
