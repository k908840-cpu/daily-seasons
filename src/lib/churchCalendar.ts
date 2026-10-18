/** Western (Gregorian) church year date computation for v1. */

export type SeasonId =
  | "advent"
  | "christmas"
  | "ordinary"
  | "lent"
  | "holy-week"
  | "easter";

export interface SeasonSpan {
  id: SeasonId;
  label: string;
  start: Date;
  end: Date;
}

/** Anonymous Gregorian algorithm (Meeus / ecclesiastical). Returns UTC midnight local parts as local Date at 00:00. */
export function computeEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Sunday on or before `date` (same week if already Sunday). */
export function previousSunday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

/** Fourth Sunday before Dec 25 (Advent begins). */
export function computeAdventStart(year: number): Date {
  const christmas = new Date(year, 11, 25);
  const fourthSundayBefore = addDays(previousSunday(christmas), -21);
  return fourthSundayBefore;
}

export function computeAshWednesday(year: number): Date {
  return addDays(computeEasterSunday(year), -46);
}

export function computePalmSunday(year: number): Date {
  return addDays(computeEasterSunday(year), -7);
}

export function computeHolySaturday(year: number): Date {
  return addDays(computeEasterSunday(year), -1);
}

export function computeChristmasSeasonEnd(year: number): Date {
  return new Date(year + 1, 0, 5);
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isInRange(day: Date, start: Date, end: Date): boolean {
  const t = startOfDay(day).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}

export function getSeasonSpansForYear(year: number): SeasonSpan[] {
  const adventStart = computeAdventStart(year);
  const christmasStart = new Date(year, 11, 25);
  const christmasEnd = computeChristmasSeasonEnd(year);
  const ash = computeAshWednesday(year);
  const palm = computePalmSunday(year);
  const holySat = computeHolySaturday(year);
  const easter = computeEasterSunday(year);
  const lentStart = ash;
  const lentEnd = addDays(palm, -1);
  const easterEnd = addDays(easter, 49);

  return [
    {
      id: "advent",
      label: "Advent",
      start: adventStart,
      end: addDays(christmasStart, -1),
    },
    {
      id: "christmas",
      label: "Christmas",
      start: christmasStart,
      end: christmasEnd,
    },
    {
      id: "lent",
      label: "Lent",
      start: lentStart,
      end: lentEnd,
    },
    {
      id: "holy-week",
      label: "Holy Week",
      start: palm,
      end: holySat,
    },
    {
      id: "easter",
      label: "Easter",
      start: easter,
      end: easterEnd,
    },
  ];
}

export function getCurrentSeason(today: Date = new Date()): SeasonSpan | null {
  const y = today.getFullYear();
  const spans = [
    ...getSeasonSpansForYear(y - 1),
    ...getSeasonSpansForYear(y),
    ...getSeasonSpansForYear(y + 1),
  ];
  const t = startOfDay(today);
  for (const span of spans) {
    if (isInRange(t, span.start, span.end)) return span;
  }
  return {
    id: "ordinary",
    label: "Ordinary Time",
    start: t,
    end: t,
  };
}

export function getNextSeason(today: Date = new Date()): SeasonSpan | null {
  const y = today.getFullYear();
  const spans = [
    ...getSeasonSpansForYear(y),
    ...getSeasonSpansForYear(y + 1),
  ].sort((a, b) => a.start.getTime() - b.start.getTime());
  const t = startOfDay(today).getTime();
  for (const span of spans) {
    if (startOfDay(span.start).getTime() > t) return span;
  }
  return spans[0] ?? null;
}

/** Advent day 1–25 (Dec 1–25 calendar grid for v1 home tiles). */
export function getAdventCalendarDay(today: Date = new Date()): number | null {
  const year = today.getMonth() === 0 && today.getDate() <= 6
    ? today.getFullYear() - 1
    : today.getFullYear();
  if (today.getMonth() !== 11) {
    const span = getCurrentSeason(today);
    if (span?.id !== "advent") return null;
  }
  if (today.getMonth() === 11) {
    const d = today.getDate();
    if (d >= 1 && d <= 25) return d;
  }
  return null;
}

/** Count of Sundays in Advent up to and including `today` (0–4). */
export function adventSundaysLit(today: Date = new Date()): number {
  const year =
    today.getMonth() === 11 ? today.getFullYear() : today.getFullYear();
  const start = computeAdventStart(year);
  let count = 0;
  for (let w = 0; w < 4; w++) {
    const sunday = addDays(start, w * 7);
    if (startOfDay(sunday).getTime() <= startOfDay(today).getTime()) count++;
  }
  return Math.min(count, 4);
}

export function daysUntilChristmas(today: Date = new Date()): number {
  const year = today.getMonth() === 11 ? today.getFullYear() : today.getFullYear();
  const target = today.getMonth() === 11 && today.getDate() > 25
    ? new Date(year + 1, 11, 25)
    : new Date(year, 11, 25);
  const diff = startOfDay(target).getTime() - startOfDay(today).getTime();
  return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
}

export function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
