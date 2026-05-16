import { getSiteData } from "@/lib/data";
import { ShowsExplorer } from "@/components/ShowsExplorer";
import { SectionNav } from "@/components/SectionNav";
import { festivals } from "@/data/festivals";
import type { ShowDisplay, VenueDisplay } from "@/types";
import { isOver } from "@/lib/dates";

export const revalidate = 600;

export default async function HomePage() {
  const data = await getSiteData();

  const theaterById = new Map(data.theaters.map(t => [t.id, t]));
  const gezelschapById = new Map(data.gezelschappen.map(g => [g.id, g]));

  const persByShow = new Map<string, typeof data.pers>();
  data.pers.forEach(p => {
    const arr = persByShow.get(p.show_id) ?? [];
    arr.push(p);
    persByShow.set(p.show_id, arr);
  });

  const mediaByShow = new Map<string, typeof data.media>();
  data.media.forEach(m => {
    const arr = mediaByShow.get(m.show_id) ?? [];
    arr.push(m);
    mediaByShow.set(m.show_id, arr);
  });

  // v1-filter: alleen tonen als én theater_id én gezelschap_id matchen
  // OF als een van de extra_theaters in de lijst staat.
  const inScope = data.shows.filter(s => {
    if (isOver(s.speelperiode_end)) return false;
    const theaterMatch =
      (s.theater_id && theaterById.has(s.theater_id)) ||
      s.extra_theaters.some(t => theaterById.has(t));
    const gezelschapMatch =
      s.gezelschap_id && gezelschapById.has(s.gezelschap_id);
    return theaterMatch && gezelschapMatch;
  });

  const enriched: ShowDisplay[] = inScope.map(s => {
    const theaterObj = s.theater_id ? theaterById.get(s.theater_id) : undefined;
    const gezObj = s.gezelschap_id ? gezelschapById.get(s.gezelschap_id) : undefined;

    // Bouw de volledige venue-lijst: primair + tour-stops + legacy extra_theaters
    const venues: VenueDisplay[] = [];
    const seenIds = new Set<string>();
    if (theaterObj) {
      venues.push({
        theater_id: theaterObj.id,
        theater_naam: theaterObj.naam,
        theater_afkorting: theaterObj.afkorting,
        theater_stad: theaterObj.stad,
        theater_url: theaterObj.url,
        theater_foto_url: theaterObj.foto_url,
        theater_foto_credit: theaterObj.foto_credit,
        speeldata: s.speeldata ?? [],
        is_primary: true
      });
      seenIds.add(theaterObj.id);
    }
    s.tour?.forEach(stop => {
      if (seenIds.has(stop.theater_id)) return;
      const t = theaterById.get(stop.theater_id);
      if (!t) return;
      venues.push({
        theater_id: t.id,
        theater_naam: t.naam,
        theater_afkorting: t.afkorting,
        theater_stad: t.stad,
        theater_url: t.url,
        theater_foto_url: t.foto_url,
        theater_foto_credit: t.foto_credit,
        speeldata: stop.speeldata ?? [],
        is_primary: false
      });
      seenIds.add(t.id);
    });
    s.extra_theaters.forEach(id => {
      if (seenIds.has(id)) return;
      const t = theaterById.get(id);
      if (!t) return;
      venues.push({
        theater_id: t.id,
        theater_naam: t.naam,
        theater_afkorting: t.afkorting,
        theater_stad: t.stad,
        theater_url: t.url,
        theater_foto_url: t.foto_url,
        theater_foto_credit: t.foto_credit,
        speeldata: [],
        is_primary: false
      });
      seenIds.add(t.id);
    });

    return {
      ...s,
      pers_quotes: persByShow.get(s.id) ?? [],
      media_links: mediaByShow.get(s.id) ?? [],
      theater_display: theaterObj?.afkorting || s.theater,
      theater_naam: theaterObj?.naam || s.theater,
      theater_beschrijving: theaterObj?.beschrijving || "",
      theater_url: theaterObj?.url || "",
      theater_stad: theaterObj?.stad || "",
      theater_foto_url: theaterObj?.foto_url,
      theater_foto_credit: theaterObj?.foto_credit,
      gezelschap_display: gezObj?.naam || s.gezelschap,
      gezelschap_beschrijving: gezObj?.beschrijving || "",
      gezelschap_url: gezObj?.url || "",
      venues
    };
  });

  // Voor de filter-sidebar: alleen theaters/gezelschappen die ook
  // daadwerkelijk voorkomen in de zichtbare shows.
  const usedTheaterIds = new Set<string>();
  const usedGezelschapIds = new Set<string>();
  enriched.forEach(s => {
    s.venues.forEach(v => usedTheaterIds.add(v.theater_id));
    if (s.gezelschap_id) usedGezelschapIds.add(s.gezelschap_id);
  });
  const theatersInUse = data.theaters.filter(t => usedTheaterIds.has(t.id));
  const gezelschappenInUse = data.gezelschappen.filter(g => usedGezelschapIds.has(g.id));

  return (
    <main className="relative z-10 mx-auto max-w-[1280px] px-6 pb-24 pt-10 sm:px-8 lg:px-12">
      <SectionNav />
      <header className="mb-10 sm:mb-14">
        <h1 className="text-5xl font-medium tracking-tight text-ink sm:text-6xl">
          Cultuursausje
        </h1>
        <p className="mt-2 whitespace-nowrap text-xs text-ink-muted sm:text-sm md:text-base">
          Theateragenda van Nederland, voorstellingen, festivals, gezelschappen en theaters op één plek.
        </p>
      </header>
      <ShowsExplorer
        shows={enriched}
        theaters={theatersInUse}
        gezelschappen={gezelschappenInUse}
        allTheaters={data.theaters}
        allGezelschappen={data.gezelschappen}
        festivals={festivals}
      />
      <footer className="mt-24 border-t border-line pt-6 text-xs text-ink-faint">
        Cultuursausje · agenda · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
