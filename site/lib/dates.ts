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

  // hele maand
  if (
    periodStart.getDate() === 1 &&
    periodEnd.getDate() === monthEnd.getDate()
  ) {
    return `hele ${MONTH_NAMES[monthIdx]}`;
  }

  if (periodStart.getDate() === periodEnd.getDate()) {
    return `${periodStart.getDate()} ${monthName}`;
  }
  return `${periodStart.getDate()}–${periodEnd.getDate()} ${monthName}`;
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

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
