import { DAILY_PRAYERS, LIBRARY_PRAYERS, getPrayerById } from "../src/data/prayers";
import { recommendPrayer } from "../src/lib/recommendations";
import type { UserSettings } from "../src/lib/storage";

const settings: UserSettings = {
  onboardingComplete: true,
  textSize: "normal",
  reminderHour: 7,
  reminderMinute: 0,
  mode: "personal",
  darkMode: "system",
  denomination: "Catholic",
  spiritualGoal: "Grow closer to God",
  preferredPrayerTime: "Early morning",
  preferredInterest: "The Rosary",
  preferredDuration: 5,
};

describe("Phase 1 prayer library", () => {
  it("has complete and unique prayers", () => {
    const all = [...DAILY_PRAYERS, ...LIBRARY_PRAYERS];
    expect(all.length).toBeGreaterThanOrEqual(20);
    expect(new Set(all.map(item => item.id)).size).toBe(all.length);
    expect(all.every(item => item.text.trim().length > 20 && item.sourceId)).toBe(true);
  });
  it("finds a traditional prayer", () => {
    expect(getPrayerById("trad-trisagion")?.title).toBe("The Trisagion");
  });
});

describe("Phase 1 personalized recommendations", () => {
  it("recommends rosary for chosen interest", () => {
    expect(recommendPrayer(settings, 9).route).toBe("/rosary");
  });
  it("does not recommend rosary by default to all traditions", () => {
    expect(recommendPrayer({ ...settings, denomination: "Protestant", preferredInterest: undefined }, 9).route).toBe("/scripture");
  });
});
