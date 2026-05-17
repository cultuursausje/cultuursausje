"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, ExternalLink, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import type { Festival, FestivalShow, ShowDisplay } from "@/types";
import { useT } from "@/lib/i18n";

interface Props {
  festivals: Festival[];
  /** Reeds gefilterde shows (city/month/theater/gezelschap filters al toegepast) */
  shows: ShowDisplay[];
}

/** Genormaliseerde shape voor de carousel-kaartjes — voedt zowel
 *  festival-eigen programma als de keyword-match-fallback. */
interface CarouselItem {
  id: string;
  titel: string;
  gezelschap: string;
  type: string;
  english_friendly: boolean;
  foto_url?: string;
  foto_credit?: string;
  korte_omschrijving?: string;
  url?: string;
}

const INITIAL_COUNT = 4;

function showsForFestival(festival: Festival, shows: ShowDisplay[]): ShowDisplay[] {
  const keys = festival.match_keywords.map(k => k.toLowerCase());
  return shows.filter(s =>
    s.categorieen.some(c => keys.includes(c.toLowerCase()))
  );
}

function genreOfShow(show: ShowDisplay): "dans" | "toneel" {
  return show.categorieen.some(c => c.toLowerCase().includes("dans")) ? "dans" : "toneel";
}

function festivalShowToItem(v: FestivalShow): CarouselItem {
  return {
    id: v.id,
    titel: v.titel,
    gezelschap: v.gezelschap ?? "",
    type: v.type,
    english_friendly: !!v.english_friendly,
    foto_url: v.foto_url,
    foto_credit: v.foto_credit,
    korte_omschrijving: v.korte_omschrijving,
    url: v.url
  };
}

function showDisplayToItem(s: ShowDisplay): CarouselItem {
  return {
    id: s.id,
    titel: s.titel,
    gezelschap: s.gezelschap_display,
    type: genreOfShow(s),
    english_friendly: s.english_friendly,
    foto_url: s.foto_url || undefined,
    foto_credit: s.foto_credit,
    korte_omschrijving: s.interesting_because,
    url: s.ticket_url || undefined
  };
}

// Parse periode-string ("Juni", "Mei – Juni", "Juni – Augustus") naar maandnummers
const MONTHS_NL: Record<string, number> = {
  januari: 1, februari: 2, maart: 3, april: 4, mei: 5, juni: 6,
  juli: 7, augustus: 8, september: 9, oktober: 10, november: 11, december: 12
};

