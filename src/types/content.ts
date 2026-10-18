export type SeasonContentId = "advent" | "christmas" | "lent" | "holy-week" | "easter";

export interface DailyEntry {
  season: SeasonContentId;
  /** Day index within season (Advent: 1–25; Christmas: 1–12; etc.) */
  day: number;
  reference: string;
  text: string;
  reflection?: string;
  prayer: string;
  familyAction?: string;
  /** Attribution key for Sources screen */
  sourceId: string;
}

export interface PrayerItem {
  id: string;
  title: string;
  category: "daily" | "library" | "examen";
  text: string;
  sourceId: string;
}

export interface SourceAttribution {
  id: string;
  label: string;
  detail: string;
  licenseNote?: string;
}
