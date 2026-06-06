"use client";

import { useEffect, useRef, useState } from "react";
import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";
import { useT, useLang, type Lang } from "@/lib/i18n";

type Mode = "nieuw" | "reprise";

interface Props {
  shows: ShowDisplay[];
  /** "reprise" (default) = klassieke Niet-te-missen op basis van buzz en
   *  high-rated recensies. "nieuw" = recent in premiere gegane producties
   *  met goede pers. */
  mode?: Mode;
}

const WINDOW_DAYS = 14;
const MIN_SOURCES = 3;
const HIGH_STAR = 4;
const INITIAL_QUOTES = 1;
const MAX_FEATURED = 5;
/** Hoe ver terug telt een premiere als "nieuw" (5 weken). */
const NEW_PREMIERE_WINDOW_DAYS = 35;
/** Cap per gezelschap — voorkomt dat één enkele producent (vooral ITA,
 *  dat veel grote producties met goede pers maakt) de hele carousel
 *  domineert. Zo blijft er ruimte voor andere makers. */
const MAX_PER_GEZELSCHAP: Record<string, number> = {
  ita: 3
};
const PANEL_BG = "#F1EFE8";

interface Featured {
  show: ShowDisplay;
  quotes: ShowDisplay["pers_quotes"];
}

function pickFeatured(shows: ShowDisplay[], mode: Mode): Featured[] {
  const now = Date.now();
  const cutoff = now - WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const newPremiereCutoff = now - NEW_PREMIERE_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  // Een voorstelling komt alleen in beeld als:
  //  1. de speelperiode nog niet voorbij is (anders kun je niet meer gaan)
  //  2. er een ticket-link is (anders kan de bezoeker er niks mee)
  // Hierdoor verdwijnen shows die zijn afgelopen automatisch uit de lijst
  // zodra de revalidate-cycle voorbij komt.
  // Daarnaast filteren we op `mode`:
  //  - "nieuw" → speelperiode_start in afgelopen 5 weken (recent premiere)
  //  - "reprise" → speelperiode_start ouder dan 5 weken (lopende reprise)
  const eligible = shows.filter((s) => {
    if (!s.ticket_url) return false;
    const endMs = new Date(s.speelperiode_end).getTime();
    if (!Number.isFinite(endMs) || endMs < now) return false;
    const startMs = new Date(s.speelperiode_start).getTime();
    if (!Number.isFinite(startMs)) return false;
    const isNew = startMs >= newPremiereCutoff && startMs <= now + 14 * 24 * 60 * 60 * 1000;
    return mode === "nieuw" ? isNew : !isNew;
  });

  const recent = eligible
    .map(show => {
      const r = show.pers_quotes.filter(q => {
        if (!q.date) return false;
        const t = new Date(q.date).getTime();
        return Number.isFinite(t) && t >= cutoff && t <= now;
      });
      const sources = new Set(r.map(q => q.bron));
      if (sources.size < MIN_SOURCES) return null;
      const perBron = new Map<string, ShowDisplay["pers_quotes"][number]>();
      [...r].sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
        .forEach(q => { if (!perBron.has(q.bron)) perBron.set(q.bron, q); });
      const quotes = Array.from(perBron.values());
      const mostRecentMs = Math.max(...quotes.map(q => new Date(q.date!).getTime()));
      return { show, quotes, mostRecentMs };
    })
    .filter((c): c is { show: ShowDisplay; quotes: ShowDisplay["pers_quotes"]; mostRecentMs: number } => c !== null)
    .sort((a, b) => b.mostRecentMs - a.mostRecentMs);

  const fallback = eligible
    .map(show => {
      const highRated = show.pers_quotes.filter(q => (q.sterren ?? 0) >= HIGH_STAR);
      const sources = new Set(highRated.map(q => q.bron));
      if (sources.size < MIN_SOURCES) return null;
      const perBron = new Map<string, ShowDisplay["pers_quotes"][number]>();
      highRated.forEach(q => { if (!perBron.has(q.bron)) perBron.set(q.bron, q); });
      const quotes = Array.from(perBron.values());
      const avgStars = quotes.reduce((s, q) => s + (q.sterren ?? 0), 0) / quotes.length;
      const premiereMs = new Date(show.speelperiode_start).getTime();
      return { show, quotes, avgStars, premiereMs };
    })
    .filter((c): c is { show: ShowDisplay; quotes: ShowDisplay["pers_quotes"]; avgStars: number; premiereMs: number } => c !== null)
    .sort((a, b) => b.avgStars - a.avgStars || a.premiereMs - b.premiereMs);

  // Combineer met cap-controles: max 5 totaal, en max N per gezelschap
  // zoals geconfigureerd in MAX_PER_GEZELSCHAP (ITA: 3).
  const seen = new Set<string>();
  const combined: Featured[] = [];
  const perGezelschapCount = new Map<string, number>();

  const tryAdd = (entry: Featured): boolean => {
    if (combined.length >= MAX_FEATURED) return false;
    if (seen.has(entry.show.id)) return false;
    const gid = entry.show.gezelschap_id;
    const cap = MAX_PER_GEZELSCHAP[gid];
    if (cap !== undefined && (perGezelschapCount.get(gid) ?? 0) >= cap) return false;
    combined.push(entry);
    seen.add(entry.show.id);
    perGezelschapCount.set(gid, (perGezelschapCount.get(gid) ?? 0) + 1);
    return true;
  };

  // Tier 1: recente buzz, Tier 2: high-rated fallback
  for (const r of recent) tryAdd({ show: r.show, quotes: r.quotes });
  for (const f of fallback) tryAdd({ show: f.show, quotes: f.quotes });

  // Tier 3 (vangnet): als we nog onder de 5 zitten, vul aan met shows die
  // tenminste 2 verschillende bronnen hebben (1 voor de "nieuw"-modus
  // omdat verse premieres weinig recensies hebben) — gesorteerd op
  // aankomende premiere-datum. tryAdd handelt alle caps af.
  if (combined.length < MAX_FEATURED) {
    const minRelaxedSources = mode === "nieuw" ? 1 : 2;
    const relaxed = eligible
      .filter((s) => !seen.has(s.id))
      .map((show) => {
        const perBron = new Map<string, ShowDisplay["pers_quotes"][number]>();
        show.pers_quotes.forEach((q) => {
          if (!perBron.has(q.bron)) perBron.set(q.bron, q);
        });
        const quotes = Array.from(perBron.values());
        if (quotes.length < minRelaxedSources) return null;
        const premiereMs = new Date(show.speelperiode_start).getTime();
        return { show, quotes, premiereMs };
      })
      .filter((c): c is { show: ShowDisplay; quotes: ShowDisplay["pers_quotes"]; premiereMs: number } => c !== null)
      .sort((a, b) => a.premiereMs - b.premiereMs);
    for (const r of relaxed) tryAdd({ show: r.show, quotes: r.quotes });
  }

  // Sorteer chronologisch op begindatum van de speelperiode — de show
  // die het eerst start verschijnt links in de carousel. Maakt het voor
  // bezoekers makkelijk om te zien wat er als eerste te zien is.
  return combined
    .slice(0, MAX_FEATURED)
    .sort((a, b) => {
      const aStart = new Date(a.show.speelperiode_start).getTime();
      const bStart = new Date(b.show.speelperiode_start).getTime();
      return aStart - bStart;
    });
}

