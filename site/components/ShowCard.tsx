"use client";

import { useRef, useState } from "react";
import {
  Heart, ArrowRight, X,
  Play, Mic, ExternalLink, Star, ChevronLeft, ChevronRight
} from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow, neonForShow } from "@/lib/colors";
import { englishDays, formatDateNL } from "@/lib/dates";

const NEON_BG = "#B5FF52";
const NEON_TEXT = "#173404";

interface Props {
  show: ShowDisplay;
  pill: string;
  monthKey: string;
  isFlipped: boolean;
  isExpanded: boolean;
  isFavorite: boolean;
  isMobile: boolean;
  onFlip: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  onToggleFav: () => void;
}

export function ShowCard({
  show, pill, isFlipped, isExpanded, isFavorite,
  onFlip, onExpand, onCollapse, onToggleFav
}: Props) {
  const photoBg = photoBgForShow(show.id);
  const neon = neonForShow(show.id);
  const hasPhoto = !!show.foto_url;

  if (isExpanded) {
    return (
      <div className="relative">
        {/* Scherpe neon-rand: box-shadow met meerdere lagen voor LED-effect */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            boxShadow: `0 0 0 2px ${neon}, 0 0 10px 2px ${neon}, 0 0 24px 4px ${neon}66`
          }}
        />
        <div className="relative">
          <ExpandedCard
            show={show}
            pill={pill}
            isFavorite={isFavorite}
            onClose={onCollapse}
            onToggleFav={onToggleFav}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative cursor-pointer transition-transform duration-500 ease-out ${
        isFlipped
          ? ""
          : "hover:-rotate-[0.8deg] hover:scale-[1.015] hover:-translate-y-0.5"
      }`}
    >
      {/* Scherpe neon-rand met box-shadow lagen — blijft zichtbaar als geflipt */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500 ${
          isFlipped ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{
          boxShadow: `0 0 0 2px ${neon}, 0 0 10px 2px ${neon}, 0 0 24px 4px ${neon}66`
        }}
      />
      <div
        className={`flip-card relative w-full rounded-3xl ${isFlipped ? "is-flipped" : ""}`}
        onClick={onFlip}
      >
        <div className="flip-inner rounded-3xl">
          {/* Front */}
          <div
            className="flip-face flex items-end p-4 min-h-[220px] overflow-hidden"
            style={{ background: photoBg }}
          >
            {hasPhoto && (
              <img
                src={show.foto_url}
                alt=""
                className="absolute inset-0 block h-full w-full object-cover"
              />
            )}
            <div className="relative z-10 max-w-[80%]">
              <div className="text-white text-sm font-medium leading-tight tracking-tight sm:text-base">
                {show.titel}
              </div>
            </div>
            {/* Copyright overlay rechtsonder, alleen wanneer er een foto is */}
            {hasPhoto && (
              <div className="absolute bottom-2 right-3 z-10 text-[10px] text-white/70 leading-none">
                © {show.foto_credit || show.gezelschap_display}
              </div>
            )}
          </div>

          {/* Back — interesting_because als beschrijving + locatie */}
          <div className="flip-face flip-back bg-white pt-14 px-5 pb-12 flex flex-col border border-line">
            {show.interesting_because && (
              <p className="text-sm text-ink-soft leading-relaxed mb-3">
                {show.interesting_because}
              </p>
            )}
            <div className="text-sm text-ink-muted">
              {show.venues.map(v => v.theater_afkorting).join(" · ")}
            </div>
          </div>
        </div>
      </div>

      {/* Meer-knop — zwevend, los van flip-card */}
      <button
        type="button"
        onClick={() => onExpand()}
        className={`absolute bottom-4 right-5 z-30 flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink transition-opacity ${
          isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        Meer
        <ArrowRight size={13} />
      </button>

      {/* Pill — top left */}
      <div
        className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold z-20 pointer-events-none"
        style={{ background: NEON_BG, color: NEON_TEXT }}
      >
        {pill}
      </div>

      {/* Heart — top right */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFav(); }}
        className="absolute top-2.5 right-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 transition-transform hover:scale-110"
        aria-label="Favoriet"
      >
        <Heart
          size={18}
          className={isFavorite ? "fill-[#FF3D8B] stroke-[#FF3D8B]" : "stroke-ink-soft"}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Uitvergrote card
// ---------------------------------------------------------------------------

interface ExpandedProps {
  show: ShowDisplay;
  pill: string;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFav: () => void;
}

function genreOfShow(show: ShowDisplay): string {
  return show.categorieen.some(c => c.toLowerCase().includes("dans")) ? "dans" : "toneel";
}

function themesOfShow(show: ShowDisplay): string[] {
  const excluded = new Set(["dans", "holland festival", "julidans"]);
  return show.categorieen
    .filter(c => !excluded.has(c.toLowerCase()))
    .slice(0, 2);
}

function mapsEmbedUrl(theater: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(theater + ", Amsterdam")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

function mapsLinkUrl(theater: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater + ", Amsterdam")}`;
}

function ExpandedCard({
  show, pill, isFavorite, onClose, onToggleFav
}: ExpandedProps) {
  const enDays = englishDays(show.english_friendly, show.english_friendly_detail);

  // Helper: zet ISO-datums om naar Date-objecten
  const parseDates = (isoList: string[]): Date[] =>
    isoList.map(s => {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d);
    }).sort((a, b) => a.getTime() - b.getTime());

  const genre = genreOfShow(show);
  const themes = themesOfShow(show);

  // Foto's voor de carousel: foto_urls (meerdere) of foto_url (enkel)
  const photos = (show.foto_urls && show.foto_urls.length > 0)
    ? show.foto_urls
    : (show.foto_url ? [show.foto_url] : []);
  const hasPhotos = photos.length > 0;

  // Carousel state
  const [photoIdx, setPhotoIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToPhoto = (idx: number) => {
    if (!carouselRef.current) return;
    const w = carouselRef.current.clientWidth;
    carouselRef.current.scrollTo({ left: idx * w, behavior: "smooth" });
  };

  const onCarouselScroll = () => {
    if (!carouselRef.current) return;
    const w = carouselRef.current.clientWidth;
    const i = Math.round(carouselRef.current.scrollLeft / w);
    if (i !== photoIdx) setPhotoIdx(i);
  };

  return (
    <div className="relative bg-white rounded-3xl border border-line overflow-hidden">
      {/* Close + heart - boven scroll, blijven altijd zichtbaar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EFE8] hover:bg-line transition-colors shadow-sm"
        aria-label="Sluiten"
      >
        <X size={18} />
      </button>
      <button
        onClick={onToggleFav}
        className="absolute top-4 right-16 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EFE8] hover:bg-line transition-colors shadow-sm"
        aria-label="Favoriet"
      >
        <Heart
          size={18}
          className={isFavorite ? "fill-[#FF3D8B] stroke-[#FF3D8B]" : "stroke-ink-soft"}
        />
      </button>

      {/* Scrollbaar binnenwerk */}
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Foto-carousel met pills-overlay (alleen als er foto's zijn) */}
        {hasPhotos && (
          <div className="relative bg-[#1B2A4E]">
            <div
              ref={carouselRef}
              onScroll={onCarouselScroll}
              className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide h-48 sm:h-56 md:h-60 lg:h-72"
            >
              {photos.map((url, i) => (
                <div
                  key={i}
                  className="snap-center shrink-0 w-full h-full relative overflow-hidden bg-[#1B2A4E]"
                  style={{ minWidth: "100%" }}
                >
                  <img
                    src={url}
                    alt=""
                    className="absolute inset-0 block h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Prev / next nav, alleen bij meerdere foto's */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => scrollToPhoto(Math.max(0, photoIdx - 1))}
                  disabled={photoIdx === 0}
                  className="absolute top-1/2 left-3 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Vorige foto"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToPhoto(Math.min(photos.length - 1, photoIdx + 1))}
                  disabled={photoIdx === photos.length - 1}
                  className="absolute top-1/2 right-3 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Volgende foto"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Stipjes-indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToPhoto(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === photoIdx ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Foto ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pills overlay top — laat ruimte voor close + heart knoppen */}
            <div className="pointer-events-none absolute top-4 left-4 right-28 flex flex-wrap gap-2 z-10">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-ink capitalize">
                {genre}
              </span>
              {themes.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {t}
                </span>
              ))}
              {show.english_friendly && (
                <span className="rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-bold text-[#173404] inline-flex items-center gap-1.5">
                  <span className="text-base leading-none" aria-hidden="true">🇬🇧</span>
                  English friendly
                </span>
              )}
            </div>
            {/* Copyright bottom-right */}
            {show.foto_credit && (
              <div className="absolute bottom-2 right-3 z-10 text-[10px] text-white/80 leading-none pointer-events-none">
                © {show.foto_credit}
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="p-6 pt-7 sm:p-8 sm:pt-9 pr-28">
          {/* Pills boven titel — alleen wanneer er geen carousel boven staat */}
          {!hasPhotos && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-medium text-ink-soft capitalize">
                {genre}
              </span>
              {themes.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                >
                  {t}
                </span>
              ))}
              {show.english_friendly && (
                <span className="rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-bold text-[#173404] inline-flex items-center gap-1.5">
                  <span className="text-base leading-none" aria-hidden="true">🇬🇧</span>
                  English friendly
                </span>
              )}
            </div>
          )}

          {/* Titel */}
          <h2 className="text-2xl font-medium tracking-tight text-ink leading-tight sm:text-3xl">
            {show.titel}
          </h2>
          <div className="mt-2 text-sm text-ink-muted">
            {show.venues.map(v => v.theater_afkorting).join(" · ")} · {show.gezelschap_display}
          </div>
        </div>

        {/* Over het stuk */}
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink-muted">
            Over het stuk
          </h3>
          {show.interesting_because && (
            <p className="text-base font-medium text-ink leading-relaxed mb-3">
              {show.interesting_because}
            </p>
          )}
          <p className="text-sm text-ink-soft leading-relaxed">
            {show.lange_samenvatting}
          </p>
          {show.based_on && (
            <div className="text-xs text-ink-muted italic mt-3">
              Op basis van {show.based_on}
            </div>
          )}
        </section>

        {/* Tickets + speeldata per venue */}
        <section className="border-t border-line p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-medium uppercase tracking-widest text-ink-muted">
              Tickets
            </h3>
            {show.ticket_url && (
              <a
                href={show.ticket_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
              >
                Naar tickets
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div className="space-y-5">
            {show.venues.map(v => {
              const dates = parseDates(v.speeldata);
              const MAX = 18;
              const visible = dates.slice(0, MAX);
              const overflow = dates.length - visible.length;
              return (
                <div key={v.theater_id}>
                  <div className="mb-2 text-xs font-bold text-ink uppercase tracking-wider">
                    {v.theater_naam} <span className="font-normal text-ink-muted">· {v.theater_stad}</span>
                  </div>
                  {visible.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3 md:grid-cols-4">
                        {visible.map((d, i) => {
                          const isEn = enDays.has(d.getDay());
                          return (
                            <div key={i} className="flex items-center justify-between text-sm text-ink-soft">
                              <span className="lowercase">{formatDateNL(d)}</span>
                              {isEn && (
                                <span
                                  className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium"
                                  style={{ background: NEON_BG, color: NEON_TEXT }}
                                >
                                  EN
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {overflow > 0 && (
                        <div className="mt-2 text-xs text-ink-muted">
                          + {overflow} meer — controleer de ticketlink
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-ink-faint italic">
                      Speeldata via de ticketlink
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Recensies */}
        {show.pers_quotes.length > 0 && (
          <section className="border-t border-line p-6 sm:p-8">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-ink-muted">
              📰 Recensies
            </h3>
            <div className="space-y-3">
              {show.pers_quotes.map((p, i) => (
                <div key={i} className="rounded-2xl bg-[#F8F6EF] p-4">
                  {p.sterren !== null && (
                    <div className="mb-2 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          className={idx < (p.sterren ?? 0) ? "fill-[#E5B53A] stroke-[#E5B53A]" : "stroke-line"}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm italic text-ink-soft leading-relaxed">&ldquo;{p.quote}&rdquo;</p>
                  <div className="mt-2 text-xs text-ink-muted">— {p.bron}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Over het gezelschap */}
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink-muted">
            Over het gezelschap
          </h3>
          <div className="mb-2 text-base font-medium text-ink">{show.gezelschap_display}</div>
          {show.regisseur && (
            <div className="text-xs text-ink-muted mb-3">Regie van dit stuk: {show.regisseur}</div>
          )}
          {show.gezelschap_url && (
            <a
              href={show.gezelschap_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink underline-offset-2 hover:underline"
            >
              Naar website {show.gezelschap_display} <ExternalLink size={11} />
            </a>
          )}
        </section>

        {/* Over het theater */}
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink-muted">
            Over het theater
          </h3>
          <div className="mb-2 text-base font-medium text-ink">{show.theater_naam}</div>
          {show.theater_url && (
            <div className="mb-4">
              <a
                href={show.theater_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink underline-offset-2 hover:underline"
              >
                Meer over dit theater <ExternalLink size={11} />
              </a>
            </div>
          )}
          {/* 2-koloms: theater-foto links, Google Maps rechts */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative rounded-2xl overflow-hidden border border-line aspect-[4/3] bg-[#F1EFE8]">
              {show.theater_foto_url ? (
                <>
                  <img
                    src={show.theater_foto_url}
                    alt={show.theater_naam}
                    className="absolute inset-0 block h-full w-full object-cover"
                  />
                  {show.theater_foto_credit && (
                    <div className="absolute bottom-2 right-3 z-10 text-[10px] text-white/85 leading-none pointer-events-none">
                      © {show.theater_foto_credit}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center text-xs text-ink-muted p-4">
                  Foto van {show.theater_naam} volgt
                </div>
              )}
            </div>
            <div className="rounded-2xl overflow-hidden border border-line aspect-[4/3]">
              <iframe
                src={mapsEmbedUrl(show.theater_naam || show.theater)}
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Kaart ${show.theater_naam || show.theater}`}
              />
            </div>
          </div>
          <a
            href={mapsLinkUrl(show.theater_naam || show.theater)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink underline-offset-2 hover:underline"
          >
            Open in Google Maps <ExternalLink size={11} />
          </a>
        </section>

        {/* In de media */}
        {show.media_links.length > 0 && (
          <section className="border-t border-line p-6 sm:p-8">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-ink-muted">
              🎙️ In de media
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {show.media_links.map((m, i) => (
                <a
                  key={i}
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-line p-3.5 hover:bg-[#F8F6EF] transition-colors"
                >
                  {m.type === "video" || m.type === "serie"
                    ? <Play size={20} className="text-accent-cobalt shrink-0" />
                    : <Mic size={20} className="text-accent-cobalt shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink truncate">{m.titel}</div>
                    <div className="text-xs text-ink-muted capitalize">{m.type}</div>
                  </div>
                  <ExternalLink size={14} className="text-ink-faint shrink-0" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
