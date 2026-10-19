import { ALL_BIBLE_BOOKS, BOOKS } from "../src/lib/scripture";
import { bibleBooks, chapterCount, readChapter, searchBible } from "../src/lib/offlineBible";

describe("bundled WEB Classic Bible", () => {
  test("contains every standard book and all 15 additional books", () => {
    const books = bibleBooks();
    expect(BOOKS).toHaveLength(66);
    expect(ALL_BIBLE_BOOKS).toHaveLength(81);
    expect(books).toHaveLength(81);
    for (const book of ALL_BIBLE_BOOKS) expect(books).toContain(book);
  });

  test("provides known chapters and verses without network access", () => {
    expect(chapterCount("Genesis")).toBe(50);
    expect(chapterCount("Psalms")).toBe(150);
    expect(chapterCount("Revelation")).toBe(22);
    expect(readChapter("Genesis", 1)[0]).toEqual({ number: 1, text: "In the beginning, God created the heavens and the earth." });
    expect(readChapter("John", 3).find(v => v.number === 16)?.text).toContain("For God so loved the world");
    expect(readChapter("John", 999)).toEqual([]);
  });

  test("search returns navigable verse references", () => {
    const matches = searchBible("God so loved", 5);
    expect(matches.some(m => m.reference === "John 3:16")).toBe(true);
    expect(searchBible("Go")).toEqual([]);
  });
});
