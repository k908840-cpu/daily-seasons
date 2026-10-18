const store = new Map<string, string>();
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => store.get(key) ?? null),
    multiGet: jest.fn(async (keys: string[]) => keys.map(key => [key, store.get(key) ?? null])),
    multiSet: jest.fn(async (pairs: [string,string][]) => { pairs.forEach(([key, value]) => store.set(key, value)); }),
    multiRemove: jest.fn(async (keys: string[]) => { keys.forEach(key => store.delete(key)); }),
  },
}));
import { exportBackup, importBackup, parseBackup } from "../src/lib/backup";
beforeEach(() => store.clear());
test("exports and restores a saved journal without purchase entitlement", async () => {
  store.set("@daily_seasons/journal", JSON.stringify([{ dateISO: "2026-10-18", line: "Gratitude" }]));
  store.set("@daily_seasons/purchase", "true");
  const exported = await exportBackup();
  expect(exported).not.toContain('"purchase"');
  store.clear();
  await importBackup(exported);
  expect(JSON.parse(store.get("@daily_seasons/journal")!)).toEqual([{ dateISO: "2026-10-18", line: "Gratitude" }]);
  expect(store.has("@daily_seasons/purchase")).toBe(false);
});
test("rejects unknown sections and malformed records", () => {
  expect(() => parseBackup(JSON.stringify({ app: "daily-seasons", version: 1, data: { purchase: true } }))).toThrow("unknown fields");
  expect(() => parseBackup(JSON.stringify({ app: "daily-seasons", version: 1, data: { journal: [{ bogus: true }] } }))).toThrow("Invalid backup section");
});
