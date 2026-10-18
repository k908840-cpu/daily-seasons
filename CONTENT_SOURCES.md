# Daily Seasons content provenance and import status

## Bible — selected source
- **World English Bible Classic (WEB)**, official publisher eBible.org.
- Official source: https://ebible.org/details.php?id=eng-web
- Source archive: https://ebible.org/Scriptures/eng-web_vpl.zip
- Public-domain statement: https://ebible.org/eng-web/copyright.htm
- WEB is a trademark; do not change the Bible text while continuing to label it WEB.
- The Classic ecumenical edition includes deuterocanonical/apocryphal books; canonical status varies by tradition. Catholic edition: https://ebible.org/details.php?id=eng-web-c; Protestant edition: https://ebible.org/details.php?id=engwebp.

**Current state:** WEB Classic text is bundled as `src/data/webBible.generated.json` (81 books, 38,029 verse records), with offline chapter reading and text search implemented. Android offline runtime verification, verse-level interactions, and denomination-specific canon selection remain pending.

### Build the offline text corpus
1. On a network-connected development computer run `python scripts/import_web.py`.
2. Verify that the script reports at least 30,000 verses and no missing 66-book protocanon books.
3. Review any unknown identifiers and the deuterocanonical book list; verify chapter/verse boundaries against the official eBible reader.
4. Commit `src/data/webBible.generated.json` after verifying its provenance and file size.
5. Implement and test an on-device chapter/verse reader that loads this asset, text search, per-verse highlights/bookmarks, and denomination-specific canon selection.
6. Test offline on an Android development build before advertising full offline Bible support.

The importer intentionally fails rather than writing an incomplete Bible. It was executed locally and basic passage/book-count checks passed; comprehensive verse-by-verse verification remains pending.

## Prayer texts
- `src/data/prayers.ts` four daily prayers are original contemporary prayers authored for Daily Seasons, labelled `daily-seasons-original`.
- Eight additional complete contemporary prayers are included in the library, all labelled `daily-seasons-original`. The 30 unverified historical-prayer placeholders were removed rather than presenting incomplete texts as usable prayers. Historical texts remain pending source and rights verification.
- When adding a historical prayer, preserve exact wording, identify the edition or translation and source URL, and verify reuse rights.
- Tradition tags describe common historical use, not exclusive ownership or doctrinal endorsement.

## Traditions
- Introductory labels and links in `src/data/traditions.ts`.
- Anglican, Catholic, Orthodox, Protestant and Shared Christian are all supported as descriptive categories.
- Orthodox liturgical calendars and biblical canons differ by jurisdiction; don't claim one universal Orthodox canon or calendar.
