"use client";

import { useT } from "@/lib/i18n";

/**
 * Footer onderaan de pagina. Compact, donker, met de essentiële info:
 *   - korte missie van de site
 *   - disclaimer (data kunnen wijzigen)
 *   - principe (geen ads / commissies)
 *   - copyright + foto-credit
 *
 * Bewust GEEN contactlink / e-mail, GEEN navigatie-kolommen,
 * GEEN partners-logo's. De site is een persoonlijk project en de
 * footer past bij die toon: kort, eerlijk, klaar.
 */
export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 bg-ink text-white/85">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-12">
        {/* Brand + missie */}
        <div className="mb-8">
          <div className="font-display text-2xl text-white sm:text-3xl">
            Cultuursausje
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
            {t("footer.mission")}
          </p>
        </div>

        {/* Disclaimer + principe — als twee korte uitspraken naast elkaar
            op desktop, gestapeld op mobiel */}
        <div className="grid gap-4 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/70 sm:grid-cols-2 sm:gap-8 sm:text-sm">
          <p>{t("footer.disclaimer")}</p>
          <p>{t("footer.principle")}</p>
        </div>

        {/* Onderkant — copyright + foto-credit */}
        <div className="mt-8 flex flex-col gap-1 border-t border-white/15 pt-6 text-[11px] text-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-xs">
          <div>© {year} Cultuursausje</div>
          <div>{t("footer.photoCredit")}</div>
        </div>
      </div>
    </footer>
  );
}
