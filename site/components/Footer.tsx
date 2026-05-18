"use client";

import { useT } from "@/lib/i18n";

/**
 * Footer onderaan de pagina, onder een dunne horizontale lijn.
 * Bescheiden en klein: alleen de essentiële praktische info
 * (disclaimer, foto-credit, copyright) op de natuurlijke
 * pagina-achtergrond, zonder gekleurd vlak.
 */
export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line pt-6 text-xs leading-relaxed text-ink-faint">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <p>{t("footer.disclaimer")}</p>
        <p>{t("footer.photoCredit")}</p>
        <p>© {year} Cultuursausje</p>
      </div>
    </footer>
  );
}
