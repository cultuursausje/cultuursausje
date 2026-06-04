import Link from "next/link";
import { getSiteData } from "@/lib/data";

/**
 * Share-pagina voor Cultuursausje — toont alle Amsterdamse voorstellingen
 * die deze maand (en eventueel via querystring een specifieke maand)
 * spelen, met per voorstelling een download-knop voor een 1080×1350
 * Instagram-portrait afbeelding.
 *
 * Gebruik:
 *   /share                  → huidige maand, Amsterdam
 *   /share?month=2026-06    → juni 2026, Amsterdam
 *   /share?month=2026-06&city=Rotterdam → juni 2026, Rotterdam
 */
export const revalidate = 600;

interface SearchParams {
  month?: string;
  city?: string;
}

export default async function SharePage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const data = await getSiteData();

  // Bepaal de maand-prefix YYYY-MM
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthPrefix = searchParams.month ?? defaultMonth;
  const city = searchParams.city ?? "Amsterdam";

  // Theater-id → stad lookup, om te bepalen of een show in {city} speelt
  const theaterById = new Map(data.theaters.map((t) => [t.id, t]));

  // Filter shows: speelt in {city} op een datum die start met {monthPrefix}
  // Een voorstelling kan in een stad spelen via theater_id of via tour-stops.
  const filtered = data.shows.filter((show) => {
    // Verzamel alle (venueId, speeldata)-combinaties
    const venues: { venueId: string; dates: string[] }[] = [];
    venues.push({ venueId: show.theater_id, dates: show.speeldata ?? [] });
    (show.tour ?? []).forEach((stop) =>
      venues.push({ venueId: stop.theater_id, dates: stop.speeldata ?? [] })
    );

    return venues.some(({ venueId, dates }) => {
      const venue = theaterById.get(venueId);
      if (!venue || venue.stad !== city) return false;
      return dates.some((d) => d.startsWith(monthPrefix));
    });
  });

  // Vrolijke maand-titel
  const [yStr, mStr] = monthPrefix.split("-");
  const monthNames = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];
  const monthIdx = parseInt(mStr, 10) - 1;
  const monthLabel = `${monthNames[monthIdx]} ${yStr}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-4xl text-ink tracking-tight">
        Instagram-kaarten
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Voorstellingen in <strong>{city}</strong> in <strong>{monthLabel}</strong>.
        Klik op een kaart om een 1080×1350 portrait-afbeelding te downloaden voor je Instagram.
      </p>

      <div className="mt-4 text-xs text-ink-faint">
        Andere maand? Gebruik <code>?month=YYYY-MM</code> in de URL — bv.{" "}
        <code>/share?month=2026-09</code>.
        Andere stad? <code>?city=Rotterdam</code>.
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-base text-ink-muted">
          Geen voorstellingen gevonden voor {city} in {monthLabel}.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((show) => (
            <ShareCard key={show.id} showId={show.id} titel={show.titel} gezelschap={show.gezelschap} />
          ))}
        </div>
      )}
    </main>
  );
}

// Bump deze waarde wanneer je data wijzigt en de gegenereerde PNG's
// niet ververst lijken te worden — Vercel cachet ImageResponse-output
// agressief. Een nieuwe `v=` waarde maakt het feitelijk een nieuwe URL.
const IMAGE_VERSION = 7;

function ShareCard({ showId, titel, gezelschap }: { showId: string; titel: string; gezelschap: string }) {
  const imageUrl = `/api/instagram-card/${showId}?v=${IMAGE_VERSION}`;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      {/* Preview — toont de actuele PNG die de download-knop geeft */}
      <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`Instagram-kaart van ${titel}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="text-sm font-medium text-ink leading-tight">{titel}</div>
        <div className="mt-0.5 text-xs text-ink-muted">{gezelschap}</div>
        <Link
          href={imageUrl}
          download={`cultuursausje-${showId}.png`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
        >
          Download
        </Link>
      </div>
    </div>
  );
}
