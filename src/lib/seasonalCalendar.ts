import { addDays, computeAdventStart, computeAshWednesday, computeEasterSunday, computePalmSunday, formatDateISO, getCurrentSeason, type SeasonId } from "./churchCalendar";

export interface CalendarEvent { date: string; title: string; detail: string; season: SeasonId; reference?: string; type: "season" | "feast" | "observance" }
const event = (date: Date, title: string, detail: string, season: SeasonId, type: CalendarEvent["type"], reference?: string): CalendarEvent => ({ date: formatDateISO(date), title, detail, season, type, reference });
/** Gregorian Western Christian calendar: shared major observances only, not a denomination-specific official lectionary. */
export function eventsForYear(year: number): CalendarEvent[] {
  const easter = computeEasterSunday(year);
  const ash = computeAshWednesday(year);
  const palm = computePalmSunday(year);
  const advent = computeAdventStart(year);
  const list: CalendarEvent[] = [
    event(new Date(year, 0, 6), "Epiphany", "The manifestation of Christ; date of observance varies by tradition.", "christmas", "feast", "Matthew 2:1-12"),
    event(ash, "Ash Wednesday", "The beginning of Lent in many Western churches.", "lent", "observance", "Matthew 6:1-18"),
    event(palm, "Palm Sunday", "Jesus enters Jerusalem.", "holy-week", "observance", "Matthew 21:1-11"),
    event(addDays(easter, -3), "Maundy Thursday", "Remembering the Last Supper.", "holy-week", "observance", "John 13:1-17"),
    event(addDays(easter, -2), "Good Friday", "Remembering the crucifixion.", "holy-week", "observance", "John 19"),
    event(addDays(easter, -1), "Holy Saturday", "A day of waiting and remembrance.", "holy-week", "observance"),
    event(easter, "Easter Sunday", "Celebrating the resurrection of Jesus.", "easter", "feast", "John 20:1-18"),
    event(addDays(easter, 39), "Ascension", "The ascension of Christ; some churches transfer the observance to Sunday.", "easter", "feast", "Acts 1:1-11"),
    event(addDays(easter, 49), "Pentecost", "The coming of the Holy Spirit.", "easter", "feast", "Acts 2:1-13"),
    event(advent, "First Sunday of Advent", "The beginning of the Western Advent season.", "advent", "season"),
    event(new Date(year, 11, 25), "Christmas Day", "Celebrating the birth of Jesus.", "christmas", "feast", "Luke 2:1-20"),
  ];
  for (let i = 1; i < 4; i++) list.push(event(addDays(advent, i * 7), `Advent Sunday ${i + 1}`, "A Sunday of Advent preparation.", "advent", "observance"));
  return list.sort((a, b) => a.date.localeCompare(b.date));
}
export function calendarForMonth(year: number, month: number): { date: Date; season: SeasonId; events: CalendarEvent[] }[] {
  const events = [...eventsForYear(year - 1), ...eventsForYear(year), ...eventsForYear(year + 1)];
  return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const key = formatDateISO(date);
    return { date, season: getCurrentSeason(date)?.id ?? "ordinary", events: events.filter(e => e.date === key) };
  });
}
