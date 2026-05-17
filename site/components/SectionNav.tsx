"use client";

import { useT } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";

const NAV_ITEMS = [
  { tKey: "nav.recensies", anchor: "recensies" },
  { tKey: "nav.plan", anchor: "plan" },
  { tKey: "nav.voorstellingen", anchor: "voorstellingen" },
  { tKey: "nav.festivals", anchor: "festivals" },
  { tKey: "nav.voordeel", anchor: "voordeel" },
  { tKey: "nav.gezelschappen", anchor: "gezelschappen" },
  { tKey: "nav.theaters", anchor: "theaters" }
] as const;

export function SectionNav() {
  const t = useT();
  return (
    <nav className="mb-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm font-bold text-ink sm:text-base sm:gap-x-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
        {NAV_ITEMS.map((item, i) => (
          <span key={item.anchor} className="flex items-center gap-x-3 sm:gap-x-4">
            {i > 0 && (
              <span className="text-ink-faint/70" aria-hidden="true">|</span>
            )}
            <a
              href={`#${item.anchor}`}
              className="hover:underline underline-offset-4 transition-colors"
            >
              {t(item.tKey)}
            </a>
          </span>
        ))}
      </div>
      <LanguageSwitch />
    </nav>
  );
}
