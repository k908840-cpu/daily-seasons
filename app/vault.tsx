import React, { useCallback, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { loadBookmarks, loadJournal, loadScriptureNotes, saveJournalLine, type Bookmark, type JournalEntry, type ScriptureNote } from "@/lib/storage";

export default function VaultScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [journal, setJournal] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<ScriptureNote[]>([]);
  const refresh = useCallback(() => {
    void Promise.all([loadJournal(), loadBookmarks(), loadScriptureNotes()]).then(([j, b, n]) => {
      setEntries(j); setBookmarks(b); setNotes(n);
      setJournal(j.find(e => e.dateISO === today)?.line ?? "");
    });
  }, [today]);
  useFocusEffect(refresh);
  const save = async () => { await saveJournalLine(today, journal); refresh(); };
  const heading = (label: string) => <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginTop: 28, marginBottom: 12 }}>{label}</Text>;
  const card = (title: string, detail: string, onPress?: () => void) => <Pressable key={title} onPress={onPress} disabled={!onPress} style={{ padding: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 14, marginBottom: 9 }}>
    <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600" }}>{title}</Text>
    {!!detail && <Text numberOfLines={3} style={{ color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 6 }}>{detail}</Text>}
  </Pressable>;
  return <Screen scroll style={{ padding: 22, paddingBottom: 65 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>PRIVATE & OFFLINE</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 9 }}>My Faith Vault</Text>
    <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 10 }}>Your personal reflections and saved passages, stored on this device.</Text>
    {heading("Today's journal")}
    <TextInput value={journal} onChangeText={setJournal} onBlur={() => void save()} multiline placeholder="What is on your heart today?" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, color: colors.text, padding: 15, minHeight: 125, textAlignVertical: "top" }} />
    <Pressable onPress={() => void save()} style={{ backgroundColor: colors.accent, padding: 15, borderRadius: 13, marginTop: 10 }}>
      <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Save reflection</Text>
    </Pressable>
    {heading(`Saved passages & prayers (${bookmarks.length})`)}
    {bookmarks.length === 0 && <Text style={{ color: colors.muted }}>Nothing saved yet.</Text>}
    {bookmarks.map(b => card(b.title, b.kind === "scripture" ? "Scripture reference" : b.kind, b.kind === "scripture" ? () => router.push("/scripture") : b.kind === "prayer" ? () => router.push({ pathname: "/prayer/[id]", params: { id: b.ref } }) : undefined))}
    {heading(`Scripture notes (${notes.length})`)}
    {notes.length === 0 && <Text style={{ color: colors.muted }}>Your Bible notes will appear here.</Text>}
    {notes.map(n => card(n.reference, n.text))}
    {heading(`Past reflections (${entries.filter(e => e.dateISO !== today).length})`)}
    {entries.filter(e => e.dateISO !== today).sort((a, b) => b.dateISO.localeCompare(a.dateISO)).map(e => card(e.dateISO, e.line))}
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 24 }}>Stored locally. You can back up and restore this data from Settings. An app lock is not yet available. Uninstalling without a backup may delete this data.</Text>
  </Screen>;
}
