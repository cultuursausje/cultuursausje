import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/data";
import { festivals } from "@/data/festivals";

/**
 * Genereert een 1080×1350 Instagram-portrait PNG van een voorstelling.
 *
 * Layout (zelfde stijl als de SmallShowCard op de site, met aanpassingen
 * voor Instagram):
 *   - Foto vult de hele kaart (object-cover)
 *   - Donker verloop onderaan voor leesbaarheid van witte tekst
 *   - Datum-pill linksboven (witte achtergrond, donkere tekst)
 *   - Onderaan: titel (groot), gezelschap (middelgroot), theater (klein)
 *   - Geen hartje (op verzoek van Emma)
 *
 * Voorbeeld-URL: /api/instagram-card/spinoza
 */
export const runtime = "edge";

const MONTH_SHORT_NL = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/** Berekent de datum-pill: "hele juni", "9–14 mei" of "9 mei".
 *  Maandnamen zijn lowercase — Nederlandse conventie. */
function buildDatePill(speeldataAll: string[]): string {
  if (speeldataAll.length === 0) return "";
  const sorted = [...speeldataAll].sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const [, fm, fd] = first.split("-").map(Number);
  const [, lm, ld] = last.split("-").map(Number);
  const fMonth = MONTH_SHORT_NL[fm - 1];
  if (fd === ld && fm === lm) return `${fd} ${fMonth}`;
  if (fm !== lm) {
    const lMonth = MONTH_SHORT_NL[lm - 1];
    return `${fd} ${fMonth} – ${ld} ${lMonth}`;
  }
  return `${fd}–${ld} ${fMonth}`;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await getSiteData();
  const show = data.shows.find((s) => s.id === params.id);
  if (!show) {
    return new Response("Show not found", { status: 404 });
  }

  const theater = data.theaters.find((t) => t.id === show.theater_id);
  // Relatieve paden (zoals "/shows/foo.jpg") moeten in een ImageResponse
  // absoluut zijn — anders kan Satori 'm niet ophalen. Plak het host-deel ervoor.
  const origin = new URL(req.url).origin;
  const rawPhotoUrl = show.foto_url
    ? show.foto_url.startsWith("/")
      ? `${origin}${show.foto_url}`
      : show.foto_url
    : "";

  // Probeer de foto vooraf op te halen. Als de externe server hem niet
  // serveert (404, CORS, time-out, hotlink-blok) zou Satori anders de hele
  // ImageResponse laten crashen. Met deze check laten we de foto vallen en
  // genereren we een PNG met alleen de gekleurde achtergrond + tekst.
  let photoUrl = "";
  if (rawPhotoUrl) {
    try {
      const probe = await fetch(rawPhotoUrl, {
        method: "GET",
        // Browser-achtige headers — sommige servers blokkeren default fetches
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Cultuursausje/1.0)",
          Accept: "image/*"
        },
        signal: AbortSignal.timeout(3000)
      });
      if (probe.ok) photoUrl = rawPhotoUrl;
    } catch {
      // foto niet bereikbaar — we genereren zonder
      photoUrl = "";
    }
  }
  // Verzamel alle speeldata uit primaire venue + tour-stops
  const allDates: string[] = [
    ...(show.speeldata ?? []),
    ...((show.tour ?? []).flatMap((stop) => stop.speeldata ?? []))
  ];
  const datePill = buildDatePill(allDates);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1350,
          display: "flex",
          position: "relative",
          background: "#1A1A18"
        }}
      >
        {/* Foto vult de hele kaart */}
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            width={1080}
            height={1350}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        )}

        {/* Pill-rij linksboven: datum + (optioneel) English friendly vlaggetje */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            display: "flex",
            gap: 12
          }}
        >
          {datePill && (
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#1A1A18",
                fontSize: 36,
                fontWeight: 500,
                padding: "12px 28px",
                borderRadius: 9999,
                display: "flex"
              }}
            >
              {datePill}
            </div>
          )}
          {show.english_friendly && (
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                fontSize: 36,
                padding: "12px 22px",
                borderRadius: 9999,
                display: "flex",
                alignItems: "center"
              }}
            >
              🇬🇧
            </div>
          )}
        </div>

        {/* Foto-credit pill rechtsboven */}
        {show.foto_credit && (
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 40,
              background: "rgba(255,255,255,0.92)",
              color: "#1A1A18",
              fontSize: 22,
              fontWeight: 500,
              padding: "8px 18px",
              borderRadius: 9999,
              display: "flex"
            }}
          >
            © {show.foto_credit}
          </div>
        )}

        {/* Info-pill onderaan: titel + gezelschap + theater. Witte
            achtergrond zorgt voor maximale leesbaarheid, ongeacht de foto
            erachter. */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 50,
            right: 50,
            background: "rgba(255,255,255,0.96)",
            borderRadius: 36,
            padding: "32px 40px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.2,
              color: "#1A1A18"
            }}
          >
            {show.titel}
          </div>
          {show.gezelschap && (
            <div
              style={{
                marginTop: 16,
                fontSize: 30,
                fontWeight: 500,
                color: "#3a3a36",
                lineHeight: 1.2
              }}
            >
              {show.gezelschap}
            </div>
          )}
          {theater && (
            <div
              style={{
                marginTop: 4,
                fontSize: 26,
                fontWeight: 400,
                color: "#6e6e68",
                lineHeight: 1.2
              }}
            >
              {theater.naam}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      // Twemoji rendert emoji (zoals het UK-vlaggetje 🇬🇧) als SVG —
      // standaard Satori geeft anders alleen platte tekst en geen vlag.
      emoji: "twemoji",
      // Korte cache (5 min) — anders cachet Vercel de PNG voor altijd
      // en zien aanpassingen aan foto_url e.d. pas véél later effect.
      headers: {
        "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
      }
    }
  );
}
