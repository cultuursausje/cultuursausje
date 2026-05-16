"use client";

import {
  Heart, ArrowRight, X,
  Play, Mic, ExternalLink, Star
} from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";
import { datesInPeriod, englishDays, formatDateNL } from "@/lib/dates";

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
  const hasPhoto = !!show.foto_url;

  if (isExpanded) {
    return (
      <ExpandedCard
        show={show}
        pill={pill}
        isFavorite={isFavorite}
        onClose={onCollapse}
        onToggleFav={onToggleFav}
      />
    );
  }

  return (
    <div className="relative cursor-pointer">
      <div
        className={`flip-card w-full rounded-3xl ${isFlipped ? "is-flipped" : ""}`}
        onClick={onFlip}
      >
        <div className="flip-inner rounded-3xl">
          {/* Front */}
          <div
            className="flip-face flex items-end p-4 min-h-[220px]"
            style={{ background: photoBg }}
          >
            {hasPhoto && (
              <img
                src={show.foto_url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
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
                © {show.gezelschap_display}
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
            <div className="text-sm text-ink-muted">{show.theater_display}</div>
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
  const allDates = datesInPeriod(show.speelperiode_start, show.speelperiode_end);
  const MAX_DATES = 24;
  const dates = allDates.slice(0, MAX_DATES);
  const overflow = allDates.length - dates.length;
  const genre = genreOfShow(show);
  const themes = themesOfShow(show);

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
        {/* Header */}
        <div className="p-6 pt-7 sm:p-8 sm:pt-9 pr-28">
          {/* Top pills: thema's + english-friendly met vlaggetje */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {themes.map((t, i) => (
              <span
                key={i}
                className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-medium text-ink-soft"
              >
                {t}
              </span>
            ))}
            {show.english_friendly && (
              <span
                className="rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-bold text-[#173404] inline-flex items-center gap-1.5"
              >
                <span className="text-base leading-none" aria-hidden="true">🇬🇧</span>
                English friendly
              </span>
            )}
          </div>

          {/* Titel */}
          <h2 className="text-2xl font-medium tracking-tight text-ink leading-tight sm:text-3xl">
            {show.titel}
          </h2>

          {/* Type + Theater + Gezelschap stat-blok */}
          <div className="mt-5 grid grid-cols-3 rounded-2xl bg-[#F1EFE8] overflow-hidden">
            <div className="p-4 sm:p-5 text-center border-r border-white/60">
              <div className="text-xs font-bold text-ink mb-1.5">
                {genre === "dans" ? "💃" : "🎭"} Type
              </div>
              <div className="text-sm text-ink-soft capitalize">{genre}</div>
            </div>
            <div className="p-4 sm:p-5 text-center border-r border-white/60">
              <div className="text-xs font-bold text-ink mb-1.5">🏛️ Theater</div>
              <div className="text-sm text-ink-soft">{show.theater_display}</div>
            </div>
            <div className="p-4 sm:p-5 text-center">
              <div className="text-xs font-bold text-ink mb-1.5">👥 Gezelschap</div>
              <div className="text-sm text-ink-soft">{show.gezelschap_display}</div>
            </div>
          </div>
        </div>

        {/* Beschrijving — bold interesting + normale lange samenvatting */}
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink-muted">
            Over
          </h3>
          {show.based_on && (
            <div className="text-xs text-ink-muted italic mb-3">
              Op basis van {show.based_on}
            </div>
          )}
          {show.interesting_because && (
            <p className="text-base font-medium text-ink leading-relaxed mb-3">
              {show.interesting_because}
            </p>
          )}
          <p className="text-sm text-ink-soft leading-relaxed">
            {show.lange_samenvatting}
          </p>
        </section>

        {/* Koop tickets + speeldata */}
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-ink-muted">
            🎫 Tickets
          </h3>
          {show.ticket_url && (
            <a
              href={show.ticket_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors mb-5"
            >
              Naar tickets
              <ExternalLink size={14} />
            </a>
          )}

          {dates.length > 0 && (
            <>
              <div className="text-xs font-medium text-ink-muted mb-2">Speeldata</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3 md:grid-cols-4">
                {dates.map((d, i) => {
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
                <div className="mt-3 text-xs text-ink-muted">
                  + {overflow} meer — controleer de ticketlink voor de exacte speeldagen
                </div>
              )}
            </>
          )}
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
            👥 Over het gezelschap
          </h3>
          <div className="mb-1 text-base font-medium text-ink">{show.gezelschap_display}</div>
          {show.regisseur && (
            <div className="text-xs text-ink-muted mb-3">Regie van dit stuk: {show.regisseur}</div>
          )}
          {show.gezelschap_beschrijving && (
            <p className="text-sm text-ink-soft leading-relaxed mb-3">
              {show.gezelschap_beschrijving}
            </p>
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
            🏛️ Over het theater
          </h3>
          <div className="mb-1 text-base font-medium text-ink">{show.theater_naam}</div>
          {show.theater_beschrijving && (
            <p className="text-sm text-ink-soft leading-relaxed mb-4">
              {show.theater_beschrijving}
            </p>
          )}
          {/* Maps embed */}
          <div className="rounded-2xl overflow-hidden border border-line mb-4 aspect-[16/9]">
            <iframe
              src={mapsEmbedUrl(show.theater_naam || show.theater)}
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Kaart ${show.theater_naam || show.theater}`}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href={mapsLinkUrl(show.theater_naam || show.theater)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-ink-muted hover:text-ink underline-offset-2 hover:underline"
            >
              Open in Google Maps <ExternalLink size={11} />
            </a>
            {show.theater_url && (
              <>
                <span className="text-ink-faint">·</span>
                <a
                  href={show.theater_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-ink-muted hover:text-ink underline-offset-2 hover:underline"
                >
                  Meer over dit theater <ExternalLink size={11} />
                </a>
              </>
            )}
          </div>
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