function parsePeriode(periode: string): { start: number; end: number } {
  const parts = periode.toLowerCase().split(/[–-]/).map(s => s.trim());
  // Zoek de eerste maand-naam binnen het deel — vangt ook varianten als
  // "eind mei", "begin juni", "halverwege juli" af.
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

/** Sorteer: aankomend eerst (oplopend op startmaand), daarna voorbij
 *  (aflopend, recentst geëindigd eerst). */
function sortFestivalsByDate(festivals: Festival[], currentMonth: number): Festival[] {
  return [...festivals].sort((a, b) => {
    const pa = parsePeriode(a.periode);
    const pb = parsePeriode(b.periode);
    const aPast = pa.end < currentMonth;
    const bPast = pb.end < currentMonth;
    if (aPast !== bPast) return aPast ? 1 : -1;
    if (!aPast) return pa.start - pb.start;
    return pb.start - pa.start;
  });
}

export function FestivalsSection({ festivals, shows }: Props) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openShowId, setOpenShowId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollEdge, setScrollEdge] = useState({ atStart: true, atEnd: false });

  // Reset show-detail wanneer een andere festival-modal opent of sluit
  useEffect(() => { setOpenShowId(null); }, [openId]);

  // Sorteer festivals op aankomende datum — voorbije gaan naar achteren
  const sortedFestivals = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    return sortFestivalsByDate(festivals, currentMonth);
  }, [festivals]);

  const visible = expanded ? sortedFestivals : sortedFestivals.slice(0, INITIAL_COUNT);
  const open = openId ? sortedFestivals.find(f => f.id === openId) : null;
  // Bron voor de carousel: festival-eigen programma (uit festival-website)
  // valt terug op keyword-match tegen onze eigen agenda als 'voorstellingen'
  // niet ingevuld is.
  const items: CarouselItem[] = open
    ? (open.voorstellingen && open.voorstellingen.length > 0
        ? open.voorstellingen.map(festivalShowToItem)
        : showsForFestival(open, shows).map(showDisplayToItem))
    : [];
  const openShow = openShowId ? items.find(s => s.id === openShowId) : null;

  // Carousel scroll-state — voor enable/disable van pijltjes
  const updateScrollEdge = () => {
    const el = carouselRef.current;
    if (!el) return;
    setScrollEdge({
      atStart: el.scrollLeft <= 0,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    });
  };
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(updateScrollEdge, 50);
    return () => clearTimeout(t);
  }, [openId, items.length]);

  const scrollCarousel = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    // Scroll ongeveer twee cards op
    const cardWidth = 176 + 12; // w-44 + gap-3
    el.scrollBy({ left: direction * cardWidth * 2, behavior: "smooth" });
  };

  return (
    <section id="festivals" className="mt-20 sm:mt-24">
      {/* Prominent vlak met opvallende kleur */}
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#FF5722" }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight sm:text-4xl">
          {t("section.festivals.title")}
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/85">
          {t("section.festivals.subtitle")}
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map(f => {
            const hero = f.foto_urls?.[0];
            return (
              <button
                key={f.id}
                onClick={() => setOpenId(f.id)}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl text-left transition-transform duration-300 hover:scale-[1.02] hover:-rotate-[0.6deg]"
                style={{ background: f.accent }}
              >
                {hero && (
                  <img
                    src={hero}
                    alt={f.naam}
                    className="absolute inset-0 block h-full w-full object-cover"
                  />
                )}
                {/* Donker gradient voor leesbaarheid van witte tekst */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                  <div className="text-xs font-semibold uppercase tracking-widest opacity-90">
                    {f.periode} · {f.plaats}
                  </div>
                  <div>
                    <div className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                      {f.naam}
                    </div>
                    {hero && f.foto_credit && (
                      <div className="mt-1 text-[10px] opacity-70 leading-none">
                        © {f.foto_credit}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {festivals.length > INITIAL_COUNT && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              {expanded ? <>Minder <ChevronUp size={14} /></> : <>Bekijk meer <ChevronDown size={14} /></>}
            </button>
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <div
            className="mx-auto my-0 min-h-screen w-full max-w-full overflow-hidden bg-white sm:my-8 sm:min-h-0 sm:max-w-3xl sm:rounded-3xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setOpenId(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EFE8] hover:bg-line transition-colors"
                aria-label="Sluiten"
              >
                <X size={18} />
              </button>
              {/* Carousel met festivalfoto's */}
              <div className="flex h-56 sm:h-64 snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                {(open.foto_urls && open.foto_urls.length > 0
                  ? open.foto_urls.map((url, i) => ({ kind: "img" as const, url, i }))
                  : [0, 1, 2].map(i => ({ kind: "ph" as const, url: "", i }))
                ).map((item) => (
                  <div
                    key={item.i}
                    className="snap-center shrink-0 w-full relative"
                    style={{ background: open.accent, minWidth: "100%" }}
                  >
                    {item.kind === "img" && (
                      <img src={item.url} alt="" className="absolute inset-0 block h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 flex items-end p-6 sm:p-8 text-white">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                          {open.periode} · {open.plaats}
                        </div>
                        <div className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">
                          {open.naam}
                        </div>
                      </div>
                    </div>
                    {open.foto_credit && item.kind === "img" && (
                      <div className="absolute bottom-2 right-3 text-[10px] text-white/80 leading-none">
                        © {open.foto_credit}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm text-ink-soft leading-relaxed">{open.beschrijving}</p>
              {open.url && (
                <a
                  href={open.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink underline-offset-2 underline"
                >
                  Naar festival-website <ExternalLink size={11} />
                </a>
              )}
            </div>
            <div className="border-t border-line p-6 sm:p-8">
              <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-muted">
                Voorstellingen tijdens dit festival
              </h4>
              {items.length === 0 ? (
                <p className="text-sm text-ink-muted italic">
                  Programma volgt — kijk op {open.naam} voor de actuele lijn-up.
                </p>
              ) : (
                <>
                  {/* Horizontale carousel met kleine cards + navigatie-pijltjes */}
                  <div className="relative">
                    <div
                      ref={carouselRef}
                      onScroll={updateScrollEdge}
                      className="-mx-6 sm:-mx-8 px-6 sm:px-8 overflow-x-auto scrollbar-hide"
                    >
                      <div className="flex gap-3 snap-x snap-mandatory pb-2">
                      {items.map(s => {
                        const isOpen = openShowId === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setOpenShowId(isOpen ? null : s.id)}
                            className={`snap-start shrink-0 w-40 sm:w-44 relative aspect-[3/4] overflow-hidden rounded-2xl text-left transition-all ${
                              isOpen
                                ? "ring-2 ring-ink scale-[1.02]"
                                : "hover:scale-[1.02] hover:-rotate-[0.6deg]"
                            }`}
                            style={{ background: open.accent }}
                          >
                            {s.foto_url && (
                              <img
                                src={s.foto_url}
                                alt={s.titel}
                                className="absolute inset-0 block h-full w-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                            {/* Pills */}
                            <div className="pointer-events-none absolute top-2 left-2 right-2 flex flex-wrap gap-1 z-10">
                              <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink capitalize">
                                {s.type}
                              </span>
                              {s.english_friendly && (
                                <span className="rounded-full bg-[#EAF3DE] px-2 py-0.5 text-[10px] font-bold text-[#173404] inline-flex items-center gap-1">
                                  <span aria-hidden="true">🇬🇧</span>
                                </span>
                              )}
                            </div>
                            {/* Titel onderin */}
                            <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                              <div className="text-sm font-medium leading-tight">
                                {s.titel}
                              </div>
                              {s.gezelschap && (
                                <div className="mt-1 text-[10px] text-white/85 leading-tight">
                                  {s.gezelschap}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      </div>
                    </div>
                    {/* Pijltjes — alleen tonen als er iets te scrollen valt */}
                    {items.length > 2 && (
                      <>
                        <button
                          type="button"
                          onClick={() => scrollCarousel(-1)}
                          disabled={scrollEdge.atStart}
                          className="absolute top-1/2 -left-2 sm:-left-4 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Vorige voorstellingen"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollCarousel(1)}
                          disabled={scrollEdge.atEnd}
                          className="absolute top-1/2 -right-2 sm:-right-4 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Volgende voorstellingen"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Detail-panel onder de carousel */}
                  {openShow && (
                    <div className="mt-4 rounded-2xl bg-[#F1EFE8] p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-base font-medium text-ink leading-tight">
                            {openShow.titel}
                          </div>
                          {openShow.gezelschap && (
                            <div className="mt-0.5 text-xs text-ink-muted">
                              {openShow.gezelschap}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setOpenShowId(null)}
                          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full hover:bg-line transition-colors"
                          aria-label="Sluiten"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {openShow.korte_omschrijving && (
                        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                          {openShow.korte_omschrijving}
                        </p>
                      )}
                      {openShow.url && (
                        <a
                          href={openShow.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink hover:underline underline-offset-2"
                        >
                          Naar de voorstelling op {open.naam}
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
