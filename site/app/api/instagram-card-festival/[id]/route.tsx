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

  // Datum-pill: gewoon de periode lowercase (bv. "juni", "mei – juni").
  const datePill = festival.periode.toLowerCase();

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

        {/* Pill-rij linksboven: datum + (optioneel) English friendly vlag */}
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
          {festival.english_friendly && (
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
        {festival.foto_credit && (
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
            © {festival.foto_credit}
          </div>
        )}

        {/* Info-pill onderaan: festivalnaam + tagline */}
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
            {festival.naam}
          </div>
          {festival.tagline && (
            <div
              style={{
                marginTop: 16,
                fontSize: 30,
                fontWeight: 500,
                color: "#3a3a36",
                lineHeight: 1.2
              }}
            >
              {festival.tagline}
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
