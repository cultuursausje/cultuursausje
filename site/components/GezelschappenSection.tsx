"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import type { Gezelschap } from "@/types";
import { useT, useLang, translateGezelschapType } from "@/lib/i18n";

interface Props {
  gezelschappen: Gezelschap[];
}

const CITY_COLORS = ["#FFE600", "#FF3B7C", "#FFFFFF", "#FF5722", "#C7DC2D", "#FFB7C8", "#FF8A6E", "#C8B5DE"];

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
  return Array.from(m.entries())
    .sort(([a], [b]) =>
      a.replace(/^[^a-zA-Z]+/, "").localeCompare(b.replace(/^[^a-zA-Z]+/, ""), "nl")
    )
    .map(([city, list]) => [
      city,
      [...list].sort((x, y) => x.naam.localeCompare(y.naam, "nl"))
    ] as [string, Gezelschap[]]);
}

const INITIAL_CITY_COUNT = 2;

export function GezelschappenSection({ gezelschappen }: Props) {
  const t = useT();
  const { lang } = useLang();
  const grouped = groupByCity(gezelschappen);
  const [expanded, setExpanded] = useState(false);
  const visibleCities = expanded ? grouped : grouped.slice(0, INITIAL_CITY_COUNT);
  const hasMore = grouped.length > INITIAL_CITY_COUNT;

  return (
    <section id="gezelschappen" className="mt-20 sm:mt-24">
      <div
        className="rounded-3xl px-6 pt-10 pb-8 sm:px-10 sm:pt-14 sm:pb-10"
        style={{ background: "#2D4DEB" }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight sm:text-4xl">
          {t("section.gezelschappen.title")}
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/80">
          {t("section.gezelschappen.subtitle")}
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
                {list.map(g => (
                  <div key={g.id}>
                    <a
                      href={g.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-base font-bold text-white hover:underline underline-offset-2"
                    >
                      {g.naam}
                      <ExternalLink size={12} className="text-white/70" />
                    </a>
                    <div className="mt-0.5 text-xs text-white/75">{translateGezelschapType(g.type, lang)}</div>
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
