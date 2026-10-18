import React, { useEffect, useMemo, useState } from "react";
import { Linking, Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { BOOKS, passageUrl } from "@/lib/scripture";
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
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [highlight, setHighlight] = useState<ScriptureHighlight["color"] | null>(null);
  const reference = `${book} ${chapter}`;
  useEffect(() => {
    void loadScripturePosition().then(p => { if (p && BOOKS.some(b => b === p.book)) { setBook(p.book); setChapter(p.chapter); } });
  }, []);
  useEffect(() => {
    void saveScripturePosition(book, chapter);
    void Promise.all([loadScriptureNotes(), loadBookmarks(), loadScriptureHighlights()]).then(([notes, bookmarks, highlights]) => {
      setNote(notes.find(n => n.reference === reference)?.text ?? "");
      setSaved(bookmarks.some(b => b.id === `scripture:${reference}`));
      setHighlight(highlights.find(h => h.reference === reference)?.color ?? null);
    });
  }, [reference]);
  const matches = useMemo(() => BOOKS.filter(b => b.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  const choose = (b: string) => { setBook(b); setChapter(1); setSearch(""); };
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
    const selected = BOOKS.find(b => b.toLowerCase() === match[1].toLowerCase());
    if (selected) { setBook(selected); setChapter(Math.max(1, Number(match[2]))); setSearch(""); }
  };
  const action = (label: string, onPress: () => void, active = false) => (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingHorizontal: 13, paddingVertical: 11, borderWidth: 1, borderColor: colors.border, backgroundColor: active ? colors.border : colors.card, borderRadius: 13 }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
  return <Screen scroll style={{ padding: 20, paddingBottom: 65 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>THE WORD</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 8 }}>Scripture</Text>
    <Text style={{ color: colors.muted, marginVertical: 12, lineHeight: 21 }}>Browse and save Bible references. Full offline Bible text is being prepared.</Text>
    <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, padding: 20, borderRadius: 20, marginVertical: 15 }}>
      <Text style={{ color: colors.text, fontSize: 25, fontWeight: "600" }}>{reference}</Text>
      <View style={{ flexDirection: "row", gap: 12, marginVertical: 20, alignItems: "center" }}>
        {action("− Previous", () => setChapter(n => Math.max(1, n - 1)))}
        {action("Next +", () => setChapter(n => n + 1))}
      </View>
      <Pressable onPress={() => void Linking.openURL(passageUrl(book, chapter))} style={{ backgroundColor: colors.accent, padding: 16, borderRadius: 14 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Read World English Bible online ↗</Text>
      </Pressable>
      <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 12 }}>External reading requires internet. Notes and bookmarks below work offline.</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
        {action(saved ? "♥ Saved" : "♡ Bookmark", () => void bookmark(), saved)}
        {action("Gold", () => void mark("gold"), highlight === "gold")}
        {action("Lavender", () => void mark("lavender"), highlight === "lavender")}
        {action("Rose", () => void mark("rose"), highlight === "rose")}
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>Highlights currently label a chapter reference, not individual verses.</Text>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600", marginTop: 23 }}>My notes</Text>
      <TextInput value={note} onChangeText={setNote} onBlur={() => void saveScriptureNote(reference, note)} multiline placeholder="Write a private reflection on this chapter…" placeholderTextColor={colors.muted} style={{ color: colors.text, minHeight: 90, textAlignVertical: "top", borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginTop: 10 }} />
      <Pressable onPress={() => void saveScriptureNote(reference, note)} style={{ alignSelf: "flex-end", padding: 12 }}>
        <Text style={{ color: colors.accent, fontWeight: "700" }}>Save note</Text>
      </Pressable>
    </View>
    <Text style={{ color: colors.text, fontSize: 21, fontWeight: "600", marginTop: 16, marginBottom: 12 }}>Find a book or reference</Text>
    <TextInput value={search} onChangeText={setSearch} onSubmitEditing={parseReference} returnKeyType="search" placeholder="e.g. John or John 3" placeholderTextColor={colors.muted} style={{ color: colors.text, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14 }} />
    {action("Go to reference", parseReference)}
    {matches.map(b => <Pressable key={b} onPress={() => choose(b)} style={{ padding: 15, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
      <Text style={{ color: colors.text }}>{b}</Text>
    </Pressable>)}
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 24 }}>Book navigation currently uses the 66-book Protestant canon. Catholic and Orthodox deuterocanonical support and verified offline Bible text are still pending.</Text>
  </Screen>;
}
