import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { ALL_BIBLE_BOOKS, BOOKS } from "@/lib/scripture";
import { chapterCount, readChapter, searchBible } from "@/lib/offlineBible";
import {
  loadBookmarks, toggleBookmark, loadScriptureNotes, saveScriptureNote,
  loadScriptureHighlights, setScriptureHighlight, loadScripturePosition, saveScripturePosition,
  type ScriptureHighlight,
} from "@/lib/storage";

export default function ScriptureScreen() {
  const { colors } = useApp();
  const [book, setBook] = useState<string>("Luke");
  const [chapter, setChapter] = useState(1);
  const [search, setSearch] = useState("");
  const [verseQuery, setVerseQuery] = useState("");
  const [showAdditional, setShowAdditional] = useState(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [highlight, setHighlight] = useState<ScriptureHighlight["color"] | null>(null);
  const reference = `${book} ${chapter}`;
  const [restoredPosition, setRestoredPosition] = useState(false);
  const noteRef = useRef({ reference, note: "" });
  useEffect(() => {
    void loadScripturePosition().then(p => { if (p && ALL_BIBLE_BOOKS.some(b => b === p.book) && p.chapter <= chapterCount(p.book) && Number.isInteger(p.chapter) && p.chapter >= 1) { setBook(p.book); setChapter(p.chapter); } }).finally(() => setRestoredPosition(true));
  }, []);
  useEffect(() => {
    if (!restoredPosition) return;
    let active = true;
    void saveScripturePosition(book, chapter);
    void Promise.all([loadScriptureNotes(), loadBookmarks(), loadScriptureHighlights()]).then(([notes, bookmarks, highlights]) => {
      if (!active) return;
      const nextNote = notes.find(n => n.reference === reference)?.text ?? "";
      setNote(nextNote);
      noteRef.current = { reference, note: nextNote };
      setSaved(bookmarks.some(b => b.id === `scripture:${reference}`));
      setHighlight(highlights.find(h => h.reference === reference)?.color ?? null);
    });
    return () => { active = false; };
  }, [reference, restoredPosition]);
  const matches = useMemo(() => (showAdditional ? ALL_BIBLE_BOOKS : BOOKS).filter(b => b.toLowerCase().includes(search.trim().toLowerCase())), [search, showAdditional]);
  const verses = useMemo(() => readChapter(book, chapter), [book, chapter]);
  const verseMatches = useMemo(() => searchBible(verseQuery), [verseQuery]);
  const changeReference = (b: string, n: number) => {
    if (noteRef.current.reference !== `${b} ${n}`) {
      void saveScriptureNote(noteRef.current.reference, noteRef.current.note);
      noteRef.current = { reference: `${b} ${n}`, note: "" };
    }
    const safeChapter = Math.min(Math.max(1, n), chapterCount(b) || 1);
    noteRef.current.reference = `${b} ${safeChapter}`;
    setBook(b); setChapter(safeChapter); setSearch("");
  };
  const choose = (b: string) => changeReference(b, 1);
  const bookmark = async () => {
    await toggleBookmark({ id: `scripture:${reference}`, kind: "scripture", ref: reference, title: reference, createdAt: new Date().toISOString() });
    setSaved(s => !s);
  };
  const mark = async (color: ScriptureHighlight["color"]) => {
    const next = highlight === color ? null : color;
    await setScriptureHighlight(reference, next);
    setHighlight(next);
  };
  const parseReference = () => {
    const match = search.trim().match(/^(.+?)\s+(\d+)$/);
    if (!match) return;
    const selected = (showAdditional ? ALL_BIBLE_BOOKS : BOOKS).find(b => b.toLowerCase() === match[1].toLowerCase());
    if (selected && Number.isSafeInteger(Number(match[2])) && Number(match[2]) > 0 && Number(match[2]) <= chapterCount(selected)) changeReference(selected, Number(match[2]));
  };
  const action = (label: string, onPress: () => void, active = false) => (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingHorizontal: 13, paddingVertical: 11, borderWidth: 1, borderColor: colors.border, backgroundColor: active ? colors.border : colors.card, borderRadius: 13 }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
  return <Screen scroll style={{ padding: 20, paddingBottom: 65 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>THE WORD</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 8 }}>Scripture</Text>
    <Text style={{ color: colors.muted, marginVertical: 12, lineHeight: 21 }}>Read the World English Bible (Classic) offline. Book collections differ among Christian traditions.</Text>
    <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, padding: 20, borderRadius: 20, marginVertical: 15 }}>
      <Text style={{ color: colors.text, fontSize: 25, fontWeight: "600" }}>{reference}</Text>
      <View style={{ flexDirection: "row", gap: 12, marginVertical: 20, alignItems: "center" }}>
        {action("− Previous", () => changeReference(book, Math.max(1, chapter - 1)))}
        {action("Next +", () => changeReference(book, Math.min(chapterCount(book), chapter + 1)))}
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 14 }}>World English Bible Classic · available offline · {verses.length} verses</Text>
      {verses.map(v => <Text key={v.number} selectable style={{ color: colors.text, fontSize: 17, lineHeight: 29, marginBottom: 10 }}><Text style={{ color: colors.accent, fontWeight: "700" }}>{v.number}  </Text>{v.text}</Text>)}
      {verses.length === 0 && <Text style={{ color: colors.muted }}>This chapter is unavailable in the bundled edition.</Text>}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
        {action(saved ? "♥ Saved" : "♡ Bookmark", () => void bookmark(), saved)}
        {action("Gold", () => void mark("gold"), highlight === "gold")}
        {action("Lavender", () => void mark("lavender"), highlight === "lavender")}
        {action("Rose", () => void mark("rose"), highlight === "rose")}
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>Highlights currently label a chapter reference, not individual verses.</Text>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600", marginTop: 23 }}>My notes</Text>
      <TextInput value={note} onChangeText={value => { setNote(value); noteRef.current = { reference, note: value }; }} onBlur={() => void saveScriptureNote(reference, note)} multiline placeholder="Write a private reflection on this chapter…" placeholderTextColor={colors.muted} style={{ color: colors.text, minHeight: 90, textAlignVertical: "top", borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginTop: 10 }} />
      <Pressable onPress={() => void saveScriptureNote(reference, note)} style={{ alignSelf: "flex-end", padding: 12 }}>
        <Text style={{ color: colors.accent, fontWeight: "700" }}>Save note</Text>
      </Pressable>
    </View>
    <Text style={{ color: colors.text, fontSize: 21, fontWeight: "600", marginTop: 16, marginBottom: 12 }}>Find a book or reference</Text>
    <TextInput value={search} onChangeText={setSearch} onSubmitEditing={parseReference} returnKeyType="search" placeholder="e.g. John or John 3" placeholderTextColor={colors.muted} style={{ color: colors.text, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14 }} />
    {action("Go to reference", parseReference)}
    {action(showAdditional ? "Show 66-book collection" : "Include additional books", () => setShowAdditional(v => !v), showAdditional)}
    <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginTop: 22 }}>Search Bible verses offline</Text>
    <TextInput value={verseQuery} onChangeText={setVerseQuery} placeholder="Enter at least 3 characters" placeholderTextColor={colors.muted} style={{ color: colors.text, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14, marginVertical: 10 }} />
    {verseMatches.map(item => <Pressable key={item.reference} onPress={() => { const match = item.reference.match(/^(.+) (\\d+):(\\d+)$/); if (match) changeReference(match[1], Number(match[2])); }} style={{ paddingVertical: 12, borderBottomColor: colors.border, borderBottomWidth: 1 }}><Text style={{ color: colors.accent, fontWeight: "700" }}>{item.reference}</Text><Text style={{ color: colors.text, lineHeight: 22 }}>{item.text}</Text></Pressable>)}
    {matches.map(b => <Pressable key={b} onPress={() => choose(b)} style={{ padding: 15, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
      <Text style={{ color: colors.text }}>{b}</Text>
    </Pressable>)}
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 24 }}>The 66-book collection is shown by default. Additional books are available from the WEB Classic ecumenical archive; their canonical status varies by tradition. This is not a denomination-specific approved edition.</Text>
  </Screen>;
}
