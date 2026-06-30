import { ImageResponse } from "next/og";
import { festivals } from "@/data/festivals";

/**
 * Genereert een 1080×1350 Instagram-portrait PNG van een individuele
 * voorstelling binnen een theaterfestival (bv. één productie van
 * Holland Festival of Julidans).
 *
 * Layout:
 *   - Voorstelling-foto vult de kaart
 *   - Datum-pill linksboven (festival-periode, of speeldata als ingevuld)
 *   - 🇬🇧 pill ernaast wanneer de voorstelling english_friendly is
 *   - Foto-credit pill rechtsboven
 *   - Info-pill onderaan: titel → gezelschap → festivalnaam
 *
 * Voorbeeld-URL: /api/instagram-card-festival-show/holland-festival-a-trial
 */
export const runtime = "edge";

const MONTH_SHORT_NL = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

function buildDatePillFromSpeeldata(speeldata: string[] | undefined): string | null {
  if (!speeldata || speeldata.length === 0) return null;
  const sorted = [...speeldata].sort();
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
  _req: Request,
  { params }: { params: { id: string } }
) {
  // Zoek de voorstelling en haar bijbehorende festival
  let voorstelling: NonNullable<typeof festivals[number]["voorstellingen"]>[number] | null = null;
  let festival: typeof festivals[number] | null = null;
  for (const f of festivals) {
    const match = f.voorstellingen?.find((v) => v.id === params.id);
    if (match) {
      voorstelling = match;
      festival = f;
      break;
    }
  }
  if (!voorstelling || !festival) {
    return new Response("Festival show not found", { status: 404 });
  }

  // Foto vooraf checken om Satori-crashes te voorkomen
  const rawPhotoUrl = voorstelling.foto_url || "";
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

  // Datum-pill: gebruik specifieke speeldata als die er zijn,
  // anders de festival-periode (lowercase).
  const datePill =
    buildDatePillFromSpeeldata(voorstelling.speeldata) ??
    festival.periode.toLowerCase();

  // Tekstkleur voor inhoud op de accent-kleur — afgeleid van het festival,
  // zodat een voorstelling binnen Julidans automatisch zwarte tekst krijgt
  // op de lichte sage-groene branding.
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
            Kleur: de accent-kleur van het bijbehorende festival, zodat
            duidelijk is binnen welk festival deze voorstelling valt. */}
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
          {voorstelling.english_friendly && (
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
        {voorstelling.foto_credit && (
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
            © {voorstelling.foto_credit}
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
              fontSize: 60,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.2,
              color: textColor
            }}
          >
            {voorstelling.titel}
          </div>
          {voorstelling.gezelschap && (
            <div
              style={{
                marginTop: 16,
                fontSize: 30,
                fontWeight: 500,
                color: textMid,
                lineHeight: 1.2
              }}
            >
              {voorstelling.gezelschap}
            </div>
          )}
          <div
            style={{
              marginTop: 4,
              fontSize: 26,
              fontWeight: 400,
              color: textSubtle,
              lineHeight: 1.2
            }}
          >
            {voorstelling.locatie
              ? `${voorstelling.locatie} (${festival.naam})`
              : festival.naam}
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
