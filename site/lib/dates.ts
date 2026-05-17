const MONTH_NAMES = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];
const MONTH_NAMES_SHORT = [
  "jan", "feb", "mrt", "apr", "mei", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec"
];

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthLabel(year: number, monthIdx: number): string {
  return `${MONTH_NAMES[monthIdx]} ${year}`;
}

export function monthKey(year: number, monthIdx: number): string {
  return `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
}

/**
 * Voor een show met speelperiode, retourneer de overlap met de gegeven maand
 * als string voor de pill, bv. "7–23 mei" of "hele juni".
 * null als de show niet in die maand speelt.
 */
export function pillForMonth(
  startISO: string, endISO: string, year: number, monthIdx: number
): string | null {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  const monthStart = new Date(year, monthIdx, 1);
  const monthEnd = new Date(year, monthIdx + 1, 0); // laatste dag

  if (end < monthStart || start > monthEnd) return null;

  const periodStart = start < monthStart ? monthStart : start;
  const periodEnd = end > monthEnd ? monthEnd : end;

  const monthName = MONTH_NAMES_SHORT[monthIdx];
  const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const monthFullCap = MONTH_NAMES[monthIdx].charAt(0).toUpperCase() + MONTH_NAMES[monthIdx].slice(1);

  // hele maand
  if (
    periodStart.getDate() === 1 &&
    periodEnd.getDate() === monthEnd.getDate()
  ) {
    return `Hele ${monthFullCap}`;
  }

  if (periodStart.getDate() === periodEnd.getDate()) {
    return `${periodStart.getDate()} ${monthCap}`;
  }
  return `${periodStart.getDate()}–${periodEnd.getDate()} ${monthCap}`;
}

/**
 * Genereert een lijst van maanden (year, monthIdx) van vandaag tot de
 * verste maand waarin er nog een show speelt.
 */
export function monthsToShow(
  shows: { speelperiode_start: string; speelperiode_end: string }[]
): { year: number; monthIdx: number }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), 1);
  const futureMost = shows.reduce<Date | null>((acc, s) => {
    const end = parseISO(s.speelperiode_end);
    if (!acc || end > acc) return end;
    return acc;
  }, null);
  if (!futureMost) return [];

  const months: { year: number; monthIdx: number }[] = [];
  const cur = new Date(today);
  while (cur <= futureMost) {
    months.push({ year: cur.getFullYear(), monthIdx: cur.getMonth() });
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

export function isOver(endISO: string): boolean {
  return parseISO(endISO) < startOfToday();
}

const DAY_NAMES = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const DAY_NAMES_SHORT = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const DAY_ALIASES: Record<string, number> = {
  "zondag": 0, "zondagen": 0,
  "maandag": 1, "maandagen": 1,
  "dinsdag": 2, "dinsdagen": 2,
  "woensdag": 3, "woensdagen": 3,
  "donderdag": 4, "donderdagen": 4,
  "vrijdag": 5, "vrijdagen": 5,
  "zaterdag": 6, "zaterdagen": 6
};

/**
 * Bepaal welke weekdagen English-friendly zijn op basis van de detail-tekst.
 * Bv. "Engelse boventiteling op donderdagen en zaterdagen" → {4, 6}.
 * Als de tekst geen specifieke dagen noemt maar english_friendly wel true is,
 * dan alle dagen (0-6).
 */
export function englishDays(englishFriendly: boolean, detail: string): Set<number> {
  if (!englishFriendly) return new Set();
  const found = new Set<number>();
  const lower = (detail || "").toLowerCase();
  Object.keys(DAY_ALIASES).forEach(name => {
    if (lower.includes(name)) found.add(DAY_ALIASES[name]);
  });
  if (found.size === 0) {
    // english_friendly maar geen specifieke dag → alles
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }
  return found;
}

/**
 * Alle datums tussen start en eind (inclusief) als Date-objecten.
 * Optioneel filter op weekdagen (0=zo, 6=za).
 */
export function datesInPeriod(startISO: string, endISO: string, filterDays?: Set<number>): Date[] {
  const out: Date[] = [];
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  const cur = new Date(start);
  while (cur <= end) {
    if (!filterDays || filterDays.has(cur.getDay())) {
      out.push(new Date(cur));
    }
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function formatDateNL(d: Date): string {
  return `${DAY_NAMES_SHORT[d.getDay()]} ${d.getDate()} ${MONTH_NAMES_SHORT_LOWER[d.getMonth()]}`;
}

export function fullDayName(d: Date): string {
  return DAY_NAMES[d.getDay()];
}

const MONTH_NAMES_SHORT_LOWER = MONTH_NAMES_SHORT.map(s => s.toLowerCase());

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
