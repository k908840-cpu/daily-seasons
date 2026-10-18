import type { DailyEntry } from "@/types/content";

export function placeholderDailyEntry(
  season: DailyEntry["season"],
  day: number
): DailyEntry {
  return {
    season,
    day,
    reference: "[REFERENCE PENDING]",
    text: "[SCRIPTURE TEXT PENDING — supply WEB passage from content files.]",
    reflection: undefined,
    prayer:
      "[PRAYER TEXT PENDING — supply traditional public-domain wording.]",
    familyAction: undefined,
    sourceId: "placeholder",
  };
}
