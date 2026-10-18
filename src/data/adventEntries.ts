import type { DailyEntry } from "@/types/content";
import { placeholderDailyEntry } from "./placeholderEntry";

/** Replace each entry with your WEB passages and verified prayers before release. */
const adventOverrides: Partial<Record<number, Partial<DailyEntry>>> = {};

export function getAdventEntry(day: number): DailyEntry {
  const base = placeholderDailyEntry("advent", day);
  const patch = adventOverrides[day];
  return patch ? { ...base, ...patch } : base;
}

export function getAllAdventEntries(): DailyEntry[] {
  return Array.from({ length: 25 }, (_, i) => getAdventEntry(i + 1));
}
