import type { DailyEntry } from "@/types/content";
import { placeholderDailyEntry } from "./placeholderEntry";

export function getChristmasEntry(day: number): DailyEntry {
  if (day < 1 || day > 12) return placeholderDailyEntry("christmas", day);
  return placeholderDailyEntry("christmas", day);
}
