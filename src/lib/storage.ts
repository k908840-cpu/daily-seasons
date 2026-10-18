import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  settings: "@daily_seasons/settings",
  progress: "@daily_seasons/progress",
  journal: "@daily_seasons/journal",
  bookmarks: "@daily_seasons/bookmarks",
  prayerList: "@daily_seasons/prayer_list",
  purchase: "@daily_seasons/purchase",
  scriptureNotes: "@daily_seasons/scripture_notes",
  scriptureHighlights: "@daily_seasons/scripture_highlights",
  scripturePosition: "@daily_seasons/scripture_position",
} as const;

export type TextSize = "normal" | "large";
export type AppMode = "personal" | "family";

export interface UserSettings {
  onboardingComplete: boolean;
  textSize: TextSize;
  reminderHour: number;
  reminderMinute: number;
  mode: AppMode;
  darkMode: "system" | "light" | "dark";
}

export interface ProgressState {
  /** Keys like `advent-2026-3` for days marked read */
  readDays: string[];
}

export interface JournalEntry {
  dateISO: string;
  line: string;
}

export interface Bookmark {
  id: string;
  kind: "daily" | "prayer" | "scripture";
  ref: string;
  title: string;
  createdAt: string;
}

export interface PrayerListItem {
  id: string;
  name: string;
  intention: string;
  prayed: boolean;
}

const defaultSettings: UserSettings = {
  onboardingComplete: false,
  textSize: "normal",
  reminderHour: 7,
  reminderMinute: 0,
  mode: "personal",
  darkMode: "system",
};

export async function loadSettings(): Promise<UserSettings> {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  if (!raw) return { ...defaultSettings };
  return { ...defaultSettings, ...JSON.parse(raw) };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export async function loadProgress(): Promise<ProgressState> {
  const raw = await AsyncStorage.getItem(KEYS.progress);
  if (!raw) return { readDays: [] };
  return JSON.parse(raw) as ProgressState;
}

export async function markDayRead(key: string): Promise<ProgressState> {
  const p = await loadProgress();
  if (!p.readDays.includes(key)) p.readDays.push(key);
  await AsyncStorage.setItem(KEYS.progress, JSON.stringify(p));
  return p;
}

export async function loadJournal(): Promise<JournalEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.journal);
  if (!raw) return [];
  return JSON.parse(raw) as JournalEntry[];
}

export async function saveJournalLine(
  dateISO: string,
  line: string
): Promise<void> {
  const all = await loadJournal();
  const idx = all.findIndex((e) => e.dateISO === dateISO);
  if (idx >= 0) all[idx] = { dateISO, line };
  else all.push({ dateISO, line });
  await AsyncStorage.setItem(KEYS.journal, JSON.stringify(all));
}

export async function loadBookmarks(): Promise<Bookmark[]> {
  const raw = await AsyncStorage.getItem(KEYS.bookmarks);
  if (!raw) return [];
  return JSON.parse(raw) as Bookmark[];
}

export async function toggleBookmark(b: Bookmark): Promise<Bookmark[]> {
  const all = await loadBookmarks();
  const idx = all.findIndex((x) => x.id === b.id);
  if (idx >= 0) all.splice(idx, 1);
  else all.push(b);
  await AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify(all));
  return all;
}

export async function loadPrayerList(): Promise<PrayerListItem[]> {
  const raw = await AsyncStorage.getItem(KEYS.prayerList);
  if (!raw) return [];
  return JSON.parse(raw) as PrayerListItem[];
}

export async function savePrayerList(items: PrayerListItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.prayerList, JSON.stringify(items));
}

export async function isPremiumUnlocked(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.purchase);
  return raw === "true";
}

export async function setPremiumUnlocked(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.purchase, value ? "true" : "false");
}

export function progressKey(season: string, year: number, day: number): string {
  return `${season}-${year}-${day}`;
}

export interface ScriptureNote {
  reference: string;
  text: string;
  updatedAt: string;
}
export interface ScriptureHighlight {
  reference: string;
  color: "gold" | "lavender" | "rose";
}
export async function loadScriptureNotes(): Promise<ScriptureNote[]> {
  return JSON.parse((await AsyncStorage.getItem(KEYS.scriptureNotes)) ?? "[]") as ScriptureNote[];
}
export async function saveScriptureNote(reference: string, text: string): Promise<void> {
  const notes = (await loadScriptureNotes()).filter(n => n.reference !== reference);
  if (text.trim()) notes.unshift({ reference, text: text.trim(), updatedAt: new Date().toISOString() });
  await AsyncStorage.setItem(KEYS.scriptureNotes, JSON.stringify(notes));
}
export async function loadScriptureHighlights(): Promise<ScriptureHighlight[]> {
  return JSON.parse((await AsyncStorage.getItem(KEYS.scriptureHighlights)) ?? "[]") as ScriptureHighlight[];
}
export async function setScriptureHighlight(reference: string, color: ScriptureHighlight["color"] | null): Promise<void> {
  const items = (await loadScriptureHighlights()).filter(h => h.reference !== reference);
  if (color) items.push({ reference, color });
  await AsyncStorage.setItem(KEYS.scriptureHighlights, JSON.stringify(items));
}
export async function saveScripturePosition(book: string, chapter: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.scripturePosition, JSON.stringify({ book, chapter }));
}
export async function loadScripturePosition(): Promise<{ book: string; chapter: number } | null> {
  const raw = await AsyncStorage.getItem(KEYS.scripturePosition);
  return raw ? JSON.parse(raw) : null;
}
