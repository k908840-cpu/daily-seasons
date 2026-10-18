import AsyncStorage from "@react-native-async-storage/async-storage";

/** Only private, user-generated app data. Purchases are never portable through backups. */
const PREFIX = "@daily_seasons/";
const FIELDS = ["settings","progress","journal","bookmarks","prayer_list","scripture_notes","scripture_highlights","scripture_position","rosary_session","daily_path","novena_progress"] as const;
const MAX_BYTES = 1024 * 1024;
type Field = typeof FIELDS[number];
export interface BackupData { app: "daily-seasons"; version: 1; exportedAt: string; data: Partial<Record<Field, unknown>> }
export async function exportBackup(): Promise<string> {
  const data: Partial<Record<Field, unknown>> = {};
  for (const key of FIELDS) {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (raw !== null) data[key] = JSON.parse(raw) as unknown;
  }
  return JSON.stringify({ app: "daily-seasons", version: 1, exportedAt: new Date().toISOString(), data } satisfies BackupData, null, 2);
}
function plainObject(v: unknown): v is Record<string, unknown> { return typeof v === "object" && v !== null && !Array.isArray(v); }
const isString = (v: unknown): v is string => typeof v === "string";
const isShortString = (v: unknown) => isString(v) && v.length <= 20000;
const isList = (v: unknown, predicate: (v: unknown) => boolean) =>
  Array.isArray(v) && v.length <= 10000 && v.every(predicate);
function validate(key: Field, value: unknown): boolean {
  switch (key) {
    case "settings":
      return plainObject(value) && typeof value.onboardingComplete === "boolean" &&
        ["normal","large"].includes(String(value.textSize)) &&
        ["system","light","dark"].includes(String(value.darkMode)) &&
        Number.isInteger(Number(value.reminderHour)) && Number(value.reminderHour) >= 0 && Number(value.reminderHour) <= 23 &&
        Number.isInteger(Number(value.reminderMinute)) && Number(value.reminderMinute) >= 0 && Number(value.reminderMinute) <= 59;
    case "progress": return plainObject(value) && isList(value.readDays, isShortString);
    case "journal": return isList(value, v => plainObject(v) && isShortString(v.dateISO) && isShortString(v.line));
    case "bookmarks": return isList(value, v => plainObject(v) && isShortString(v.id) && isShortString(v.ref) && isShortString(v.title) && isShortString(v.createdAt) && ["daily","prayer","scripture"].includes(String(v.kind)));
    case "prayer_list": return isList(value, v => plainObject(v) && isShortString(v.id) && isShortString(v.name) && isShortString(v.intention) && typeof v.prayed === "boolean");
    case "scripture_notes": return isList(value, v => plainObject(v) && isShortString(v.reference) && isShortString(v.text) && isShortString(v.updatedAt));
    case "scripture_highlights": return isList(value, v => plainObject(v) && isShortString(v.reference) && ["gold","lavender","rose"].includes(String(v.color)));
    case "scripture_position": return plainObject(value) && isShortString(value.book) && Number.isInteger(Number(value.chapter)) && Number(value.chapter) >= 1 && Number(value.chapter) <= 150;
    case "rosary_session": return plainObject(value) && ["Joyful","Sorrowful","Glorious","Luminous"].includes(String(value.kind)) && Number.isInteger(Number(value.step)) && Number(value.step) >= 0 && Number(value.step) <= 100;
    case "daily_path": return plainObject(value) && isShortString(value.date) && [2,5,10,15].includes(Number(value.duration)) && isList(value.completedSteps, n => Number.isInteger(Number(n)) && Number(n) >= 0 && Number(n) <= 4);
    case "novena_progress": return plainObject(value) && Object.values(value).every(x => isList(x, n => Number.isInteger(Number(n)) && Number(n) >= 1 && Number(n) <= 9));
    default: return false;
  }
}
export function parseBackup(text: string): BackupData {
  if (text.length > MAX_BYTES) throw new Error("Backup is too large (maximum 1 MB).");
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error("Backup is not valid JSON."); }
  if (!plainObject(parsed) || parsed.app !== "daily-seasons" || parsed.version !== 1 || !plainObject(parsed.data)) throw new Error("Not a supported Daily Seasons backup.");
  const data = parsed.data;
  if (Object.keys(data).some(k => !FIELDS.includes(k as Field))) throw new Error("Backup contains unknown fields.");
  if (!Object.keys(data).length) throw new Error("Backup contains no app data.");
  for (const [key, value] of Object.entries(data)) {
    if (!validate(key as Field, value)) throw new Error(`Invalid backup section: ${key}`);
  }
  return parsed as unknown as BackupData;
}
export async function importBackup(text: string): Promise<void> {
  const parsed = parseBackup(text);
  const items = Object.entries(parsed.data).map(([key, value]) => [PREFIX + key, JSON.stringify(value)] as [string,string]);
  // Preserve the existing values if storage fails partway through a restore.
  const previous = await AsyncStorage.multiGet(items.map(([key]) => key));
  try { await AsyncStorage.multiSet(items); }
  catch (error) {
    const restore = previous.filter((pair): pair is [string, string] => pair[1] !== null);
    const remove = previous.filter(([, value]) => value === null).map(([key]) => key);
    await AsyncStorage.multiSet(restore);
    if (remove.length) await AsyncStorage.multiRemove(remove);
    throw error;
  }
}
