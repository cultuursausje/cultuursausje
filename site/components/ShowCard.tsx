"use client";

import { useRef, useState } from "react";
import {
  Heart, X,
  Play, Mic, ExternalLink, Star, ChevronLeft, ChevronRight
} from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";
import { englishDays } from "@/lib/dates";
import { useT, useLang, formatDateLang } from "@/lib/i18n";

const PANEL_BG = "#F1EFE8";

interface SmallCardProps {
  show: ShowDisplay;
  pill: string;
  isFavorite: boolean;
  isActive: boolean;
  onSelect: () => void;
  onToggleFav: () => void;
}

/** Compacte carousel-card voor de "Alle voorstellingen"-rij. Festival-stijl:
 *  portrait, foto-overlay, datum-pill linksboven, hartje rechtsboven. */
export function SmallShowCard({
  show, pill, isFavorite, isActive, onSelect, onToggleFav
}: SmallCardProps) {
  const photoBg = photoBgForShow(show.id);
  const hasPhoto = !!show.foto_url;

  return (
    <div className="relative shrink-0 snap-start w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]">
      <button
        type="button"
        onClick={onSelect}
        className={`relative block w-full aspect-[4/5] overflow-hidden rounded-2xl text-left transition-all ${
          isActive
            ? "scale-[1.02]"
            : "hover:scale-[1.02] hover:-rotate-[0.6deg]"
        }`}
        style={{ background: photoBg }}
        aria-label={`Open ${show.titel}`}
      >
        {hasPhoto && (
          <img
            src={show.foto_url}
            alt=""
            className="absolute inset-0 block h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Titel + gezelschap onderin */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-white">
          <div className="text-sm font-medium leading-tight line-clamp-2">
            {show.titel}
          </div>
          <div className="mt-0.5 text-[10px] text-white/85 leading-tight line-clamp-1">
            {show.gezelschap_display}
          </div>
        </div>

        {/* Copyright rechtsonder */}
        {hasPhoto && (
          <div className="absolute bottom-1 right-2 z-10 text-[9px] text-white/70 leading-none pointer-events-none">
            © {show.foto_credit || show.gezelschap_display}
          </div>
        )}
      </button>

      {/* Datum-pill linksboven — neutrale stijl */}
      <div className="pointer-events-none absolute top-2 left-2 z-20 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink">
        {pill}
      </div>

      {/* Hartje rechtsboven — los klik-target */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFav(); }}
        className="absolute top-1.5 right-1.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 hover:bg-white transition"
        aria-label="Favoriet"
      >
        <Heart
          size={15}
          className={isFavorite ? "fill-[#FF3D8B] stroke-[#FF3D8B]" : "stroke-ink-soft"}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline detail-paneel — verschijnt onder de carousel als een card geopend is.
// ---------------------------------------------------------------------------

interface DetailProps {
  show: ShowDisplay;
  isFavorite: boolean;
  /** Venues gefilterd op de actieve stad-selectie. */
  venues: ShowDisplay["venues"];
  /** De maand die actief in de grid wordt getoond. Bepaalt welke
   *  venues + datums worden meegenomen. */
  viewMonth?: { year: number; monthIdx: number };
  onClose: () => void;
  onToggleFav: () => void;
}

function genreOfShow(show: ShowDisplay): string {
  return show.categorieen.some(c => c.toLowerCase().includes("dans")) ? "dans" : "toneel";
}

function mapsEmbedUrl(theater: string, stad: string): string {
  const q = stad ? `${theater}, ${stad}` : theater;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

function mapsLinkUrl(theater: string, stad: string): string {
  const q = stad ? `${theater}, ${stad}` : theater;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function ShowDetailPanel({
  show, isFavorite, venues: cityVenues, viewMonth, onClose, onToggleFav
}: DetailProps) {
  const t = useT();
  const { lang } = useLang();
  const enDays = englishDays(show.english_friendly, show.english_friendly_detail);

  // Filter venues op de actieve maand én filter de datums binnen elke venue.
  const monthPrefix = viewMonth
    ? `${viewMonth.year}-${String(viewMonth.monthIdx + 1).padStart(2, "0")}-`
    : null;
  const monthFiltered = monthPrefix
    ? cityVenues
        .filter(v => v.speeldata.some(d => d.startsWith(monthPrefix)))
        .map(v => ({ ...v, speeldata: v.speeldata.filter(d => d.startsWith(monthPrefix)) }))
    : cityVenues;
  const venues = monthFiltered.length > 0 ? monthFiltered : cityVenues;

  const parseDates = (isoList: string[]): Date[] =>
    isoList.map(s => {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d);
    }).sort((a, b) => a.getTime() - b.getTime());

  const genre = genreOfShow(show);

  // Beschrijving als één paragraaf — hook + samenvatting samengevoegd, niet vet
  const fullDescription = [show.interesting_because, show.lange_samenvatting]
    .filter(Boolean)
    .join(" ");

  // Foto-carousel boven titel
  const photos = show.foto_urls && show.foto_urls.length > 0
    ? show.foto_urls
    : show.foto_url ? [show.foto_url] : [];
  const [photoIdx, setPhotoIdx] = useState(0);
  const photoCarRef = useRef<HTMLDivElement>(null);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  const scrollToPhoto = (idx: number) => {
    if (!photoCarRef.current) return;
    const w = photoCarRef.current.clientWidth;
    photoCarRef.current.scrollTo({ left: idx * w, behavior: "smooth" });
  };
  const onPhotoScroll = () => {
    if (!photoCarRef.current) return;
    const w = photoCarRef.current.clientWidth;
    const i = Math.round(photoCarRef.current.scrollLeft / w);
    if (i !== photoIdx) setPhotoIdx(i);
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Alles-in-één-paneel */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: PANEL_BG }}
      >
        {/* Foto-carousel bovenaan — edge-to-edge zodat pills + close erover kunnen vallen */}
        {photos.length > 0 && (
          <div className="relative">
            <div
              ref={photoCarRef}
              onScroll={onPhotoScroll}
              className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
            >
              {photos.map((url, i) => (
                <div
                  key={i}
                  className="snap-center shrink-0 w-full relative h-44 sm:h-56 md:h-60"
                  style={{ minWidth: "100%", background: "#1B2A4E" }}
                >
                  <img
                    src={url}
                    alt=""
                    className="absolute inset-0 block h-full w-full object-cover"
                  />
                  {show.foto_credit && (
                    <div className="absolute bottom-2 right-3 z-10 text-[10px] text-white/85 leading-none pointer-events-none">
                      © {show.foto_credit}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pills overlay top-left op de foto */}
            <div className="pointer-events-none absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pr-24">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink capitalize">
                {genre}
              </span>
              {show.english_friendly && (
                <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink inline-flex items-center gap-1">
                  <span aria-hidden="true">🇬🇧</span>
                  English friendly
                </span>
              )}
            </div>

            {/* Close op de foto */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm hover:bg-white transition-colors"
              aria-label="Sluiten"
            >
              <X size={16} />
            </button>

            {/* Foto-navigatie bij meerdere foto's */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => scrollToPhoto(Math.max(0, photoIdx - 1))}
                  disabled={photoIdx === 0}
                  className="absolute top-1/2 left-2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Vorige foto"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToPhoto(Math.min(photos.length - 1, photoIdx + 1))}
                  disabled={photoIdx === photos.length - 1}
                  className="absolute top-1/2 right-2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Volgende foto"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToPhoto(i)}
                      className={`h-1 rounded-full transition-all ${
                        i === photoIdx ? "w-4 bg-white" : "w-1 bg-white/60 hover:bg-white/90"
                      }`}
                      aria-label={`Foto ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content-area met padding */}
        <div className="relative p-4 sm:p-5">
        {/* Close + pills wanneer er GEEN foto is */}
        {photos.length === 0 && (
          <>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full hover:bg-line transition-colors"
              aria-label="Sluiten"
            >
              <X size={14} />
            </button>
            <div className="flex flex-wrap items-center gap-1.5 mb-2 pr-12">
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-ink-soft capitalize">
                {genre}
              </span>
              {show.english_friendly && (
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-ink-soft inline-flex items-center gap-1">
                  <span aria-hidden="true">🇬🇧</span>
                  English friendly
                </span>
              )}
            </div>
          </>
        )}

        {/* Titel + gezelschap */}
        <h3 className="text-lg font-medium tracking-tight text-ink leading-tight sm:text-xl">
          {show.titel}
        </h3>
        <div className="mt-1 text-xs text-ink-muted sm:text-sm">
          {show.gezelschap_url ? (
            <a
              href={show.gezelschap_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink underline-offset-2 hover:underline"
            >
              {show.gezelschap_display}
            </a>
          ) : (
            show.gezelschap_display
          )}
        </div>

        {/* Beschrijving */}
        {fullDescription && (
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            {fullDescription}
          </p>
        )}

        {/* Inline recensies — max 1 standaard, "Meer" voor de rest */}
        {show.pers_quotes.length > 0 && (
          <div className="mt-5 space-y-3">
            {(reviewsExpanded ? show.pers_quotes : show.pers_quotes.slice(0, 1)).map((p, i) => {
              const inner = (
                <>
                  {p.sterren !== null && (
                    <div className="mb-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={11}
                          className={idx < (p.sterren ?? 0)
                            ? "fill-[#E5B53A] stroke-[#E5B53A]"
                            : "stroke-line"}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm italic text-ink-soft leading-relaxed">
                    &ldquo;{lang === "en" && p.quote_en ? p.quote_en : p.quote}&rdquo;
                  </p>
                  <div className="mt-0.5 text-[11px] text-ink-muted inline-flex items-center gap-1">
                    {p.bron}
                    {p.url && <ExternalLink size={9} className="text-ink-faint" />}
                  </div>
                </>
              );
              return p.url ? (
                <a key={i} href={p.url} target="_blank" rel="noreferrer" className="block group cursor-pointer hover:opacity-80 transition-opacity">
                  {inner}
                </a>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}
            {show.pers_quotes.length > 1 && (
              <button
                type="button"
                onClick={() => setReviewsExpanded(v => !v)}
                className="text-xs font-medium text-ink hover:underline underline-offset-2"
              >
                {reviewsExpanded
                  ? t("button.lessReviews")
                  : (lang === "en"
                      ? `+${show.pers_quotes.length - 1} more reviews`
                      : `+${show.pers_quotes.length - 1} meer recensies`)}
              </button>
            )}
          </div>
        )}

        {/* Speeldata */}
        <h4 className="mt-6 mb-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
          {t("show.speeldata")}
        </h4>
        <div className="space-y-3">
          {venues.map(v => {
            const dates = parseDates(v.speeldata);
            const MAX = 18;
            const visible = dates.slice(0, MAX);
            const overflow = dates.length - visible.length;
            return (
              <div key={`speel-${v.theater_id}`}>
                {venues.length > 1 && (
                  <div className="mb-1 text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                    {v.theater_naam}
                  </div>
                )}
                {visible.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
                      {visible.map((d, j) => {
                        const isEn = enDays.has(d.getDay());
                        return (
                          <div key={j} className="flex items-center gap-1 text-xs text-ink-soft sm:text-sm">
                            <span className="lowercase">{formatDateLang(d, lang)}</span>
                            {isEn && (
                              <span aria-hidden="true" className="text-xs leading-none">🇬🇧</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {overflow > 0 && (
                      <div className="mt-1.5 text-[11px] text-ink-muted">
                        + {overflow} {t("detail.moreViaLink")}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-[11px] text-ink-faint italic">
                    {t("detail.datesViaLink")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {show.ticket_url && (
          <a
            href={show.ticket_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink hover:underline underline-offset-2 sm:text-sm"
          >
            {t("button.toShow")} {show.gezelschap_display}
            <ExternalLink size={12} />
          </a>
        )}

        {/* Locatie — bij 2+ venues naast elkaar in een grid op desktop */}
        <h4 className="mt-6 mb-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
          {venues.length > 1 ? t("show.locaties") : t("show.locatie")}
        </h4>
        <div className={venues.length > 1 ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
          {venues.map(v => (
            <div key={`loc-${v.theater_id}`}>
              <div className="mb-2 text-sm">
                {v.theater_url ? (
                  <a
                    href={v.theater_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-ink hover:underline underline-offset-2"
                  >
                    {v.theater_naam}
                    <ExternalLink size={11} className="text-ink-soft" />
                  </a>
                ) : (
                  <span className="font-bold text-ink">{v.theater_naam}</span>
                )}
                <span className="ml-1 text-ink-muted">· {v.theater_stad}</span>
              </div>
              <div className={`rounded-xl overflow-hidden aspect-[16/9] ${venues.length === 1 ? "sm:max-w-md" : ""}`}>
                <iframe
                  src={mapsEmbedUrl(v.theater_naam, v.theater_stad)}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Kaart ${v.theater_naam}, ${v.theater_stad}`}
                />
              </div>
              <a
                href={mapsLinkUrl(v.theater_naam, v.theater_stad)}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink underline-offset-2 hover:underline"
              >
                {t("button.openMaps")} <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>

        {/* In de media — inline binnen hetzelfde paneel, onder Locatie */}
        {show.media_links.length > 0 && (
          <>
            <h4 className="mt-6 mb-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
              {t("show.inDeMedia")}
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {show.media_links.map((m, i) => (
                <a
                  key={i}
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/70 p-2.5 hover:bg-white transition-colors"
                >
                  {m.type === "video" || m.type === "serie"
                    ? <Play size={16} className="text-accent-cobalt shrink-0" />
                    : <Mic size={16} className="text-accent-cobalt shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-ink truncate sm:text-sm">{m.titel}</div>
                    <div className="text-[10px] text-ink-muted capitalize">{m.type}</div>
                  </div>
                  <ExternalLink size={12} className="text-ink-faint shrink-0" />
                </a>
              ))}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

