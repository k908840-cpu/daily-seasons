import { ALL_BIBLE_BOOKS } from "@/lib/scripture";

// Bundled, generated from the public-domain WEB Classic VPL archive.
// The JSON is a static require so Metro includes it in the offline app bundle.
const corpus = require("@/data/webBible.generated.json") as Record<string, Record<string, Record<string, string>>>;

export interface BibleVerse { number: number; text: string }

export function chapterCount(book: string): number {
  const chapters = corpus[book];
  return chapters ? Object.keys(chapters).length : 0;
}

export function readChapter(book: string, chapter: number): BibleVerse[] {
  const verses = corpus[book]?.[String(chapter)];
  if (!verses) return [];
  return Object.entries(verses)
    .map(([number, text]) => ({ number: Number(number), text }))
    .sort((a, b) => a.number - b.number);
}

export function bibleBooks(): string[] {
  return ALL_BIBLE_BOOKS.filter(book => chapterCount(book) > 0);
}

export function searchBible(query: string, limit = 60): Array<{ reference: string; text: string }> {
  const term = query.trim().toLocaleLowerCase();
  if (term.length < 3) return [];
  const results: Array<{ reference: string; text: string }> = [];
  for (const book of bibleBooks()) {
    for (const [chapter, verses] of Object.entries(corpus[book])) {
      for (const [verse, text] of Object.entries(verses)) {
        if (text.toLocaleLowerCase().includes(term)) {
          results.push({ reference: `${book} ${chapter}:${verse}`, text });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}
