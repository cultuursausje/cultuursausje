import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { festivals } from "@/data/festivals";

/**
 * Share-pagina voor Cultuursausje — toont alle Amsterdamse voorstellingen
 * en theaterfestivals die deze maand (en eventueel via querystring een
 * specifieke maand) spelen, met per item een download-knop voor een
 * 1080×1350 Instagram-portrait afbeelding.
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

// Bump deze waarde wanneer je data wijzigt en de gegenereerde PNG's
// niet ververst lijken te worden — Vercel cachet ImageResponse-output
// agressief. Een nieuwe `v=` waarde maakt het feitelijk een nieuwe URL.
const IMAGE_VERSION = 22;

const MONTHS_NL: Record<string, number> = {
  januari: 1, februari: 2, maart: 3, april: 4, mei: 5, juni: 6,
  juli: 7, augustus: 8, september: 9, oktober: 10, november: 11, december: 12
};

/** Parseert een vrije-tekst periode zoals "Juni", "Mei – Juni" of
 *  "Eind mei – begin juni" naar een start/end-maandnummer (1-12). */
function parsePeriode(periode: string): { start: number; end: number } {
  const parts = periode.toLowerCase().split(/[–-]/).map((s) => s.trim());
  const findMonth = (text: string): number => {
    for (const [name, num] of Object.entries(MONTHS_NL)) {
      if (text.includes(name)) return num;
    }
    return 12;
  };
  const start = findMonth(parts[0]);
  const end = parts[1] ? findMonth(parts[1]) : start;
  return { start, end };
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

  // Voorstellingen-filter: speelt in {city} op een datum die start met {monthPrefix}
  const filteredShows = data.shows.filter((show) => {
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

  // Festival-filter: speelt in {city} én de periode overlapt met de maand
  const monthNum = parseInt(monthPrefix.split("-")[1], 10);
  const cityLower = city.toLowerCase();
  const filteredFestivals = festivals.filter((f) => {
    if (!f.plaats.toLowerCase().includes(cityLower)) return false;
    const { start, end } = parsePeriode(f.periode);
    return monthNum >= start && monthNum <= end;
  });

  // Vrolijke maand-titel
  const [yStr, mStr] = monthPrefix.split("-");
  const monthNames = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];
  const monthIdx = parseInt(mStr, 10) - 1;
  const monthLabel = `${monthNames[monthIdx]} ${yStr}`;

  const nothing = filteredShows.length === 0 && filteredFestivals.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-4xl text-ink tracking-tight">
        Instagram-kaarten
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Voorstellingen en theaterfestivals in <strong>{city}</strong> in <strong>{monthLabel}</strong>.
        Klik op een kaart om een 1080×1350 portrait-afbeelding te downloaden voor je Instagram.
      </p>

      <div className="mt-4 text-xs text-ink-faint">
        Andere maand? Gebruik <code>?month=YYYY-MM</code> in de URL — bv.{" "}
        <code>/share?month=2026-09</code>.
        Andere stad? <code>?city=Rotterdam</code>.
      </div>

      {nothing ? (
        <p className="mt-10 text-base text-ink-muted">
          Geen voorstellingen of festivals gevonden voor {city} in {monthLabel}.
        </p>
      ) : (
        <>
          {/* Cover-kaart bovenaan: collage van alle voorstellings-foto's
              met twee centrale pills. Eerste in de feed-volgorde van
              een Instagram-carousel. */}
          <h2 className="mt-12 font-display text-2xl text-ink tracking-tight">
            Cover
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ShareCard
              imageUrl={`/api/instagram-card-cover?month=${monthPrefix}&city=${encodeURIComponent(city)}&v=${IMAGE_VERSION}`}
              downloadId={`cover-${monthPrefix}-${city.toLowerCase()}`}
              titel={`Theater tips ${city} ${monthLabel.split(" ")[0]}`}
              subtitle="Cover voor de carousel"
            />
          </div>

          {filteredShows.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-2xl text-ink tracking-tight">
                Voorstellingen
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredShows.map((show) => (
                  <ShareCard
                    key={show.id}
                    imageUrl={`/api/instagram-card/${show.id}?v=${IMAGE_VERSION}`}
                    downloadId={show.id}
                    titel={show.titel}
                    subtitle={show.gezelschap}
                  />
                ))}
              </div>
            </>
          )}

          {filteredFestivals.length > 0 && (
            <>
              <h2 className="mt-16 font-display text-2xl text-ink tracking-tight">
                Theaterfestivals
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFestivals.map((festival) => (
                  <ShareCard
                    key={festival.id}
                    imageUrl={`/api/instagram-card-festival/${festival.id}?v=${IMAGE_VERSION}`}
                    downloadId={`festival-${festival.id}`}
                    titel={festival.naam}
                    subtitle={festival.tagline ?? festival.plaats}
                  />
                ))}
              </div>

              {/* Per festival: een sectie met alle losse voorstellingen
                  die in het festival-programma staan. Handig om voor elk
                  een eigen Instagram-kaart te kunnen delen. */}
              {filteredFestivals.map((festival) =>
                festival.voorstellingen && festival.voorstellingen.length > 0 ? (
                  <div key={`vs-${festival.id}`}>
                    <h2 className="mt-16 font-display text-2xl text-ink tracking-tight">
                      Voorstellingen tijdens {festival.naam}
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {festival.voorstellingen.map((v) => (
                        <ShareCard
                          key={v.id}
                          imageUrl={`/api/instagram-card-festival-show/${v.id}?v=${IMAGE_VERSION}`}
                          downloadId={`festival-show-${v.id}`}
                          titel={v.titel}
                          subtitle={v.gezelschap ?? festival.naam}
                        />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

function ShareCard({
  imageUrl,
  downloadId,
  titel,
  subtitle
}: {
  imageUrl: string;
  downloadId: string;
  titel: string;
  subtitle: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
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
        <div className="mt-0.5 text-xs text-ink-muted">{subtitle}</div>
        <Link
          href={imageUrl}
          download={`cultuursausje-${downloadId}.png`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
        >
          Download
        </Link>
      </div>
    </div>
  );
}
