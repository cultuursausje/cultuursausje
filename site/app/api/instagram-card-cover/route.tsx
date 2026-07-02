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
  // Cover-variant: a=collage (standaard), b=2×2 photo-grid, c=hero-photo,
  // d=typografisch, e=festival-first (2 festivals boven + shows onder),
  // f=festival-branded halves (2 festivals als kleurhelften).
  const variant = (url.searchParams.get("variant") ?? "a").toLowerCase();

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
  const titleText = `Theater tips ${city} ${monthLabel}`;

  // Actieve festivals in de geselecteerde stad+maand — gebruikt voor
  // de festival-uitlicht-varianten (E & F). Neemt max 2 festivals mee
  // (bv. Julidans + De Parade in Amsterdam-juli), gefilterd op datum-
  // overlap wanneer ISO-datums bekend zijn.
  const monthNumForFest = parseInt(monthPrefix.split("-")[1], 10);
  const cityLowerForFest = city.toLowerCase();
  const [yFest, mFest] = monthPrefix.split("-").map(Number);
  const fMonthStart = new Date(yFest, mFest - 1, 1).getTime();
  const fMonthEnd = new Date(yFest, mFest, 0, 23, 59, 59).getTime();
  const activeFestivals = festivals
    .filter((f) => {
      if (!f.plaats.toLowerCase().includes(cityLowerForFest)) return false;
      if (f.periode_start && f.periode_end) {
        const s = new Date(f.periode_start + "T00:00:00").getTime();
        const e = new Date(f.periode_end + "T23:59:59").getTime();
        return s <= fMonthEnd && e >= fMonthStart;
      }
      const { start, end } = parsePeriode(f.periode);
      return monthNumForFest >= start && monthNumForFest <= end;
    })
    .slice(0, 2);

  // Standaard pills die alle varianten gebruiken (titel + swipe-CTA).
  const titlePill = (fontSize = 56) => (
    <div
      style={{
        background: "#ffffff",
        color: "#1A1A18",
        fontSize,
        fontWeight: 600,
        letterSpacing: -1,
        padding: "22px 48px",
        borderRadius: 9999,
        display: "flex",
        boxShadow: "0 12px 36px rgba(0,0,0,0.25)"
      }}
    >
      {titleText}
    </div>
  );
  const swipePill = (
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
  );

  // ── Variant B: 2×2 grote foto-grid (540×540) met titel over de spliting.
  if (variant === "b") {
    const grid = photoUrls.slice(0, 4);
    while (grid.length < 4 && photoUrls.length > 0) grid.push(photoUrls[grid.length % photoUrls.length]);
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1350, display: "flex", position: "relative", background: "#1A1A18" }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: 1080, height: 1350 }}>
            {grid.map((u, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={u} alt="" width={540} height={675}
                style={{ width: 540, height: 675, objectFit: "cover" }} />
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 40px 80px", gap: 20 }}>
            {titlePill(56)}
            {swipePill}
          </div>
        </div>
      ),
      { width: 1080, height: 1350, emoji: "twemoji", headers: { "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" } }
    );
  }

  // ── Variant C: één grote hero-foto (eerste beschikbare) + tekst onderaan.
  if (variant === "c") {
    const hero = photoUrls[0];
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1350, display: "flex", position: "relative", background: "#1A1A18" }}>
          {hero && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="" width={1080} height={1350}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }} />
          <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            {titlePill(52)}
            {swipePill}
          </div>
        </div>
      ),
      { width: 1080, height: 1350, emoji: "twemoji", headers: { "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" } }
    );
  }

  // ── Variant D: typografisch, geen foto's. Grote serif tekst op geel
  //    ("Cultuursausje"-signatuurkleur). Ideaal wanneer je een clean,
  //    tekst-eerste cover wil delen.
  if (variant === "d") {
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1350, display: "flex", position: "relative", background: "#FFE600", padding: 80, flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 500, color: "#1A1A18", opacity: 0.7, letterSpacing: 4, textTransform: "uppercase" }}>
            Cultuursausje
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 500, color: "#1A1A18", opacity: 0.8, lineHeight: 1 }}>
              Theater tips
            </div>
            <div style={{ display: "flex", fontSize: 180, fontWeight: 700, color: "#1A1A18", letterSpacing: -6, lineHeight: 0.95, marginTop: -10 }}>
              {monthLabel}
            </div>
            <div style={{ display: "flex", fontSize: 60, fontWeight: 500, color: "#1A1A18", opacity: 0.85, letterSpacing: -1, lineHeight: 1 }}>
              in {city}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "#1A1A18", color: "#FFE600", fontSize: 40, fontWeight: 500, padding: "16px 36px", borderRadius: 9999, display: "flex" }}>
              swipe →
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1350, emoji: "twemoji", headers: { "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" } }
    );
  }

  // ── Variant E: festival-first grid. Twee grote festival-foto's boven
  //    (elk 540×675), 3 kleine show-foto's onder (elk 360×675). Titel-pill
  //    overlay op de horizontale splitsing tussen boven en onder. Trekt
  //    de aandacht van de scroller onmiddellijk naar de festivals.
  if (variant === "e") {
    const fest1 = activeFestivals[0];
    const fest2 = activeFestivals[1];
    const fest1Photo = fest1?.foto_urls?.[0];
    const fest2Photo = fest2?.foto_urls?.[0];
    // Andere foto's onder: verwijder de festival-foto's uit de show-pool
    const otherPhotos = photoUrls
      .filter((u) => u !== fest1Photo && u !== fest2Photo)
      .slice(0, 3);
    while (otherPhotos.length < 3 && photoUrls.length > 0) {
      otherPhotos.push(photoUrls[otherPhotos.length % photoUrls.length]);
    }
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1350, display: "flex", position: "relative", background: "#1A1A18", flexDirection: "column" }}>
          {/* Boven: twee festival-hero-foto's naast elkaar met naam-pill */}
          <div style={{ display: "flex", width: 1080, height: 675 }}>
            {[fest1, fest2].map((f, idx) => {
              const p = f?.foto_urls?.[0];
              const tc = f?.accent_text ?? "#ffffff";
              return (
                <div key={idx} style={{ position: "relative", width: 540, height: 675, display: "flex", background: f?.accent ?? "#1A1A18" }}>
                  {p && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p} alt="" width={540} height={675} style={{ width: 540, height: 675, objectFit: "cover" }} />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
                  {f && (
                    <div style={{ position: "absolute", bottom: 24, left: idx === 0 ? 24 : "auto", right: idx === 1 ? 24 : "auto", background: f.accent, color: tc, fontSize: 30, fontWeight: 600, padding: "10px 22px", borderRadius: 9999, display: "flex" }}>
                      {f.naam}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Onder: drie show-foto's naast elkaar */}
          <div style={{ display: "flex", width: 1080, height: 675 }}>
            {otherPhotos.map((u, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={u} alt="" width={360} height={675} style={{ width: 360, height: 675, objectFit: "cover" }} />
            ))}
          </div>
          {/* Titel-pill in het midden op de splitsing + swipe eronder */}
          <div style={{ position: "absolute", top: 630, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            {titlePill(48)}
            {swipePill}
          </div>
        </div>
      ),
      { width: 1080, height: 1350, emoji: "twemoji", headers: { "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" } }
    );
  }

  // ── Variant F: festival-branded halves. Twee horizontale helften met
  //    elk festival's accent-kleur + foto + festival-naam. Titel-pill
  //    centraal over de splitsing. Zeer visueel — de festival-branding
  //    is direct herkenbaar.
  if (variant === "f") {
    const fest1 = activeFestivals[0];
    const fest2 = activeFestivals[1];
    const halfHeight = 675;
    const halves = [fest1, fest2];
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1350, display: "flex", position: "relative", flexDirection: "column", background: "#1A1A18" }}>
          {halves.map((f, idx) => {
            const p = f?.foto_urls?.[0];
            const bg = f?.accent ?? "#1A1A18";
            const tc = f?.accent_text ?? "#ffffff";
            return (
              <div key={idx} style={{ position: "relative", width: 1080, height: halfHeight, display: "flex", background: bg, overflow: "hidden" }}>
                {p && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p} alt="" width={1080} height={halfHeight}
                    style={{ position: "absolute", inset: 0, width: 1080, height: halfHeight, objectFit: "cover", opacity: 0.75 }} />
                )}
                {/* Accent color overlay zodat de branding zichtbaar blijft */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${idx === 0 ? "180deg" : "0deg"}, ${bg}CC 0%, ${bg}66 60%, ${bg}22 100%)` }} />
                {f && (
                  <div style={{ position: "absolute", top: idx === 0 ? 40 : "auto", bottom: idx === 1 ? 40 : "auto", left: 40, fontSize: 80, fontWeight: 700, color: tc, letterSpacing: -2, lineHeight: 1, display: "flex" }}>
                    {f.naam}
                  </div>
                )}
              </div>
            );
          })}
          {/* Titel-pill + swipe centraal over de splitsing */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            {titlePill(52)}
            {swipePill}
          </div>
        </div>
      ),
      { width: 1080, height: 1350, emoji: "twemoji", headers: { "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" } }
    );
  }

  // ── Variant A (standaard): 3×4 collage-grid met roterende foto's.
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
          {titlePill(56)}
          {swipePill}
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
