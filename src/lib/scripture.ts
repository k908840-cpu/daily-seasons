/** Bible reference helpers for the public-domain WEB Classic offline edition. */
export const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
  "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
  "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"
] as const;

export function passageUrl(book: string, chapter: number): string {
  const reference = `${book} ${chapter}`;
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=WEB`;
}


/** Additional books present in the WEB Classic ecumenical archive. Canon status varies by tradition. */
export const ADDITIONAL_BOOKS = [
  "Tobit", "Judith", "Greek Esther", "Wisdom of Solomon", "Sirach", "Baruch",
  "1 Maccabees", "2 Maccabees", "1 Esdras", "Prayer of Manasseh",
  "Psalm 151", "3 Maccabees", "4 Esdras", "4 Maccabees", "Greek Daniel",
] as const;
export const ALL_BIBLE_BOOKS: readonly string[] = [...BOOKS, ...ADDITIONAL_BOOKS];
