"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface VoordeelTip {
  naam: string;
  beschrijving: string;
  url?: string;
}

const VOORDEEL_TIPS: VoordeelTip[] = [
  {
    naam: "Studentenkorting",
    beschrijving:
      "Met je studentenkaart, bewijs van inschrijving of OV-studentenkaart krijg je bij de meeste theaters korting. Geldt ook voor (deeltijd-)studies op latere leeftijd."
  },
  {
    naam: "CJP",
    beschrijving:
      "Korting tot 30 jaar. €10 in het eerste jaar, daarna €17,50 per jaar. Gratis voor middelbare scholieren en mbo'ers.",
    url: "https://www.cjp.nl"
  },
  {
    naam: "Stadspas Amsterdam",
    beschrijving:
      "Korting op een selectie voorstellingen voor Amsterdammers met laag inkomen en beperkt vermogen.",
    url: "https://www.amsterdam.nl/stadspas"
  },
  {
    naam: "Podiumpas",
    beschrijving:
      "Onbeperkt naar voorstellingen en concerten bij deelnemende podia in Nederland.",
    url: "https://www.podiumpas.nl"
  },
  {
    naam: "VriendenLoterij",
    beschrijving:
      "Als deelnemer ga je met 50% korting naar verschillende theaters in Nederland.",
    url: "https://www.vriendenloterij.nl"
  },
  {
    naam: "Kortingen 65+",
    beschrijving:
      "Sommige theaters bieden korting vanaf 65 jaar. Check de kassa of de website van het theater."
  },
  {
    naam: "Mozaïekpas",
    beschrijving:
      "20% korting op tickets en 10% op café-restaurant bij Podium Mozaïek. €15 per seizoen.",
    url: "https://www.podiummozaiek.nl"
  },
  {
    naam: "My Muse & Me",
    beschrijving:
      "Voor 16–35-jarigen: tot 75% korting bij Nationale Opera & Ballet, plus toegang tot exclusieve activiteiten.",
    url: "https://www.operaballet.nl/mymuseme"
  }
];

const INITIAL_COUNT = 4;

export function VoordeelSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? VOORDEEL_TIPS : VOORDEEL_TIPS.slice(0, INITIAL_COUNT);
  const hasMore = VOORDEEL_TIPS.length > INITIAL_COUNT;

  return (
    <section className="mt-20 sm:mt-24">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#1A1A18" }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight sm:text-4xl">
          Met voordeel naar theater
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/70">
          Een lijstje passen, regelingen en kortingsopties om voordeliger naar het theater te gaan.
        </p>

        <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
          {visible.map(tip => (
            <div key={tip.naam}>
              <div className="text-base font-bold text-white">
                {tip.url ? (
                  <a
                    href={tip.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline underline-offset-2"
                  >
                    {tip.naam}
                    <ExternalLink size={12} className="text-white/60" />
                  </a>
                ) : (
                  tip.naam
                )}
              </div>
              <p className="mt-1 text-sm text-white/70 leading-relaxed">
                {tip.beschrijving}
              </p>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              {expanded ? <>Minder <ChevronUp size={14} /></> : <>Bekijk meer <ChevronDown size={14} /></>}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
