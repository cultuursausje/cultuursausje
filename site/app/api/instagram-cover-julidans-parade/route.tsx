import { ImageResponse } from "next/og";

/**
 * Genereert een 1080×1350 Instagram-portrait door twee lokaal opgeslagen
 * foto's precies 50/50 samen te voegen: links de Julidans-vlaggen op ITA,
 * rechts de De Parade carrousel-tent. Beide worden `object-fit: cover`-
 * bijgesneden zodat de meest herkenbare beeldelementen behouden blijven.
 *
 * Foto's staan in `public/covers/`:
 *   - julidans-vlaggen.jpg
 *   - de-parade-tent.jpg
 *
 * Voorbeeld-URL: /api/instagram-cover-julidans-parade
 */
export const runtime = "edge";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const leftUrl = `${origin}/covers/julidans-vlaggen.jpg`;
  const rightUrl = `${origin}/covers/de-parade-tent.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1350,
          display: "flex",
          background: "#000000"
        }}
      >
        {/* Linker helft — Julidans-vlaggen op ITA */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={leftUrl}
          alt=""
          width={540}
          height={1350}
          style={{
            width: 540,
            height: 1350,
            objectFit: "cover",
            display: "block"
          }}
        />
        {/* Rechter helft — De Parade carrousel-tent */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rightUrl}
          alt=""
          width={540}
          height={1350}
          style={{
            width: 540,
            height: 1350,
            objectFit: "cover",
            display: "block"
          }}
        />
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      headers: {
        // Korte cache — anders zien we aanpassingen aan de bronfoto's
        // pas veel later terug in de gegenereerde PNG.
        "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
      }
    }
  );
}
