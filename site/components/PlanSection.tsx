"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Festival, ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";
import { ShowDetailPanel } from "./ShowCard";
import { FestivalModal } from "./FestivalModal";
import { useT, useLang, monthLabelLang, monthShortLang, translatePeriode, type Lang } from "@/lib/i18n";

interface Props {
  shows: ShowDisplay[];
  festivals: Festival[];
  favorites: Set<string>;
  onToggleFav: (id: string) => void;
}

const MONTHS_NL: Record<string, number> = {
  januari: 1, februari: 2, maart: 3, april: 4, mei: 5, juni: 6,
  juli: 7, augustus: 8, september: 9, oktober: 10, november: 11, december: 12
};

function parsePeriode(periode: string): { start: number; end: number } {
  const parts = periode.toLowerCase().split(/[–-]/).map(s => s.trim());
  const findMonth = (text: string): number => {
    for (const [name, num] of Object.entries(MONTHS_NL)) {
      if (text.includes(name)) return num;
    }
    return 12;
  };
  const start = findMonth(parts[0]);
  const end = parts[1] ? findMonth(parts[1]) : start;
  return { start, end };
}

function fmtDate(iso: string, lang: Lang): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${monthShortLang(m - 1, lang)}`;
}
function fmtDateLong(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${monthLabelLang(y, m - 1, lang).split(" ")[0]}`;
}

