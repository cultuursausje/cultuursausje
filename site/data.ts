import { shows as localShows } from "@/data/shows";
import { theaters as localTheaters } from "@/data/theaters";
import { gezelschappen as localGezelschappen } from "@/data/gezelschappen";
import { pers as localPers } from "@/data/pers";
import { media as localMedia } from "@/data/media";
import { parseCSV } from "@/lib/csv";
import type {
  SiteData, Show, Theater, Gezelschap, PersQuote, MediaLink
} from "@/types";

/**
 * Haalt de site-data op.
 *
 * Als de env vars GSHEETS_*_CSV gevuld zijn met "Publiceren naar het web"-URL's
 * uit Google Sheets, fetcht die. Anders gebruikt het de lokale TS-bestanden.
 */
export async function getSiteData(): Promise<SiteData> {
  const showsUrl = process.env.GSHEETS_SHOWS_CSV;
  const theatersUrl = process.env.GSHEETS_THEATERS_CSV;
  const gezelschappenUrl = process.env.GSHEETS_GEZELSCHAPPEN_CSV;
  const persUrl = process.env.GSHEETS_PERS_CSV;
  const mediaUrl = process.env.GSHEETS_MEDIA_CSV;

  if (showsUrl && theatersUrl && gezelschappenUrl) {
    try {
      const [showsTxt, theatersTxt, gezTxt, persTxt, mediaTxt] = await Promise.all([
        fetchText(showsUrl),
        fetchText(theatersUrl),
        fetchText(gezelschappenUrl),
        persUrl ? fetchText(persUrl) : Promise.resolve(""),
        mediaUrl ? fetchText(mediaUrl) : Promise.resolve("")
      ]);
      return {
        shows: parseCSV(showsTxt).map(rowToShow),
        theaters: parseCSV(theatersTxt).map(rowToTheater),
        gezelschappen: parseCSV(gezTxt).map(rowToGezelschap),
        pers: persTxt ? parseCSV(persTxt).map(rowToPers) : [],
        media: mediaTxt ? parseCSV(mediaTxt).map(rowToMedia) : []
      };
    } catch (err) {
      console.warn("Sheets fetch faalde, gebruik lokale data:", err);
    }
  }

  return {
    shows: localShows,
    theaters: localTheaters,
    gezelschappen: localGezelschappen,
    pers: localPers,
    media: localMedia
  };
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Fetch ${url} faalde: ${res.status}`);
  return res.text();
}

function rowToShow(r: Record<string, string>): Show {
  return {
    id: r.id,
    titel: r.titel,
    gezelschap_id: r.gezelschap_id || "",
    gezelschap: r.gezelschap || "",
    theater_id: r.theater_id || "",
    theater: r.theater || "",
    extra_theaters: (r.extra_theaters || "").split("|").filter(Boolean),
    speelperiode_start: r.speelperiode_start,
    speelperiode_end: r.speelperiode_end,
    korte_samenvatting: r.korte_samenvatting || "",
    lange_samenvatting: r.lange_samenvatting || "",
    regisseur: r.regisseur || "",
    based_on: r.based_on || "",
    foto_url: r.foto_url || "",
    english_friendly: (r.english_friendly || "").toUpperCase() === "TRUE",
    english_friendly_detail: r.english_friendly_detail || "",
    categorieen: (r.categorieen || "").split("|").filter(Boolean),
    ticket_url: r.ticket_url || ""
  };
}

function rowToTheater(r: Record<string, string>): Theater {
  return { id: r.id, naam: r.naam, afkorting: r.afkorting, url: r.url };
}

function rowToGezelschap(r: Record<string, string>): Gezelschap {
  return { id: r.id, naam: r.naam, afkorting: r.afkorting, type: r.type, stad: r.stad, url: r.url };
}

function rowToPers(r: Record<string, string>): PersQuote {
  return {
    show_id: r.show_id,
    bron: r.bron,
    sterren: r.sterren ? Number(r.sterren) : null,
    quote: r.quote
  };
}

function rowToMedia(r: Record<string, string>): MediaLink {
  return { show_id: r.show_id, type: r.type, titel: r.titel, url: r.url };
}
