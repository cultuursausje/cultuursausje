"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";

interface Props {
  shows: ShowDisplay[];
}

const MONTH_NAMES = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];
const SHORT_MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${SHORT_MONTHS[m - 1]}`;
}
function fmtDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTH_NAMES[m - 1]}`;
}

export function PlanSection({ shows }: Props) {
  const [city, setCity] = useState<string>("Amsterdam");
  const [date, setDate] = useState<string>("");
  const [englishOnly, setEnglishOnly] = useState<boolean>(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Sluit dropdowns bij klik buiten
  useEffect(() => {
    if (!cityOpen && !dateOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (cityOpen && cityRef.current && !cityRef.current.contains(t)) setCityOpen(false);
      if (dateOpen && dateRef.current && !dateRef.current.contains(t)) setDateOpen(false);
    };
    const tt = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => { clearTimeout(tt); document.removeEventListener("click", handler); };
  }, [cityOpen, dateOpen]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => s.venues.forEach(v => v.theater_stad && set.add(v.theater_stad)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "nl"));
  }, [shows]);

  // ISO-datums waarop iets speelt in de geselecteerde stad
  const datesWithShows = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => s.venues.forEach(v => {
      if (v.theater_stad === city) v.speeldata.forEach(d => set.add(d));
    }));
    return set;
  }, [shows, city]);

  const results = useMemo(() => {
    if (!date) return [];
    return shows
      .filter(s => {
        if (englishOnly && !s.english_friendly) return false;
        return s.venues.some(v => v.theater_stad === city && v.speeldata.some(d => d === date));
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
        <p className="mb-6 max-w-xl text-sm text-ink-soft">
          Kies een stad en datum — eventueel met English friendly — en zie welke voorstellingen die avond aansluiten.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stad-pill */}
          <div ref={cityRef} className="relative">
            <button
              onClick={() => setCityOpen(v => !v)}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
            >
              {city}
              <ChevronDown size={14} />
            </button>
            {cityOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-white shadow-xl overflow-hidden">
                <div className="max-h-72 overflow-y-auto p-2">
                  {cities.map(c => {
                    const active = c === city;
                    return (
                      <button
                        key={c}
                        onClick={() => { setCity(c); setCityOpen(false); setDate(""); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          active ? "bg-[#F1EFE8] text-ink font-medium" : "text-ink-soft hover:bg-[#F8F6EF]"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Datum-pill met calendar-popover */}
          <div ref={dateRef} className="relative">
            <button
              onClick={() => setDateOpen(v => !v)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                date
                  ? "bg-ink text-white hover:bg-black"
                  : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
              }`}
            >
              {date ? fmtDate(date) : "Kies een datum"}
              <ChevronDown size={14} />
            </button>
            {dateOpen && (
              <CalendarPopover
                value={date}
                datesWithShows={datesWithShows}
                onSelect={d => { setDate(d); setDateOpen(false); }}
              />
            )}
          </div>

          {/* English friendly toggle-pill */}
          <button
            onClick={() => setEnglishOnly(v => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              englishOnly
                ? "bg-ink text-white hover:bg-black"
                : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
            }`}
          >
            <span aria-hidden="true">🇬🇧</span>
            English friendly
          </button>
        </div>

        {date && (
          <div className="mt-6">
            {results.length === 0 ? (
              <div className="py-4 text-sm text-ink-soft">
                Geen voorstellingen gevonden voor {city} op {fmtDateLong(date)}
                {englishOnly ? " met English friendly" : ""}.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {results.map(({ show, venue }) => {
                  const photoBg = photoBgForShow(show.id);
                  return (
                    <a
                      key={show.id}
                      href={show.ticket_url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block overflow-hidden rounded-2xl transition-transform hover:scale-[1.02]"
                      style={{ background: photoBg }}
                    >
                      <div className="relative aspect-[4/5]">
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

// ── Calendar-popover met dots voor dagen met voorstellingen ────────────────

interface CalendarProps {
  value: string;
  datesWithShows: Set<string>;
  onSelect: (iso: string) => void;
}

function CalendarPopover({ value, datesWithShows, onSelect }: CalendarProps) {
  const initial = value
    ? new Date(value + "T12:00:00")
    : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  // Maandag eerst — getDay() geeft 0=zo, dus shift met +6 mod 7
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells: Array<number | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-line bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#F8F6EF]"
          aria-label="Vorige maand"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-medium text-ink capitalize">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#F8F6EF]"
          aria-label="Volgende maand"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["ma", "di", "wo", "do", "vr", "za", "zo"].map(d => (
          <div key={d} className="text-center text-[10px] font-medium uppercase tracking-wider text-ink-faint">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isPast = iso < todayIso;
          const hasShow = datesWithShows.has(iso);
          const isSelected = value === iso;
          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(iso)}
              className={`relative h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                isSelected
                  ? "bg-ink text-white"
                  : isPast
                    ? "text-ink-faint/50 cursor-not-allowed"
                    : "text-ink hover:bg-[#F1EFE8]"
              }`}
            >
              <span className="leading-none">{day}</span>
              {hasShow && (
                <span
                  className={`mt-0.5 h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-ink"}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
