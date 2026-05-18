"use client";

import { useT } from "@/lib/i18n";

/**
 * Footer onderaan de pagina. Bescheiden en klein: alleen de essentiële
 * praktische info (disclaimer, copyright, foto-credit) op de natuurlijke
 * pagina-achtergrond, zonder gekleurd vlak.
 */
export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4">
      <div className="mx-auto max-w-2xl px-6 py-10 text-center text-[11px] leading-relaxed text-ink-faint sm:py-12 sm:text-xs">
        <p>{t("footer.disclaimer")}</p>
        <p className="mt-3">© {year} Cultuursausje</p>
        <p className="mt-1">{t("footer.photoCredit")}</p>
      </div>
    </footer>
  );
}
