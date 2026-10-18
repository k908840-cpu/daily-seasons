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

/** Original contemporary prayers composed for Daily Seasons; not historical liturgical translations. */
export const DAILY_PRAYERS: PrayerItem[] = [
  { id: "morning", title: "Morning Prayer", category: "daily", sourceId: "daily-seasons-original", text: "God of mercy, thank you for this new day. Give me wisdom in my choices, patience with others, and courage to do what is right. Help me notice those who need kindness and meet them with love. Amen." },
  { id: "evening", title: "Evening Prayer", category: "daily", sourceId: "daily-seasons-original", text: "God of peace, I bring you the joys and burdens of this day. Thank you for every kindness received and every chance to give. Forgive what I have done poorly, guide me to make things right, and grant rest to all who are weary. Amen." },
  { id: "night", title: "Night Prayer", category: "daily", sourceId: "daily-seasons-original", text: "Lord, as this day comes to an end, quiet my thoughts and ease my worries. Watch over those I love, those who are alone, and those who cannot sleep. May tomorrow find me ready to begin again with hope. Amen." },
  { id: "examen", title: "Daily Examen", category: "examen", sourceId: "daily-seasons-original", text: "God, help me remember today with honesty and gratitude. Where did I experience love? When did I turn away from it? Show me one thing to give thanks for, one thing to make right, and one small step toward faithfulness tomorrow. Amen." },
];

export const LIBRARY_PRAYERS: PrayerItem[] = libraryTitles.map((title, i) =>
  placeholderPrayer(`lib-${i + 1}`, title, "library")
);

export function getPrayerById(id: string): PrayerItem | undefined {
  return [...DAILY_PRAYERS, ...LIBRARY_PRAYERS].find((p) => p.id === id);
}
