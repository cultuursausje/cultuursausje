import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/data";
import { festivals } from "@/data/festivals";

/**
 * Genereert een 1080×1350 Instagram-portrait PNG met een COVER-collage:
 * alle voorstellings-foto's van de geselecteerde maand+stad in een
 * mengelmoes, met centraal twee pills ("Theater tips Amsterdam Juni" en
 * "swipe →") over de foto's heen.
 *
 * Selectie:
 *   - Reguliere shows die in {city} spelen in {monthPrefix}
 *   - Festival-voorstellingen van festivals die in {city}+{monthPrefix} vallen,
 *     MAAR exclusief De Parade en exclusief de overkoepelende festival-foto's
 *
 * Voorbeeld-URL: /api/instagram-card-cover?month=2026-06&city=Amsterdam
 */
export const runtime = "edge";

const MONTH_NAMES_NL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const MONTHS_NL: Record<string, number> = {
  januari: 1, februari: 2, maart: 3, april: 4, mei: 5, juni: 6,
  juli: 7, augustus: 8, september: 9, oktober: 10, november: 11, december: 12
};
const MONTHS_NL_SHORT: Record<string, number> = {
  jan: 1, feb: 2, mrt: 3, apr: 4, jun: 6,
  jul: 7, aug: 8, sep: 9, okt: 10, nov: 11, dec: 12
};

function parsePeriode(periode: string): { start: number; end: number } {
  const parts = periode.toLowerCase().split(/[–-]/).map((s) => s.trim());
  const findMonth = (text: string): number => {
    for (const [name, num] of Object.entries(MONTHS_NL)) {
      if (text.includes(name)) return num;
    }
    for (const [name, num] of Object.entries(MONTHS_NL_SHORT)) {
      if (new RegExp(`\\b${name}\\b`).test(text)) return num;
    }
    return 12;
  };
  const start = findMonth(parts[0]);
  const end = parts[1] ? findMonth(parts[1]) : start;
  return { start, end };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthPrefix = url.searchParams.get("month") ?? defaultMonth;
  const city = url.searchParams.get("city") ?? "Amsterdam";

  const data = await getSiteData();
  const theaterById = new Map(data.theaters.map((t) => [t.id, t]));

  // 1) Foto-URLs van reguliere shows in {city} deze maand
  const showUrls: string[] = [];
  data.shows.forEach((show) => {
    if (!show.foto_url) return;
    const venues: { venueId: string; dates: string[] }[] = [
      { venueId: show.theater_id, dates: show.speeldata ?? [] },
      ...(show.tour ?? []).map((s) => ({ venueId: s.theater_id, dates: s.speeldata ?? [] }))
    ];
    const playsHere = venues.some(({ venueId, dates }) => {
      const venue = theaterById.get(venueId);
      if (!venue || venue.stad !== city) return false;
      return dates.some((d) => d.startsWith(monthPrefix));
    });
    if (playsHere) showUrls.push(show.foto_url);
  });

  // 2) Foto-URLs van festival-voorstellingen, ZONDER De Parade en ZONDER
  //    de overkoepelende festival-foto's zelf.
  //
  //    Speciale curatie voor Julidans: het festival heeft veel internationale
  //    voorstellingen en zou de cover-collage anders volledig domineren.
  //    Daarom nemen we alleen het Nicole Beutler-project mee (Room in Our
  //    House) — de meest aansprekende lokale Julidans-productie.
  const monthNum = parseInt(monthPrefix.split("-")[1], 10);
  const cityLower = city.toLowerCase();
  const festivalShowUrls: string[] = [];
  festivals.forEach((f) => {
    if (f.id === "de-parade") return;
    if (!f.plaats.toLowerCase().includes(cityLower)) return;
    const { start, end } = parsePeriode(f.periode);
    if (!(monthNum >= start && monthNum <= end)) return;
    (f.voorstellingen ?? []).forEach((v) => {
      if (!v.foto_url) return;
      // Julidans: filter op Nicole Beutler — andere internationale acts
      // overslaan zodat de cover niet door Julidans wordt overspoeld.
      if (f.id === "julidans") {
        const gez = (v.gezelschap ?? "").toLowerCase();
        if (!gez.includes("nicole beutler")) return;
      }
      festivalShowUrls.push(v.foto_url);
    });
  });

  // Dedupliceer en filter via parallelle HEAD-checks. Onbereikbare URLs
  // (staging-servers, hotlink-blokkers) zouden Satori anders laten falen.
  const allUrls = Array.from(new Set([...showUrls, ...festivalShowUrls]));
  const probed = await Promise.all(
    allUrls.map(async (u) => {
      try {
        const r = await fetch(u, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Cultuursausje/1.0)",
            Accept: "image/*"
          },
          signal: AbortSignal.timeout(3000)
        });
        return r.ok ? u : null;
      } catch {
        return null;
      }
    })
  );
  const photoUrls = probed.filter((u): u is string => u !== null);

  // Layout: tegel-grid van foto's. 3 kolommen × 4 rijen = 12 cellen.
  // Met 360px-tegels zijn de foto's groot en duidelijk herkenbaar — de
  // collage werkt vooral als er ~6-12 verschillende foto's zijn (anders
  // worden ze veel herhaald). Foto's herhalen wanneer er minder dan 12
  // beschikbaar zijn, zodat het beeld volledig vult.
  const COLS = 3;
  const ROWS = 4;
  const TOTAL_CELLS = COLS * ROWS;
  const cells: string[] = [];
  if (photoUrls.length > 0) {
    for (let i = 0; i < TOTAL_CELLS; i++) {
      cells.push(photoUrls[i % photoUrls.length]);
    }
  }
  const cellSize = 360;
  // Lichte deterministische rotatie per cel — voor de "mengelmoes" feel
  const rotations = [-2.2, 1.4, -1.8, 2.6, -0.8, 1.9, -2.8, 0.7, -1.3, 2.1, -2.0, 1.0];

  const monthIdx = parseInt(monthPrefix.split("-")[1], 10) - 1;
  const monthLabel = MONTH_NAMES_NL[monthIdx];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1350,
          display: "flex",
          position: "relative",
          background: "#1A1A18",
          overflow: "hidden"
        }}
      >
        {/* Collage-grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 1080,
            height: 1350,
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          {cells.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt=""
              width={cellSize}
              height={cellSize}
              style={{
                width: cellSize,
                height: cellSize,
                objectFit: "cover",
                transform: `rotate(${rotations[i % rotations.length]}deg)`
              }}
            />
          ))}
        </div>

        {/* Donker verloop voor leesbaarheid van pills */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.35) 100%)"
          }}
        />

        {/* Pills centraal: titel + call-to-action */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20
          }}
        >
          <div
            style={{
              background: "#ffffff",
              color: "#1A1A18",
              fontSize: 56,
              fontWeight: 600,
              letterSpacing: -1,
              padding: "22px 48px",
              borderRadius: 9999,
              display: "flex",
              boxShadow: "0 12px 36px rgba(0,0,0,0.25)"
            }}
          >
            Theater tips {city} {monthLabel}
          </div>
          <div
            style={{
              background: "#1A1A18",
              color: "#ffffff",
              fontSize: 40,
              fontWeight: 500,
              padding: "16px 36px",
              borderRadius: 9999,
              display: "flex",
              boxShadow: "0 10px 28px rgba(0,0,0,0.3)"
            }}
          >
            swipe →
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      emoji: "twemoji",
      headers: {
        "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
      }
    }
  );
}
