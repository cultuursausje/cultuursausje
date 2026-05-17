"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";

interface Props {
  shows: ShowDisplay[];
}

export function PlanSection({ shows }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [city, setCity] = useState<string>("Amsterdam");
  const [date, setDate] = useState<string>("");
  const [englishOnly, setEnglishOnly] = useState<boolean>(false);

  // Steden waar voorstellingen plaatsvinden (alfabetisch)
  const cities = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => s.venues.forEach(v => v.theater_stad && set.add(v.theater_stad)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "nl"));
  }, [shows]);

  // Zoekresultaten — alleen wanneer datum is ingevuld
  const results = useMemo(() => {
    if (!date) return [];
    return shows
      .filter(s => {
        if (englishOnly && !s.english_friendly) return false;
        const hit = s.venues.some(v => v.theater_stad === city && v.speeldata.some(d => d === date));
        return hit;
      })
      .map(s => {
        const venue = s.venues.find(v => v.theater_stad === city && v.speeldata.some(d => d === date));
        return { show: s, venue };
      });
  }, [shows, city, date, englishOnly]);

  return (
    <section id="plan" className="mt-20 sm:mt-24">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#FF8A6E" }}
      >
        <h2 className="font-display mb-3 text-3xl text-ink tracking-tight sm:text-4xl">
          Plan je theateravond
        </h2>
        <p className="mb-8 max-w-xl text-sm text-ink-soft">
          Geef je stad, datum en eventueel English friendly door — dan toont 'ie welke voorstellingen die avond aansluiten.
        </p>

        <div className="rounded-2xl bg-white p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="block text-xs">
              <span className="mb-1 block font-medium text-ink-muted uppercase tracking-wider">Stad</span>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs">
              <span className="mb-1 block font-medium text-ink-muted uppercase tracking-wider">Datum</span>
              <input
                type="date"
                value={date}
                min={today}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink sm:pb-2">
              <input
                type="checkbox"
                checked={englishOnly}
                onChange={e => setEnglishOnly(e.target.checked)}
                className="h-4 w-4 rounded border-line text-ink focus:ring-ink/20"
              />
              <span aria-hidden="true">🇬🇧</span>
              English friendly
            </label>
          </div>
        </div>

        {date && (
          <div className="mt-6">
            {results.length === 0 ? (
              <div className="rounded-2xl bg-white/70 p-5 text-center text-sm text-ink-soft">
                Geen voorstellingen gevonden voor {city} op{" "}
                {new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
                {englishOnly ? " met English friendly" : ""}.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map(({ show, venue }) => {
                  const photoBg = photoBgForShow(show.id);
                  return (
                    <a
                      key={show.id}
                      href={show.ticket_url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block overflow-hidden rounded-2xl text-left transition-transform hover:scale-[1.02]"
                      style={{ background: photoBg }}
                    >
                      <div className="relative aspect-[3/4]">
                        {show.foto_url && (
                          <img
                            src={show.foto_url}
                            alt=""
                            className="absolute inset-0 block h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="pointer-events-none absolute top-2 left-2 flex flex-wrap gap-1">
                          <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink capitalize">
                            {show.categorieen.some(c => c.toLowerCase().includes("dans")) ? "dans" : "toneel"}
                          </span>
                          {show.english_friendly && (
                            <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink inline-flex items-center gap-1">
                              <span aria-hidden="true">🇬🇧</span>
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <div className="text-sm font-medium leading-tight line-clamp-2">
                            {show.titel}
                          </div>
                          {venue && (
                            <div className="mt-0.5 text-[10px] text-white/85 leading-tight line-clamp-1">
                              {venue.theater_naam}
                            </div>
                          )}
                        </div>
                      </div>
                      {show.ticket_url && (
                        <div className="flex items-center gap-1 px-3 py-2 text-[11px] text-ink-soft bg-white">
                          Naar voorstelling
                          <ExternalLink size={11} />
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
