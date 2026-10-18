/** Labels identify historical devotional use, not denominational ownership. */
export type Tradition = "Shared Christian" | "Catholic" | "Orthodox" | "Anglican" | "Protestant";
export interface TraditionNote { id: string; label: Tradition; note: string; source: string }
export const TRADITIONS: TraditionNote[] = [
  { id: "shared", label: "Shared Christian", note: "Scripture, the Lord's Prayer and historic creeds are used across multiple Christian traditions. Specific wording and biblical canons can differ.", source: "https://worldenglish.bible/" },
  { id: "catholic", label: "Catholic", note: "Includes the Rosary, Marian prayers, sacramental devotions and the Catholic deuterocanonical books. Prayer translations and local practices vary.", source: "https://www.vatican.va/" },
  { id: "orthodox", label: "Orthodox", note: "Includes the Jesus Prayer, icon-related devotion, the prayer rope and liturgical prayer. Orthodox calendars and biblical canons vary by church.", source: "https://www.oca.org/" },
  { id: "anglican", label: "Anglican", note: "Includes the Daily Office, collects and prayer-book traditions. Prayer-book editions and local provinces differ.", source: "https://www.churchofengland.org/prayer-and-worship" },
  { id: "protestant", label: "Protestant", note: "Includes Scripture meditation, personal prayer, hymns and devotional reading. There is substantial variation across Protestant denominations.", source: "https://worldenglish.bible/" },
];
export const WEB_EDITION = {
  name: "World English Bible (WEB)",
  publisher: "eBible.org",
  license: "Public domain. World English Bible is a trademark; retain the original text and edition attribution.",
  classicSource: "https://ebible.org/details.php?id=eng-web",
  catholicSource: "https://ebible.org/details.php?id=eng-web-c",
  protestantSource: "https://ebible.org/details.php?id=engwebp",
  note: "The ecumenical Classic edition includes deuterocanonical/apocryphal books; canonical status differs by tradition.",
} as const;
