import type { PersQuote } from "@/types";

/**
 * Recensie-citaten. LET OP — Cultuursausje toont alleen recensies die:
 *
 *  1. Een LETTERLIJK citaat zijn uit de gepubliceerde bron (geen parafrase,
 *     niet samengeplakt uit meerdere zinnen).
 *  2. Een werkelijke publicatiedatum bevatten (de dag waarop de recensie
 *     op het medium is verschenen). Niet de datum waarop de voorstelling
 *     speelt. Verzin geen datums, laat het veld leeg als je 'm niet weet.
 *  3. Bij voorkeur een URL naar het oorspronkelijke artikel.
 *
 * Format per entry:
 *   {
 *     show_id: "matcht een show.id uit shows.ts",
 *     bron: "Theaterkrant" (of "NRC", "de Volkskrant", etc.),
 *     sterren: 5,                          // 1-5, of null als geen sterren
 *     quote: "Letterlijk citaat hier.",
 *     quote_en: "Optionele Engelse vertaling.",
 *     date: "2024-02-05",                  // YYYY-MM-DD, publicatiedatum
 *     url: "https://..."                   // link naar het artikel
 *   }
 *
 * De Niet-te-missen-voorstellingen-sectie toont alleen shows met 3+
 * verschillende bronnen. Zolang er minder dan 3 bronnen per voorstelling
 * zijn, blijft die show eruit. De sectie verdwijnt volledig als de hele
 * lijst leeg is.
 */
export const pers: PersQuote[] = [];
