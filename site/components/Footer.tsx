"use client";

import { useT } from "@/lib/i18n";

/**
 * Footer onderaan de pagina. Geen gekleurd vlak: gewoon op de
 * pagina-achtergrond, dezelfde rustige toon als de quotes erboven.
 * Houdt het bij wat de site eerlijk en bruikbaar maakt:
 *   - missie (toegankelijkheid van theater voor iedereen)
 *   - disclaimer (data kunnen wijzigen, check bij het theater)
 *   - copyright + foto-credit
 */
export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 text-ink-soft">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-12">
        {/* Brand + missie */}
        <div className="mb-6 text-center">
          <div className="font-display text-2xl text-ink sm:text-3xl">
            Cultuursausje
          </div>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            {t("footer.mission")}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="mx-auto max-w-xl text-center text-xs leading-relaxed text-ink-muted sm:text-sm">
          {t("footer.disclaimer")}
        </p>

        {/* Copyright + foto-credit */}
        <div className="mt-8 flex flex-col items-center gap-1 text-[11px] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-xs">
          <div>© {year} Cultuursausje</div>
          <div>{t("footer.photoCredit")}</div>
        </div>
      </div>
    </footer>
  );
}
