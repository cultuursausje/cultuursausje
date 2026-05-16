"use client";

import { ExternalLink, MapPin } from "lucide-react";
import type { Theater } from "@/types";

interface Props {
  /** Alle theaters voor in de lijst, gegroepeerd per stad. */
  theaters: Theater[];
  /** Alleen de theaters die in voorstellingen genoemd worden — voor de map. */
  mentionedTheaters: Theater[];
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

function groupByCity(items: Theater[]): Array<[string, Theater[]]> {
  const m = new Map<string, Theater[]>();
  items.forEach(t => {
    const arr = m.get(t.stad) || [];
    arr.push(t);
    m.set(t.stad, arr);
  });
  return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0], "nl"));
}

function mapsLinkForTheater(theater: string, stad: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater + ", " + stad)}`;
}

function mapsEmbedForMentioned(mentioned: Theater[]): string {
  if (mentioned.length === 0) return "";
  // Multi-term zoekopdracht — Google laat zoekresultaten zien als pins
  const query = mentioned.map(t => `${t.naam} ${t.stad}`).join(", ");
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function TheatersSection({ theaters, mentionedTheaters }: Props) {
  const grouped = groupByCity(theaters);
  const mapUrl = mapsEmbedForMentioned(mentionedTheaters);

  return (
    <section className="relative -mx-6 px-6 py-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" style={{ background: "#E8EFFD" }}>
      <h2 className="font-display mb-3 text-3xl text-ink tracking-tight sm:text-4xl">
        Theaters
      </h2>
      <p className="mb-8 max-w-xl text-sm text-ink-muted">
        Plekken waar de voorstellingen spelen.
      </p>

      {/* Google Maps overzicht — alleen genoemde theaters */}
      {mapUrl && (
        <div className="mb-10 overflow-hidden rounded-3xl border border-line bg-white">
          <div className="aspect-[16/8]">
            <iframe
              src={mapUrl}
              className="block h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Theaters op de kaart"
            />
          </div>
        </div>
      )}

      {/* Tekst-lijst gegroepeerd per stad */}
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
              {list.map(t => (
                <div key={t.id}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-base font-bold text-ink hover:underline underline-offset-2"
                  >
                    {t.naam}
                    <ExternalLink size={12} className="text-ink-faint" />
                  </a>
                  {t.beschrijving && (
                    <p className="mt-0.5 text-sm text-ink-muted leading-snug">{t.beschrijving}</p>
                  )}
                  <a
                    href={mapsLinkForTheater(t.naam, t.stad)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-ink-faint hover:text-ink underline-offset-2 hover:underline"
                  >
                    <MapPin size={11} /> Op de kaart
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
