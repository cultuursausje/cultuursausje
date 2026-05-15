"use client";

import {
  Heart, MapPin, Drama, BookOpen, ArrowRight, X,
  Calendar, Play, Mic, ExternalLink, Star
} from "lucide-react";
import type { ShowDisplay } from "@/types";
import { accentForShow, photoBgForShow } from "@/lib/colors";

interface Props {
  show: ShowDisplay;
  pill: string;
  monthKey: string; // unique per (show, month) for flip key
  isFlipped: boolean;
  isExpanded: boolean;
  isFavorite: boolean;
  isMobile: boolean;
  onFlip: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  onToggleFav: () => void;
}

// Verschillende verhoudingen voor het speelse masonry-effect.
// Deterministisch zodat dezelfde voorstelling altijd dezelfde vorm krijgt.
const ASPECTS = ["3/4", "4/5", "1/1", "5/6", "5/7"];
function aspectForShow(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return ASPECTS[Math.abs(h) % ASPECTS.length];
}

export function ShowCard({
  show, pill, isFlipped, isFavorite,
  onFlip, onExpand, onToggleFav
}: Props) {
  const accent = accentForShow(show.id);
  const photoBg = photoBgForShow(show.id);
  const hasPhoto = !!show.foto_url;
  const aspect = aspectForShow(show.id);

  return (
    <div
      className="relative cursor-pointer"
      style={{ aspectRatio: aspect }}
    >
      <div
        className={`flip-card h-full w-full rounded-3xl ${isFlipped ? "is-flipped" : ""}`}
        onClick={onFlip}
      >
        <div className="flip-inner rounded-3xl">
          {/* Front */}
          <div className="flip-face flex items-end p-4" style={{ background: photoBg }}>
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
          <div className="flip-face flip-back bg-white pt-14 px-5 pb-5 flex flex-col border border-line">
            <p className="text-sm italic text-ink-soft leading-relaxed mb-3">
              {show.korte_samenvatting}
            </p>
            <div className="space-y-2 text-sm text-ink-soft mb-auto">
              <Row icon={<BookOpen size={14} />} text={show.titel} />
              <Row icon={<Drama size={14} />} text={show.gezelschap_display} />
              <Row icon={<MapPin size={14} />} text={show.theater_display} />
            </div>
            <button
              onClick={e => { e.stopPropagation(); onExpand(); }}
              className="mt-3 flex items-center justify-between rounded-xl bg-ink px-3.5 py-2 text-xs font-medium text-white hover:bg-black transition-colors"
            >
              Meer lezen
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Pill — top left, above flip */}
      <div
        className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold z-20 pointer-events-none"
        style={{ background: accent.bg, color: accent.text }}
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

interface ExpandedProps {
  show: ShowDisplay;
  pill: string;
  accent: { bg: string; text: string };
  photoBg: string;
  hasPhoto: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFav: () => void;
}

export function ExpandedContent({
  show, pill, accent, photoBg, hasPhoto, isFavorite, onClose, onToggleFav
}: ExpandedProps) {
  return (
    <div className="flex h-full flex-col">
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

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-0">
        <div
          className="relative flex aspect-[3/4] items-end p-5 md:aspect-auto md:min-h-[420px]"
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
            className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold z-10"
            style={{ background: accent.bg, color: accent.text }}
          >
            {pill}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-medium tracking-tight text-ink leading-tight md:text-3xl">
            {show.titel}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{show.gezelschap_display}</p>

          {show.english_friendly && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#173404]">
                English friendly
                {show.english_friendly_detail && (
                  <span className="ml-1.5 font-normal text-[#3B6D11]">
                    · {show.english_friendly_detail}
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="mt-5 space-y-2.5 text-sm">
            <Row icon={<MapPin size={15} />} text={show.theater} />
            <Row icon={<Calendar size={15} />} text={pill} />
            {show.regisseur && <Row icon={<Drama size={15} />} text={`Regie: ${show.regisseur}`} />}
            {show.based_on && <Row icon={<BookOpen size={15} />} text={show.based_on} />}
          </div>
        </div>
      </div>

      <div className="border-t border-line p-6 md:p-8">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-muted">
          Over de voorstelling
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">{show.lange_samenvatting}</p>
      </div>

      {show.pers_quotes.length > 0 && (
        <div className="border-t border-line p-6 md:p-8">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-muted">
            Pers
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
                <p className="text-sm italic text-ink-soft leading-relaxed">
                  &ldquo;{p.quote}&rdquo;
                </p>
                <div className="mt-2 text-xs text-ink-muted">— {p.bron}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {show.media_links.length > 0 && (
        <div className="border-t border-line p-6 md:p-8">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-muted">
            Media
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
        </div>
      )}

      {show.ticket_url && (
        <div className="border-t border-line p-6 md:p-8">
          <a
            href={show.ticket_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors"
          >
            Naar tickets
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
