"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Festival, ShowDisplay } from "@/types";
import { useT, useLang, translatePeriode } from "@/lib/i18n";
import { FestivalModal } from "./FestivalModal";

interface Props {
  festivals: Festival[];
  /** Reeds gefilterde shows (city/month/theater/gezelschap filters al toegepast) */
  shows: ShowDisplay[];
}

const INITIAL_COUNT = 4;

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
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  // Sorteer festivals op aankomende datum — voorbije gaan naar achteren
  const sortedFestivals = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    return sortFestivalsByDate(festivals, currentMonth);
  }, [festivals]);

  const visible = expanded ? sortedFestivals : sortedFestivals.slice(0, INITIAL_COUNT);
  const open = openId ? sortedFestivals.find(f => f.id === openId) : null;

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
                    {translatePeriode(f.periode, lang)} · {f.plaats}
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
              {expanded ? <>{t("button.less")} <ChevronUp size={14} /></> : <>{t("button.seeMore")} <ChevronDown size={14} /></>}
            </button>
          </div>
        )}
      </div>

      {open && (
        <FestivalModal
          festival={open}
          shows={shows}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}
