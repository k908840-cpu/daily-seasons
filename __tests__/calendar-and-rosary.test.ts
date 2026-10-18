import { addDays, computeAdventStart, computeAshWednesday, computeEasterSunday, computePalmSunday, formatDateISO, getCurrentSeason } from "../src/lib/churchCalendar";
import { buildRosary, suggestedMystery } from "../src/lib/rosaryGuide";

describe("Western Christian calendar", () => {
  test("2026 Easter and dependent dates", () => {
    const easter = computeEasterSunday(2026);
    expect(formatDateISO(easter)).toBe("2026-04-05");
    expect(formatDateISO(computeAshWednesday(2026))).toBe("2026-02-18");
    expect(formatDateISO(computePalmSunday(2026))).toBe("2026-03-29");
    expect(formatDateISO(addDays(easter, 49))).toBe("2026-05-24");
  });
  test("2026 Advent begins November 29", () => {
    expect(formatDateISO(computeAdventStart(2026))).toBe("2026-11-29");
    expect(getCurrentSeason(new Date(2026, 11, 1))?.id).toBe("advent");
  });
  test("Christmas season crosses the year boundary", () => {
    expect(getCurrentSeason(new Date(2027, 0, 2))?.id).toBe("christmas");
    expect(getCurrentSeason(new Date(2027, 0, 10))?.id).toBe("ordinary");
  });
});

describe("guided Rosary", () => {
  test("each mystery set has five decades and fifty decade Hail Mary steps", () => {
    for (const kind of ["Joyful", "Sorrowful", "Glorious", "Luminous"] as const) {
      const steps = buildRosary(kind);
      expect(steps.filter(s => s.title.startsWith("Mystery "))).toHaveLength(5);
      expect(steps.filter(s => s.title.startsWith("Hail Mary ") && s.title.includes("of 10"))).toHaveLength(50);
      expect(steps[steps.length - 1].title).toBe("Closing prayers");
    }
  });
  test("weekday recommendations include Saturday Joyful", () => {
    expect(suggestedMystery(0)).toBe("Glorious");
    expect(suggestedMystery(4)).toBe("Luminous");
    expect(suggestedMystery(6)).toBe("Joyful");
  });
});
