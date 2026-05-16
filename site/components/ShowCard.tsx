"use client";

import {
  Heart, MapPin, Drama, ArrowRight, X,
  Calendar, Play, Mic, ExternalLink, Star, Sparkles, BookOpen
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
        photoBg={photoBg}
        hasPhoto={hasPhoto}
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
          </div>

          {/* Back */}
          <div className="flip-face flip-back bg-white pt-14 px-5 pb-12 flex flex-col border border-line">
            <p className="text-sm italic text-ink-soft leading-relaxed mb-3">
              {show.korte_samenvatting}
            </p>
            <div className="space-y-2 text-sm text-ink-soft">
              <Row icon={<Drama size={14} />} text={show.gezelschap_display} />
              <Row icon={<MapPin size={14} />} text={show.theater_display} />
            </div>
          </div>
        </div>
      </div>

      {/* Meer-knop — zwevend, los van flip-card zodat clicks niet bubbelen naar onFlip */}
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

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 leading-snug">
      <span className="text-ink-faint mt-0.5 shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Uitvergrote card
// ---------------------------------------------------------------------------

interface ExpandedProps {
  show: ShowDisplay;
  pill: string;
  photoBg: string;
  hasPhoto: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFav: () => void;
}

function ExpandedCard({
  show, pill, photoBg, hasPhoto, isFavorite, onClose, onToggleFav
}: ExpandedProps) {
  const enDays = englishDays(show.english_friendly, show.english_friendly_detail);
  const allDates = datesInPeriod(show.speelperiode_start, show.speelperiode_end);
  // bij langlopende voorstellingen tonen we de eerste 18 datums + counter
  const MAX_DATES = 18;
  const dates = allDates.slice(0, MAX_DATES);
  const overflow = allDates.length - dates.length;

  return (
    <div className="relative bg-white rounded-3xl border border-line overflow-hidden">
      {/* Close + heart top-right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EFE8] hover:bg-line transition-colors"
        aria-label="Sluiten"
      >
        <X size={18} />
      </button>
      <button
        onClick={onToggleFav}
        className="absolute top-4 right-16 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EFE8] hover:bg-line transition-colors"
        aria-label="Favoriet"
      >
        <Heart
          size={18}
          className={isFavorite ? "fill-[#FF3D8B] stroke-[#FF3D8B]" : "stroke-ink-soft"}
        />
      </button>

      {/* Top: photo + main info */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <div
          className="relative aspect-[3/4] md:aspect-auto md:min-h-[360px]"
          style={{ background: photoBg }}
        >
          {hasPhoto && (
            <img
              src={show.foto_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold z-10"
            style={{ background: NEON_BG, color: NEON_TEXT }}
          >
            {pill}
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-medium tracking-tight text-ink leading-tight sm:text-3xl">
            {show.titel}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{show.gezelschap_display}</p>
          {show.english_friendly && (
            <div className="mt-3 inline-flex items-center rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#173404]">
              English friendly
              {show.english_friendly_detail && (
                <span className="ml-1.5 font-normal text-[#3B6D11]">· {show.english_friendly_detail}</span>
              )}
            </div>
          )}
          <div className="mt-5 space-y-2 text-sm text-ink-soft">
            <Row icon={<MapPin size={14} />} text={show.theater} />
            {show.regisseur && <Row icon={<Drama size={14} />} text={`Regie: ${show.regisseur}`} />}
            {show.based_on && <Row icon={<BookOpen size={14} />} text={show.based_on} />}
          </div>
        </div>
      </div>

      {/* Waarom dit interessant kan zijn */}
      {show.interesting_because && (
        <section className="border-t border-line bg-[#FAFAF1] p-6 sm:p-8">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
            <Sparkles size={13} /> Waarom dit interessant kan zijn
          </h3>
          <p className="text-sm leading-relaxed text-ink-soft">{show.interesting_because}</p>
        </section>
      )}

      {/* Over de voorstelling */}
      <section className="border-t border-line p-6 sm:p-8">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-muted">
          Over de voorstelling
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">{show.lange_samenvatting}</p>
      </section>

      {/* Speeldata */}
      {dates.length > 0 && (
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
            <Calendar size={13} /> Speeldata
          </h3>
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
        </section>
      )}

      {/* Pers */}
      {show.pers_quotes.length > 0 && (
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-muted">Pers</h3>
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

      {/* Media */}
      {show.media_links.length > 0 && (
        <section className="border-t border-line p-6 sm:p-8">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-muted">Media</h3>
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

      {/* Tickets */}
      {show.ticket_url && (
        <section className="border-t border-line p-6 sm:p-8">
          <a
            href={show.ticket_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors"
          >
            Naar tickets
            <ExternalLink size={14} />
          </a>
        </section>
      )}
    </div>
  );
}