/** Formatteert "mei – jun 2026" / "jun 2026" / "dec 2026 – feb 2027" pill
 *  voor de hele speelperiode. Nederlandse maandnamen lowercase (consistent
 *  met de rest van de site); Engelse maandnamen met hoofdletter
 *  (taalconventie). Jaartal komt altijd aan het eind. */
function monthRangePill(startISO: string, endISO: string, lang: Lang): string {
  const nl = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  const en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const names = lang === "en" ? en : nl;
  const [sy, sm] = startISO.split("-").map(Number);
  const [ey, em] = endISO.split("-").map(Number);
  if (!Number.isFinite(sm) || !Number.isFinite(em)) return "";
  if (sy === ey) {
    if (sm === em) return `${names[sm - 1]} ${sy}`;
    return `${names[sm - 1]} – ${names[em - 1]} ${sy}`;
  }
  // Verschillende jaren (bv. een show van dec 2026 t/m feb 2027)
  return `${names[sm - 1]} ${sy} – ${names[em - 1]} ${ey}`;
}

function QuoteRow({ quote, lang }: { quote: ShowDisplay["pers_quotes"][number]; lang: Lang }) {
  const inner = (
    <>
      {quote.sterren !== null && (
        <div className="mb-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={11}
              className={idx < (quote.sterren ?? 0)
                ? "fill-[#E5B53A] stroke-[#E5B53A]"
                : "stroke-white/30"}
            />
          ))}
        </div>
      )}
      <p className="text-sm italic text-white leading-relaxed">
        &ldquo;{lang === "en" && quote.quote_en ? quote.quote_en : quote.quote}&rdquo;
      </p>
      <div className="mt-0.5 text-[11px] text-white/70 inline-flex items-center gap-1">
        {quote.bron}
        {quote.url && <ExternalLink size={9} className="text-white/60" />}
      </div>
    </>
  );
  return quote.url ? (
    <a href={quote.url} target="_blank" rel="noreferrer" className="block hover:opacity-80 transition-opacity">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

export function RecensiesSection({ shows, mode = "reprise" }: Props) {
  const t = useT();
  const { lang } = useLang();
  const featured = pickFeatured(shows, mode);
  // Mode-specifieke styling: andere kleur en kop per sectie.
  const isNieuw = mode === "nieuw";
  const sectionId = isNieuw ? "nieuw" : "recensies";
  const bgColor = isNieuw ? "#FF6B9D" : "#5C2D9B";
  const titleKey = isNieuw ? "section.nieuw.title" : "section.recensies.title";
  const subtitleKey = isNieuw ? "section.nieuw.subtitle" : "section.recensies.subtitle";
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Carousel scroll-state
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
  }, [featured.length]);
  const scrollByCards = (dir: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  };

  if (featured.length === 0) return null;

  const toggleReviews = (id: string) => {
    setExpandedReviews(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <section id={sectionId} className="mb-12 sm:mb-16">
      <div
        className="rounded-3xl px-6 py-10 sm:px-8 sm:py-12"
        style={{ background: bgColor }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight">
          {t(titleKey)}
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/80">
          {t(subtitleKey)}
        </p>

        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={updateEdge}
            className="-mx-6 sm:-mx-8 px-6 sm:px-8 overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-4 snap-x snap-mandatory pb-2 w-full">
              {featured.map(({ show, quotes }) => {
                const photoBg = photoBgForShow(show.id);
                const isOpenReviews = expandedReviews.has(show.id);
                const visible = isOpenReviews ? quotes : quotes.slice(0, INITIAL_QUOTES);
                return (
                  <div
                    key={show.id}
                    className="shrink-0 snap-start w-[80%] sm:w-[calc((100%-1rem)/2)] flex flex-col gap-3"
                  >
                    {/* Foto-card — compact 4/5 aspect, zelfde formaat
                        als de cards in "Alle voorstellingen". */}
                    <div
                      className="relative overflow-hidden rounded-2xl"
                      style={{ background: photoBg }}
                    >
                      <div className="relative aspect-[4/5]">
                        {show.foto_url && (
                          <img
                            src={show.foto_url}
                            alt={show.titel}
                            className="absolute inset-0 block h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                        {/* Maand-pill linksboven met de speelperiode */}
                        <div className="pointer-events-none absolute top-2 left-2 z-20 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-ink">
                          {monthRangePill(show.speelperiode_start, show.speelperiode_end, lang)}
                        </div>
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <div className="text-base font-medium leading-tight sm:text-lg">
                            {show.titel}
                          </div>
                          <div className="mt-0.5 text-[11px] text-white/85 leading-tight">
                            {show.gezelschap_display}
                          </div>
                        </div>
                        {show.foto_credit && (
                          <div className="absolute bottom-1 right-2 z-10 text-[9px] text-white/70 leading-none pointer-events-none">
                            © {show.foto_credit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Link naar voorstelling — boven de recensies */}
                    {show.ticket_url && (
                      <a
                        href={show.ticket_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-white hover:underline underline-offset-2"
                      >
                        {t("button.toShow")} {show.gezelschap_display}
                        <ExternalLink size={12} />
                      </a>
                    )}

                    {/* Recensies direct op de paarse achtergrond, geen vlak */}
                    <div className="space-y-4">
                      {visible.map((q, i) => (
                        <QuoteRow key={i} quote={q} lang={lang} />
                      ))}
                      {quotes.length > INITIAL_QUOTES && (
                        <button
                          type="button"
                          onClick={() => toggleReviews(show.id)}
                          className="text-xs font-medium text-white hover:underline underline-offset-2"
                        >
                          {isOpenReviews
                            ? t("button.lessReviews")
                            : (lang === "en"
                                ? `+${quotes.length - INITIAL_QUOTES} more reviews`
                                : `+${quotes.length - INITIAL_QUOTES} meer recensies`)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {featured.length > 2 && (
            <>
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={edge.atStart}
                className="absolute top-32 -left-1 sm:-left-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
                aria-label="Vorige voorstellingen"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={edge.atEnd}
                className="absolute top-32 -right-1 sm:-right-3 -translate-y-1/2 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F8F6EF] transition disabled:opacity-30 disabled:cursor-not-allowed sm:flex"
                aria-label="Volgende voorstellingen"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
