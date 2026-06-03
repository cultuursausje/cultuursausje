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

/** Berekent de datum-pill: "Hele Juni", "9–14 Mei" of "9 Mei". */
function buildDatePill(speeldataAll: string[]): string {
  if (speeldataAll.length === 0) return "";
  const sorted = [...speeldataAll].sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const [, fm, fd] = first.split("-").map(Number);
  const [, lm, ld] = last.split("-").map(Number);
  const fMonth = MONTH_SHORT_NL[fm - 1];
  const fMonthCap = fMonth.charAt(0).toUpperCase() + fMonth.slice(1);
  if (fd === ld && fm === lm) return `${fd} ${fMonthCap}`;
  if (fm !== lm) {
    const lMonth = MONTH_SHORT_NL[lm - 1];
    const lMonthCap = lMonth.charAt(0).toUpperCase() + lMonth.slice(1);
    return `${fd} ${fMonthCap} – ${ld} ${lMonthCap}`;
  }
  return `${fd}–${ld} ${fMonthCap}`;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = await getSiteData();
  const show = data.shows.find((s) => s.id === params.id);
  if (!show) {
    return new Response("Show not found", { status: 404 });
  }

  const theater = data.theaters.find((t) => t.id === show.theater_id);
  const photoUrl = show.foto_url || "";
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
          background: "#1B2A4E"
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

        {/* Donker verloop voor leesbaarheid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 70%)"
          }}
        />

        {/* Datum-pill linksboven */}
        {datePill && (
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              background: "rgba(255,255,255,0.92)",
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

        {/* Foto-credit rechtsonder (subtiel) */}
        {show.foto_credit && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 32,
              color: "rgba(255,255,255,0.6)",
              fontSize: 18,
              display: "flex"
            }}
          >
            © {show.foto_credit}
          </div>
        )}

        {/* Tekstblok onderaan: titel + gezelschap + theater */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 50,
            right: 50,
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5
            }}
          >
            {show.titel}
          </div>
          {show.gezelschap && (
            <div
              style={{
                marginTop: 14,
                fontSize: 32,
                fontWeight: 400,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.2
              }}
            >
              {show.gezelschap}
            </div>
          )}
          {theater && (
            <div
              style={{
                marginTop: 2,
                fontSize: 28,
                fontWeight: 400,
                color: "rgba(255,255,255,0.78)",
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
      height: 1350
    }
  );
}
