"use client";

import { useLang } from "@/lib/i18n";

/**
 * InspiringQuote — handgeschreven citaten die tussen secties op de pagina
 * verschijnen, zonder gekleurd vlak. De bedoeling is dat ze voelen als
 * een terloops achtergelaten boodschap. Licht roterend voor karakter.
 *
 * Citaat en auteurnaam delen ongeveer dezelfde grootte — het citaat een
 * tikje groter, maar bewust klein zodat de quotes als notitie aanvoelen
 * en niet als aankondiging.
 */
interface Props {
  quote: string;
  quote_en?: string;
  author: string;
  author_en?: string;
  /** Lichte rotatie in graden — geeft elke quote zijn eigen karakter. */
  tilt?: number;
  /** Horizontale uitlijning binnen de pagina. */
  align?: "left" | "center" | "right";
}

export function InspiringQuote({
  quote, quote_en, author, author_en, tilt = 0, align = "center"
}: Props) {
  const { lang } = useLang();
  const text = lang === "en" && quote_en ? quote_en : quote;
  const by = lang === "en" && author_en ? author_en : author;

  const alignClass =
    align === "left"
      ? "mr-auto text-left"
      : align === "right"
      ? "ml-auto text-right"
      : "mx-auto text-center";

  return (
    <div className="my-14 px-6 sm:my-16 sm:px-10">
      <figure
        className={`max-w-xl ${alignClass}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <blockquote className="font-handwritten text-base leading-snug text-ink/70 sm:text-lg">
          &ldquo;{text}&rdquo;
        </blockquote>
        <figcaption className="mt-1 font-handwritten text-base text-ink/55 sm:text-lg">
          — {by}
        </figcaption>
      </figure>
    </div>
  );
}
