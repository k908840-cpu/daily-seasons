import type { PrayerItem } from "@/types/content";

/** ~30 library slots; fill with verified public-domain text. */
const libraryTitles = [
  "The Lord's Prayer",
  "Apostles' Creed",
  "Nicene Creed",
  "Glory Be",
  "Hail Mary",
  "Magnificat",
  "Nunc Dimittis",
  "Psalm 23",
  "Psalm 51",
  "Psalm 91",
  "Psalm 121",
  "Psalm 130",
  "Te Deum (excerpt)",
  "Anima Christi",
  "Prayer of St. Francis",
  "Serenity Prayer (traditional)",
  "Jesus Prayer",
  "Guardian Angel",
  "Grace Before Meals",
  "Grace After Meals",
  "Act of Contrition",
  "Memorare",
  "Sub Tuum Praesidium",
  "St. Patrick's Breastplate (excerpt)",
  "Come, Holy Spirit",
  "Angelus (short form)",
  "Regina Caeli (short form)",
  "Benedictus",
  "Prayer for Peace",
  "Evening Collect",
];

function placeholderPrayer(
  id: string,
  title: string,
  category: PrayerItem["category"]
): PrayerItem {
  return {
    id,
    title,
    category,
    text: `[PRAYER TEXT PENDING — ${title}]`,
    sourceId: "placeholder",
  };
}

export const DAILY_PRAYERS: PrayerItem[] = [
  placeholderPrayer("morning", "Morning Prayer", "daily"),
  placeholderPrayer("evening", "Evening Prayer", "daily"),
  placeholderPrayer("night", "Night Prayer", "daily"),
  placeholderPrayer("examen", "Daily Examen", "examen"),
];

export const LIBRARY_PRAYERS: PrayerItem[] = libraryTitles.map((title, i) =>
  placeholderPrayer(`lib-${i + 1}`, title, "library")
);

export function getPrayerById(id: string): PrayerItem | undefined {
  return [...DAILY_PRAYERS, ...LIBRARY_PRAYERS].find((p) => p.id === id);
}
