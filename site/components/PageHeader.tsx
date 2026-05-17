"use client";

import { useT } from "@/lib/i18n";

export function PageHeader() {
  const t = useT();
  return (
    <header className="mb-10 sm:mb-14">
      <h1 className="text-5xl font-medium tracking-tight text-ink sm:text-6xl">
        Cultuursausje
      </h1>
      <p className="mt-2 text-xs text-ink-muted sm:text-sm md:text-base xl:whitespace-nowrap">
        {t("header.subtitle")}
      </p>
    </header>
  );
}
