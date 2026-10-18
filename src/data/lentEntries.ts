import type { DailyEntry } from "@/types/content";
import { placeholderDailyEntry } from "./placeholderEntry";

/** Reserved for Jan 2027 update (~46 days). Not shipped in v1 UI. */
export function getLentEntry(day: number): DailyEntry {
  return placeholderDailyEntry("lent", day);
}

export const LENT_DAY_COUNT = 46;
