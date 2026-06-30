import { ImageResponse } from "next/og";
import { festivals } from "@/data/festivals";

/**
 * Genereert een 1080×1350 Instagram-portrait PNG van een theaterfestival.
 *
 * Layout (in dezelfde stijl als de voorstelling-kaarten):
 *   - Festival-foto vult de hele kaart
 *   - Datum-pill linksboven (de periode lowercase, bv. "juni" of "mei – juni")
 *   - Engels-vlaggetje pill ernaast wanneer het festival english_friendly is
 *   - Foto-credit pill rechtsboven
 *   - Onderaan een witte info-pill met: naam + tagline
 *
 * Voorbeeld-URL: /api/instagram-card-festival/holland-festival
 */
export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const festival = festivals.find((f) => f.id === params.id);
  if (!festival) {
    return new Response("Festival not found", { status: 404 });
  }

  // Foto vooraf checken om te voorkomen dat Satori crasht op
  // niet-bereikbare externe images (zelfde patroon als voorstelling-kaart).
  const rawPhotoUrl =
    festival.foto_urls && festival.foto_urls.length > 0
      ? festival.foto_urls[0]
      : "";
  let photoUrl = "";
  if (rawPhotoUrl) {
    try {
      const probe = await fetch(rawPhotoUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Cultuursausje/1.0)",
          Accept: "image/*"
        },
        signal: AbortSignal.timeout(3000)
      });
      if (probe.ok) photoUrl = rawPhotoUrl;
    } catch {
      photoUrl = "";
    }
  }

  // Datum-pill: gebruik exacte start/einddatum als beide bekend zijn,
  // anders val terug op de vrije-tekst periode (lowercase).
  const MONTH_SHORT_NL = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  let datePill = festival.periode.toLowerCase();
  if (festival.periode_start && festival.periode_end) {
    const [, sm, sd] = festival.periode_start.split("-").map(Number);
    const [, em, ed] = festival.periode_end.split("-").map(Number);
    if (sm === em) {
      datePill = `${sd}–${ed} ${MONTH_SHORT_NL[sm - 1]}`;
    } else {
      datePill = `${sd} ${MONTH_SHORT_NL[sm - 1]} – ${ed} ${MONTH_SHORT_NL[em - 1]}`;
    }
  }

  // Tekstkleur voor inhoud op de accent-kleur. Standaard wit; festivals
  // met een lichte accent-kleur kunnen `accent_text: "#000000"` zetten
  // voor leesbaarheid. De afgeleide mid/subtle varianten gebruiken
  // automatisch de juiste basiskleur met semi-transparantie.
  const textColor = festival.accent_text ?? "#ffffff";
  const isDark = textColor === "#000000" || textColor === "#000";
  const textMid = isDark ? "rgba(0,0,0,0.78)" : "rgba(255,255,255,0.92)";
  const textSubtle = isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.78)";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1350,
          display: "flex",
          position: "relative",
          background: festival.accent || "#1A1A18"
        }}
      >
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

        {/* Pill-rij linksboven: datum + (optioneel) English friendly vlag.
            Kleur: de accent-kleur van het festival (Holland Festival roze,
            Julidans groen, Oerol blauw, etc.) — geeft elke festival-kaart
            zijn eigen herkenbare branding. */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            display: "flex",
            gap: 12
          }}
        >
          <div
            style={{
              background: festival.accent,
              color: textColor,
              fontSize: 36,
              fontWeight: 500,
              padding: "12px 28px",
              borderRadius: 9999,
              display: "flex"
            }}
          >
            {datePill}
          </div>
          {festival.english_friendly && (
            <div
              style={{
                background: festival.accent,
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
        {festival.foto_credit && (
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 40,
              background: festival.accent,
              color: textColor,
              fontSize: 22,
              fontWeight: 500,
              padding: "8px 18px",
              borderRadius: 9999,
              display: "flex"
            }}
          >
            © {festival.foto_credit}
          </div>
        )}

        {/* Info-pill onderaan in festival-kleur, witte tekst */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 50,
            right: 50,
            background: festival.accent,
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
              color: textColor
            }}
          >
            {festival.naam}
          </div>
          {festival.tagline && (
            <div
              style={{
                marginTop: 16,
                fontSize: 30,
                fontWeight: 500,
                color: textMid,
                lineHeight: 1.2
              }}
            >
              {festival.tagline}
            </div>
          )}
          {festival.locaties && (
            <div
              style={{
                marginTop: 4,
                fontSize: 26,
                fontWeight: 400,
                color: textSubtle,
                lineHeight: 1.2
              }}
            >
              {festival.locaties}
            </div>
          )}
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
