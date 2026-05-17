"use client";

import {
  Heart, X,
  Play, Mic, ExternalLink, Star
} from "lucide-react";
import type { ShowDisplay } from "@/types";
import { photoBgForShow } from "@/lib/colors";
import { englishDays, formatDateNL } from "@/lib/dates";

const NEON_BG = "#B5FF52";
const NEON_TEXT = "#173404";
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
    <div className="relative shrink-0 snap-start w-40 sm:w-44">
      <button
        type="button"
        onClick={onSelect}
        className={`relative block w-full aspect-[3/4] overflow-hidden rounded-2xl text-left transition-all ${
          isActive
            ? "ring-2 ring-ink scale-[1.02]"
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

  return (
    <div className="mt-4 space-y-3">
      {/* Header-paneel: pills, titel, gezelschap, beschrijving */}
      <div
        className="relative rounded-2xl p-4 sm:p-5"
        style={{ background: PANEL_BG }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full hover:bg-line transition-colors"
          aria-label="Sluiten"
        >
          <X size={14} />
        </button>
        <button
          onClick={onToggleFav}
          className="absolute top-3 right-12 flex h-7 w-7 items-center justify-center rounded-full hover:bg-line transition-colors"
          aria-label="Favoriet"
        >
          <Heart
            size={14}
            className={isFavorite ? "fill-[#FF3D8B] stroke-[#FF3D8B]" : "stroke-ink-soft"}
          />
        </button>

        <div className="flex flex-wrap items-center gap-1.5 mb-2 pr-20">
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

        {fullDescription && (
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            {fullDescription}
          </p>
        )}
        {show.based_on && (
          <div className="mt-2 text-xs text-ink-muted italic">
            Op basis van {show.based_on}
          </div>
        )}
      </div>

      {/* Speeldata + locatie gecombineerd in één paneel */}
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{ background: PANEL_BG }}
      >
        <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
          <h4 className="text-xs font-medium uppercase tracking-widest text-ink-muted">
            Speeldata
          </h4>
          {show.ticket_url && (
            <a
              href={show.ticket_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-ink hover:underline underline-offset-2 sm:text-sm"
            >
              Naar de voorstelling op {show.gezelschap_display}
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        <div className="space-y-5">
          {venues.map((v, i) => {
            const dates = parseDates(v.speeldata);
            const MAX = 18;
            const visible = dates.slice(0, MAX);
            const overflow = dates.length - visible.length;
            return (
              <div key={v.theater_id} className={i > 0 ? "border-t border-white/70 pt-5" : ""}>
                {/* Theater-naam met link naar website */}
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

                {/* Datums */}
                {visible.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
                      {visible.map((d, j) => {
                        const isEn = enDays.has(d.getDay());
                        return (
                          <div key={j} className="flex items-center justify-between text-xs text-ink-soft sm:text-sm">
                            <span className="lowercase">{formatDateNL(d)}</span>
                            {isEn && (
                              <span
                                className="ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium"
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
                      <div className="mt-1.5 text-[11px] text-ink-muted">
                        + {overflow} meer — controleer de link hierboven
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-[11px] text-ink-faint italic">
                    Speeldata via de link hierboven
                  </div>
                )}

                {/* Compactere maps view — beperkt in breedte op desktop */}
                <div className="mt-3 rounded-xl overflow-hidden aspect-[16/9] sm:max-w-md">
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
                  Open in Google Maps <ExternalLink size={11} />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recensies-paneel */}
      {show.pers_quotes.length > 0 && (
        <div
          className="rounded-2xl p-4 sm:p-5"
          style={{ background: PANEL_BG }}
        >
          <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-muted">
            Recensies
          </h4>
          <div className="space-y-2">
            {show.pers_quotes.map((p, i) => (
              <div key={i} className="rounded-xl bg-white/70 p-3">
                {p.sterren !== null && (
                  <div className="mb-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        className={idx < (p.sterren ?? 0) ? "fill-[#E5B53A] stroke-[#E5B53A]" : "stroke-line"}
                      />
                    ))}
                  </div>
                )}
                <p className="text-xs italic text-ink-soft leading-relaxed sm:text-sm">&ldquo;{p.quote}&rdquo;</p>
                <div className="mt-1 text-[10px] text-ink-muted">— {p.bron}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media-paneel */}
      {show.media_links.length > 0 && (
        <div
          className="rounded-2xl p-4 sm:p-5"
          style={{ background: PANEL_BG }}
        >
          <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-muted">
            In de media
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
        </div>
      )}
    </div>
  );
}

