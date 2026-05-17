"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useT } from "@/lib/i18n";

interface VoordeelTip {
  naam: string;
  url: string;
}

const VOORDEEL_TIPS: VoordeelTip[] = [
  { naam: "CJP", url: "https://www.cjp.nl" },
  { naam: "Podiumpas", url: "https://www.podiumpas.nl" },
  { naam: "Stadspas Amsterdam", url: "https://www.amsterdam.nl/stadspas" },
  { naam: "Uitpas Amsterdam", url: "https://www.iamsterdam.com/en/tickets/uitpas" },
  { naam: "VriendenLoterij", url: "https://www.vriendenloterij.nl" },
  { naam: "We Are Public", url: "https://wearepublic.nl" }
];

const INITIAL_COUNT = 8;

export function VoordeelSection() {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? VOORDEEL_TIPS : VOORDEEL_TIPS.slice(0, INITIAL_COUNT);
  const hasMore = VOORDEEL_TIPS.length > INITIAL_COUNT;

  return (
    <section id="voordeel" className="mt-20 sm:mt-24">
      <div
        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "#FF3B7C" }}
      >
        <h2 className="font-display mb-3 text-3xl text-white tracking-tight sm:text-4xl">
          {t("section.voordeel.title")}
        </h2>
        <p className="mb-8 max-w-xl text-sm text-white/70">
          {t("section.voordeel.subtitle")}
        </p>

        <div className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(tip => (
            <a
              key={tip.naam}
              href={tip.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-base font-bold text-white hover:underline underline-offset-2"
            >
              {tip.naam}
              <ExternalLink size={12} className="text-white/60" />
            </a>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              {expanded ? <>{t("button.less")} <ChevronUp size={14} /></> : <>{t("button.seeMore")} <ChevronDown size={14} /></>}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