export function PlanSection({ shows, festivals, favorites, onToggleFav }: Props) {
  const t = useT();
  const { lang } = useLang();
  const [city, setCity] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [englishOnly, setEnglishOnly] = useState<boolean>(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);
  const [openFestivalId, setOpenFestivalId] = useState<string | null>(null);

  const cityRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

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

  // Reset expanded show + open festival wanneer filters wijzigen
  useEffect(() => {
    setExpandedShowId(null);
    setOpenFestivalId(null);
  }, [city, date, englishOnly]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => s.venues.forEach(v => v.theater_stad && set.add(v.theater_stad)));
    // Ook steden waar festivals plaatsvinden meenemen — `f.plaats` kan een
    // enkele stad zijn ("Amsterdam") of een lijst ("Rotterdam, Den Haag, ...").
    festivals.forEach(f => {
      f.plaats.split(/[,/]/).forEach(part => {
        const stad = part.trim();
        if (stad) set.add(stad);
      });
    });
    return Array.from(set).sort((a, b) =>
      a.replace(/^[^a-zA-Z]+/, "").localeCompare(b.replace(/^[^a-zA-Z]+/, ""), "nl")
    );
  }, [shows, festivals]);

  const datesWithShows = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => s.venues.forEach(v => {
      if (v.theater_stad === city) v.speeldata.forEach(d => set.add(d));
    }));
    // Voor festivals weten we de exacte dagen niet — alleen de maand-range.
    // Markeer alle dagen van de gedekte maanden voor de geselecteerde stad,
    // zodat de gebruiker iets te kiezen heeft op de kalender.
    if (city) {
      const cityLower = city.toLowerCase();
      const year = new Date().getFullYear();
      festivals.forEach(f => {
        if (!f.plaats.toLowerCase().includes(cityLower)) return;
        const { start, end } = parsePeriode(f.periode);
        for (let m = start; m <= end; m++) {
          const daysInMonth = new Date(year, m, 0).getDate();
          for (let d = 1; d <= daysInMonth; d++) {
            set.add(`${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
          }
        }
      });
    }
    return set;
  }, [shows, festivals, city]);

  const showResults = useMemo(() => {
    if (!date || !city) return [];
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

  const festivalResults = useMemo(() => {
    if (!date || !city) return [];
    const [, mStr] = date.split("-");
    const month = parseInt(mStr, 10);
    const cityLower = city.toLowerCase();
    return festivals.filter(f => {
      if (!f.plaats.toLowerCase().includes(cityLower)) return false;
      const periode = parsePeriode(f.periode);
      return month >= periode.start && month <= periode.end;
    });
  }, [festivals, city, date]);

  const expandedShow = expandedShowId ? showResults.find(r => r.show.id === expandedShowId) : null;
  const expandedShowVenues = expandedShow
    ? expandedShow.show.venues.filter(v => v.theater_stad === city)
    : [];

  const totalResults = showResults.length + festivalResults.length;
  const viewMonth = date ? (() => {
    const [y, m] = date.split("-").map(Number);
    return { year: y, monthIdx: m - 1 };
  })() : undefined;

  // Carousel scroll-state voor pijltjes
  const carouselRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ atStart: true, atEnd: false });
  const updateEdge = () => {
    const el = carouselRef.current;
    if (!el) return;
    setEdge({
      atStart: el.scrollLeft <= 0,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    });
  };
  useEffect(() => {
    const t = setTimeout(updateEdge, 50);
    return () => clearTimeout(t);
  }, [totalResults]);
  const scrollByCards = (dir: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 304, behavior: "smooth" });
  };

  const openFestival = openFestivalId ? festivalResults.find(f => f.id === openFestivalId) : null;

  return (
    <>
    <section id="plan" className="mt-20 sm:mt-24">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#FF8A6E" }}
      >
        <h2 className="font-display mb-3 text-3xl text-ink tracking-tight sm:text-4xl">
          {t("section.plan.title")}
        </h2>
        <p className="mb-6 max-w-xl text-sm text-ink-soft">
          {t("section.plan.subtitle")}
        </p>

        <div className="flex flex-wrap items-end gap-x-3 gap-y-3">
          {/* Stap 1 — stad-pill */}
          <div ref={cityRef} className="relative">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-ink/70">
              {t("plan.step1")}
            </div>
            <button
              onClick={() => setCityOpen(v => !v)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                city
                  ? "bg-ink text-white hover:bg-black"
                  : "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
              }`}
            >
              {city || t("filter.pickCity")}
              <ChevronDown size={14} />
            </button>
            {cityOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-white shadow-xl overflow-hidden">
                <div className="max-h-72 overflow-y-auto p-2">
                  <button
                    onClick={() => { setCity(""); setCityOpen(false); setDate(""); }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg italic transition-colors ${
                      !city ? "bg-[#F1EFE8] text-ink font-medium" : "text-ink-soft hover:bg-[#F8F6EF]"
                    }`}
                  >
                    {t("filter.none")}
                  </button>
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

          {/* Stap 2 — datum-pill (alleen actief als stad gekozen is) */}
          <div ref={dateRef} className="relative">
            <div className={`mb-1 text-[10px] font-semibold uppercase tracking-widest ${city ? "text-ink/70" : "text-ink/35"}`}>
              {t("plan.step2")}
            </div>
            <button
              onClick={() => setDateOpen(v => !v)}
              disabled={!city}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                date
                  ? "bg-ink text-white hover:bg-black"
                  : city
                    ? "bg-white border border-line text-ink-soft hover:bg-[#F8F6EF]"
                    : "bg-white/60 border border-line/60 text-ink-soft/50 cursor-not-allowed"
              }`}
            >
              {date ? fmtDate(date, lang) : t("filter.pickDate")}
              <ChevronDown size={14} />
            </button>
            {dateOpen && (
              <CalendarPopover
                value={date}
                datesWithShows={datesWithShows}
                lang={lang}
                onSelect={d => { setDate(d); setDateOpen(false); }}
                onClose={() => setDateOpen(false)}
              />
            )}
          </div>

          {/* Optioneel — English friendly toggle */}
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-ink/70">
              {t("plan.optional")}
            </div>
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
        </div>

        {city && date && (
          <div className="mt-6">
            {totalResults === 0 ? (
              <div className="py-4 text-sm text-ink-soft">
                {t("plan.noResultsFor")} {city} {t("plan.on")} {fmtDateLong(date, lang)}
                {englishOnly ? ` ${t("plan.withEnglish")}` : ""}.
              </div>
            ) : (
              <>
                <div className="relative">
                  <div
                    ref={carouselRef}
                    onScroll={updateEdge}
                    className="-mx-6 sm:-mx-10 px-6 sm:px-10 overflow-x-auto scrollbar-hide"
                  >
                    <div className="flex gap-4 snap-x snap-mandatory pb-2 w-full">
                  {/* Voorstelling-cards — click-to-expand */}
                  {showResults.map(({ show, venue }) => {
                    const photoBg = photoBgForShow(show.id);
                    const isActive = expandedShowId === show.id;
                    return (
                      <button
                        key={show.id}
                        type="button"
                        onClick={() => setExpandedShowId(prev => prev === show.id ? null : show.id)}
                        className={`group relative shrink-0 snap-start w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] overflow-hidden rounded-2xl text-left transition-all ${
                          isActive
                            ? "scale-[1.02]"
                            : "hover:scale-[1.02] hover:-rotate-[0.6deg]"
                        }`}
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
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
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-white">
                            <div className="text-sm font-medium leading-tight line-clamp-2">
                              {show.titel}
                            </div>
                            {venue && (
                              <div className="mt-0.5 text-[10px] text-white/85 leading-tight line-clamp-1">
                                {venue.theater_naam}
                              </div>
                            )}
                          </div>
                          {show.foto_url && (
                            <div className="absolute bottom-1 right-2 z-10 text-[9px] text-white/70 leading-none pointer-events-none">
                              © {show.foto_credit || show.gezelschap_display}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Festival-cards — openen dezelfde modal als in de Theaterfestivals-sectie */}
                  {festivalResults.map(f => {
                    const hero = f.foto_urls?.[0];
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setOpenFestivalId(f.id)}
                        className="group relative shrink-0 snap-start w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] overflow-hidden rounded-2xl text-left transition-transform hover:scale-[1.02] hover:-rotate-[0.6deg]"
                        style={{ background: f.accent }}
                      >
                        <div className="relative aspect-[4/5]">
                          {hero && (
                            <img
                              src={hero}
                              alt=""
                              className="absolute inset-0 block h-full w-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                          <div className="pointer-events-none absolute top-2 left-2 flex flex-wrap gap-1">
                            <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink">
                              {t("festival.pill")}
                            </span>
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-white">
                            <div className="text-sm font-medium leading-tight line-clamp-2">
                              {f.naam}
                            </div>
                            <div className="mt-0.5 text-[10px] text-white/85 leading-tight line-clamp-1">
                              {translatePeriode(f.periode, lang)} · {f.plaats}
                            </div>
                          </div>
                          {hero && f.foto_credit && (
                            <div className="absolute bottom-1 right-2 z-10 text-[9px] text-white/70 leading-none pointer-events-none">
                              © {f.foto_credit}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                    </div>
                  </div>
                  {totalResults > 4 && (
                    <>
                      <button
                        type="button"
                        onClick={() => scrollByCards(-1)}
                        disabled={edge.atStart}
                        className="absolute top-1/2 -left-1 sm:-left-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
                        aria-label="Vorige"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollByCards(1)}
                        disabled={edge.atEnd}
                        className="absolute top-1/2 -right-1 sm:-right-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
                        aria-label="Volgende"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {expandedShow && (
                  <ShowDetailPanel
                    show={expandedShow.show}
                    venues={expandedShowVenues.length > 0 ? expandedShowVenues : expandedShow.show.venues}
                    viewMonth={viewMonth}
                    isFavorite={favorites.has(expandedShow.show.id)}
                    onClose={() => setExpandedShowId(null)}
                    onToggleFav={() => onToggleFav(expandedShow.show.id)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>

    {openFestival && (
      <FestivalModal
        festival={openFestival}
        shows={shows}
        onClose={() => setOpenFestivalId(null)}
      />
    )}
    </>
  );
}

interface CalendarProps {
  value: string;
  datesWithShows: Set<string>;
  lang: Lang;
  onSelect: (iso: string) => void;
  onClose: () => void;
}

function CalendarPopover({ value, datesWithShows, lang, onSelect, onClose }: CalendarProps) {
  const initial = value ? new Date(value + "T12:00:00") : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells: Array<number | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <>
      {/* Donker overlay achter de kalender, alleen op mobiel. Tap = sluiten. */}
      <div
        className="fixed inset-0 z-40 bg-black/40 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="
          z-50 rounded-2xl border border-line bg-white p-3 shadow-xl
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(20rem,calc(100vw-2rem))]
          sm:absolute sm:left-0 sm:top-full sm:translate-x-0 sm:translate-y-0 sm:mt-2 sm:w-72
        "
        onClick={e => e.stopPropagation()}
      >
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#F8F6EF]" aria-label="Vorige maand">
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-medium text-ink capitalize">
          {monthLabelLang(viewYear, viewMonth, lang)}
        </span>
        <button type="button" onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#F8F6EF]" aria-label="Volgende maand">
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {(lang === "en"
          ? ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
          : ["ma", "di", "wo", "do", "vr", "za", "zo"]
        ).map(d => (
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
    </>
  );
}
