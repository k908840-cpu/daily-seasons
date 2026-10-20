import { DAILY_PRAYERS, LIBRARY_PRAYERS } from "../src/data/prayers";
import { TRADITIONS, WEB_EDITION } from "../src/data/traditions";

describe("content attribution", () => {
  test("all published daily prayers contain real text and original attribution", () => {
    expect(DAILY_PRAYERS).toHaveLength(4);
    for (const prayer of DAILY_PRAYERS) {
      expect(prayer.sourceId).toBe("daily-seasons-original");
      expect(prayer.text.length).toBeGreaterThan(100);
      expect(prayer.text).not.toContain("PENDING");
    }
  });
  test("published library prayers have complete text and source attribution", () => {
    expect(LIBRARY_PRAYERS.length).toBeGreaterThanOrEqual(8);
    expect(new Set(LIBRARY_PRAYERS.map(prayer => prayer.id)).size).toBe(LIBRARY_PRAYERS.length);
    for (const prayer of LIBRARY_PRAYERS) {
      expect(prayer.sourceId.length).toBeGreaterThan(0);
      expect(prayer.text.trim().length).toBeGreaterThan(20);
      expect(prayer.text).not.toContain("PENDING");
      if (prayer.sourceId === "daily-seasons-original") {
        expect(prayer.text.length).toBeGreaterThan(100);
      }
    }
    expect(LIBRARY_PRAYERS.some(prayer => prayer.sourceId !== "daily-seasons-original")).toBe(true);
  });
  test("all four traditions plus shared Christian are represented", () => {
    expect(TRADITIONS.map(t => t.label)).toEqual(expect.arrayContaining(["Shared Christian", "Catholic", "Orthodox", "Anglican", "Protestant"]));
    expect(WEB_EDITION.classicSource).toMatch(/^https:\/\/ebible\.org\//);
  });
});
