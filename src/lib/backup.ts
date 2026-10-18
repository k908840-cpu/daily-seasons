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
function validate(key: Field, value: unknown): boolean {
  if (["progress","journal","bookmarks","prayer_list","scripture_notes","scripture_highlights","novena_progress"].includes(key)) {
    if (key === "progress") return plainObject(value) && Array.isArray(value.readDays) && value.readDays.every(x => typeof x === "string");
    if (key === "novena_progress") return plainObject(value) && Object.values(value).every(x => Array.isArray(x) && x.every(n => Number.isInteger(n) && n >= 1 && n <= 9));
    return Array.isArray(value) && value.length <= 10000 && value.every(item => plainObject(item));
  }
  return plainObject(value);
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
  await AsyncStorage.multiSet(items);
}
