#!/usr/bin/env python3
"""Import the public-domain WEB Classic verse-per-line archive from eBible.org.
Run locally: python scripts/import_web.py
The resulting src/data/webBible.generated.json must be committed to bundle it offline.
No third-party Python packages required.
"""
import io
import json
import re
import urllib.request
import zipfile
from pathlib import Path

URL = "https://ebible.org/Scriptures/eng-web_vpl.zip"
ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "src" / "data" / "webBible.generated.json"
# The WEB Classic VPL includes additional deuterocanonical/apocryphal books.
# Retain all recognized book names, and report unrecognized identifiers for review.
ALIASES = {
    "GEN":"Genesis","EXO":"Exodus","LEV":"Leviticus","NUM":"Numbers","DEU":"Deuteronomy",
    "JOS":"Joshua","JDG":"Judges","RUT":"Ruth","1SA":"1 Samuel","2SA":"2 Samuel",
    "1KI":"1 Kings","2KI":"2 Kings","1CH":"1 Chronicles","2CH":"2 Chronicles",
    "EZR":"Ezra","NEH":"Nehemiah","EST":"Esther","JOB":"Job","PSA":"Psalms",
    "PRO":"Proverbs","ECC":"Ecclesiastes","SNG":"Song of Solomon","ISA":"Isaiah",
    "JER":"Jeremiah","LAM":"Lamentations","EZK":"Ezekiel","DAN":"Daniel",
    "HOS":"Hosea","JOL":"Joel","AMO":"Amos","OBA":"Obadiah","JON":"Jonah",
    "MIC":"Micah","NAM":"Nahum","HAB":"Habakkuk","ZEP":"Zephaniah","HAG":"Haggai",
    "ZEC":"Zechariah","MAL":"Malachi","MAT":"Matthew","MRK":"Mark","LUK":"Luke",
    "JHN":"John","ACT":"Acts","ROM":"Romans","1CO":"1 Corinthians",
    "2CO":"2 Corinthians","GAL":"Galatians","EPH":"Ephesians","PHP":"Philippians",
    "COL":"Colossians","1TH":"1 Thessalonians","2TH":"2 Thessalonians",
    "1TI":"1 Timothy","2TI":"2 Timothy","TIT":"Titus","PHM":"Philemon",
    "HEB":"Hebrews","JAS":"James","1PE":"1 Peter","2PE":"2 Peter",
    "1JN":"1 John","2JN":"2 John","3JN":"3 John","JUD":"Jude","REV":"Revelation",
    # Alternate identifiers used by eBible VPL editions.\n    "SOS":"Song of Solomon","EZE":"Ezekiel","JOE":"Joel","NAH":"Nahum",
    "MAR":"Mark","JOH":"John","PHI":"Philippians","JAM":"James",
    "1JO":"1 John","2JO":"2 John","3JO":"3 John",
    "4ES":"4 Esdras","4MA":"4 Maccabees",
}
# eBible BibleWorks VPL uses a reference followed by text, with a separator.
PATTERN = re.compile(r"^(.+?)\s+(\d+):(\d+)(?:[-–]\d+)?\s+(.+)$")
def main():
    req = urllib.request.Request(URL, headers={"User-Agent": "DailySeasonsOfflineImporter/1.0"})
    with urllib.request.urlopen(req, timeout=60) as response:
        archive = zipfile.ZipFile(io.BytesIO(response.read()))
    candidates = [name for name in archive.namelist() if name.lower().endswith((".txt",".vpl"))]
    if not candidates:
        raise RuntimeError("No text/VPL file found in the official archive; inspect format before importing.")
    books = {}
    unknown = set()
    for filename in candidates:
        text = archive.read(filename).decode("utf-8-sig", errors="replace")
        for line in text.splitlines():
            match = PATTERN.match(line.strip())
            if not match:
                continue
            code, chapter, verse, words = match.groups()
            code = code.strip()
            book = ALIASES.get(code.upper(), code)
            if not re.match(r"^[1-3]?\s*[A-Za-z][A-Za-z ]+$", book):
                unknown.add(code)
                continue
            books.setdefault(book, {}).setdefault(str(int(chapter)), {})[str(int(verse))] = words.strip()
    count = sum(len(v) for b in books.values() for v in b.values())
    missing = [b for b in ALIASES.values() if b not in books]
    if missing or count < 30000:
        raise RuntimeError(f"Import incomplete: {count} verses, missing {missing[:15]}, unknown identifiers {sorted(unknown)[:15]}. Inspect archive format; do not ship partial text.")
    DEST.write_text(json.dumps(books, ensure_ascii=False, separators=(",",":")), encoding="utf-8")
    print(f"Wrote {count} verses in {len(books)} books to {DEST}")
    print("Source:", URL)
    if unknown:
        print("Review skipped identifiers:", sorted(unknown))
if __name__ == "__main__":
    main()
