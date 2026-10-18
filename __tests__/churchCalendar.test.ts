import {
  computeAshWednesday,
  computeAdventStart,
  computeEasterSunday,
  formatDateISO,
} from "../src/lib/churchCalendar";

describe("church calendar 2027", () => {
  it("Easter Sunday is Mar 28, 2027", () => {
    const easter = computeEasterSunday(2027);
    expect(formatDateISO(easter)).toBe("2027-03-28");
  });

  it("Ash Wednesday is Feb 10, 2027", () => {
    const ash = computeAshWednesday(2027);
    expect(formatDateISO(ash)).toBe("2027-02-10");
  });

  it("Advent 2026 starts Nov 29, 2026 (first Sunday Nov 27–Dec 3 window)", () => {
    const advent = computeAdventStart(2026);
    expect(formatDateISO(advent)).toBe("2026-11-29");
  });
});
