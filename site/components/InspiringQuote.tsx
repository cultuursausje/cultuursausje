"use client";

/**
 * InspiringQuote — handgeschreven citaten die tussen secties op de pagina
 * verschijnen, zonder gekleurd vlak. De bedoeling is dat ze voelen als
 * een terloops achtergelaten boodschap. Licht roterend voor karakter.
 */
interface Props {
  quote: string;
  author: string;
  /** Lichte rotatie in graden — geeft elke quote zijn eigen karakter. */
  tilt?: number;
  /** Horizontale uitlijning binnen de pagina. */
  align?: "left" | "center" | "right";
}

export function InspiringQuote({ quote, author, tilt = 0, align = "center" }: Props) {
  const alignClass =
    align === "left"
      ? "mr-auto text-left"
      : align === "right"
      ? "ml-auto text-right"
      : "mx-auto text-center";

  return (
    <div className="my-16 px-6 sm:my-20 sm:px-10">
      <figure
        className={`max-w-2xl ${alignClass}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <blockquote className="font-handwritten text-2xl leading-snug text-ink/75 sm:text-3xl">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="mt-2 font-handwritten text-base text-ink/55 sm:text-lg">
          — {author}
        </figcaption>
      </figure>
    </div>
  );
}
