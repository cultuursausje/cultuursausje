"use client";

import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { Festival, FestivalShow, ShowDisplay } from "@/types";
import { useT, useLang, translatePeriode } from "@/lib/i18n";

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
  korte_omschrijving_en?: string;
  url?: string;
}

interface Props {
  festival: Festival;
  /** Shows uit de eigen agenda — voor de keyword-match fallback wanneer
   *  het festival geen eigen `voorstellingen`-lijst heeft. */
  shows: ShowDisplay[];
  onClose: () => void;
}

function genreOfShow(show: ShowDisplay): "dans" | "toneel" {
  return show.categorieen.some(c => c.toLowerCase().includes("dans")) ? "dans" : "toneel";
}

function showsForFestival(festival: Festival, shows: ShowDisplay[]): ShowDisplay[] {
  const keys = festival.match_keywords.map(k => k.toLowerCase());
  return shows.filter(s => s.categorieen.some(c => keys.includes(c.toLowerCase())));
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
    korte_omschrijving_en: v.korte_omschrijving_en,
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

/**
 * FestivalModal — overlay met festival-info en programma-carousel. Wordt
 * gedeeld door FestivalsSection (theaterfestivals-grid) en PlanSection
 * (festival-cards in resultaten). De component beheert zijn eigen interne
 * state (welke voorstelling is uitgeklapt + carousel-scroll-edge).
 */
export function FestivalModal({ festival, shows, onClose }: Props) {
  const t = useT();
  const { lang } = useLang();
  const [openShowId, setOpenShowId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollEdge, setScrollEdge] = useState({ atStart: true, atEnd: false });

  // Bron voor de carousel: festival-eigen programma valt terug op keyword-match
  // tegen onze eigen agenda als 'voorstellingen' niet ingevuld is.
  const items: CarouselItem[] =
    festival.voorstellingen && festival.voorstellingen.length > 0
      ? festival.voorstellingen.map(festivalShowToItem)
      : showsForFestival(festival, shows).map(showDisplayToItem);
  const openShow = openShowId ? items.find(s => s.id === openShowId) : null;

  const updateScrollEdge = () => {
    const el = carouselRef.current;
    if (!el) return;
    setScrollEdge({
      atStart: el.scrollLeft <= 0,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    });
  };
  useEffect(() => {
    const timer = setTimeout(updateScrollEdge, 50);
    return () => clearTimeout(timer);
  }, [items.length]);

  const scrollCarousel = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = 176 + 12; // w-44 + gap-3
    el.scrollBy({ left: direction * cardWidth * 2, behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto my-0 min-h-screen w-full max-w-full overflow-hidden bg-white sm:my-8 sm:min-h-0 sm:max-w-3xl sm:rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EFE8] hover:bg-line transition-colors"
            aria-label="Sluiten"
          >
            <X size={18} />
          </button>
          {/* Carousel met festivalfoto's */}
          <div className="flex h-56 sm:h-64 snap-x snap-mandatory overflow-x-auto scrollbar-hide">
            {(festival.foto_urls && festival.foto_urls.length > 0
              ? festival.foto_urls.map((url, i) => ({ kind: "img" as const, url, i }))
              : [0, 1, 2].map(i => ({ kind: "ph" as const, url: "", i }))
            ).map(item => (
              <div
                key={item.i}
                className="snap-center shrink-0 w-full relative"
                style={{ background: festival.accent, minWidth: "100%" }}
              >
                {item.kind === "img" && (
                  <img src={item.url} alt="" className="absolute inset-0 block h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 flex items-end p-6 sm:p-8 text-white">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                      {translatePeriode(festival.periode, lang)} · {festival.plaats}
                    </div>
                    <div className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">
                      {festival.naam}
                    </div>
                  </div>
                </div>
                {festival.foto_credit && item.kind === "img" && (
                  <div className="absolute bottom-2 right-3 text-[10px] text-white/80 leading-none">
                    © {festival.foto_credit}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm text-ink-soft leading-relaxed">
            {lang === "en" && festival.beschrijving_en ? festival.beschrijving_en : festival.beschrijving}
          </p>
          {festival.url && (
            <a
              href={festival.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink underline-offset-2 underline"
            >
              {t("festival.toWebsite")} <ExternalLink size={11} />
            </a>
          )}
        </div>
        <div className="border-t border-line p-6 sm:p-8">
          <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-muted">
            {t("festival.voorstellingenTijdens")}
          </h4>
          {items.length === 0 ? (
            <p className="text-sm text-ink-muted italic">
              {t("festival.programmaVolgt")} {festival.naam}.
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
                          style={{ background: festival.accent }}
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
                      {lang === "en" && openShow.korte_omschrijving_en
                        ? openShow.korte_omschrijving_en
                        : openShow.korte_omschrijving}
                    </p>
                  )}
                  {openShow.url && (
                    <a
                      href={openShow.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink hover:underline underline-offset-2"
                    >
                      {t("button.toShow")} {festival.naam}
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
  );
}
