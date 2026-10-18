import React, { useState } from "react";
import { Linking, Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { BOOKS, passageUrl } from "@/lib/scripture";

export default function ScriptureScreen() {
  const { colors } = useApp();
  const [book, setBook] = useState<string>("Luke");
  const [chapter, setChapter] = useState(1);
  const [search, setSearch] = useState("");
  return <Screen scroll style={{ padding: 20, paddingBottom: 60 }}>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600" }}>Scripture</Text>
    <Text style={{ color: colors.muted, marginVertical: 12 }}>Explore Bible references. Full offline Scripture text is not yet installed.</Text>
    <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 20, marginVertical: 15 }}>
      <Text style={{ color: colors.text, fontSize: 24 }}>{book} {chapter}</Text>
      <View style={{ flexDirection: "row", gap: 16, marginVertical: 20 }}>
        <Pressable onPress={() => setChapter(n => Math.max(1, n - 1))}><Text style={{ color: colors.accent }}>Previous</Text></Pressable>
        <Pressable onPress={() => setChapter(n => n + 1)}><Text style={{ color: colors.accent }}>Next chapter</Text></Pressable>
      </View>
      <Pressable onPress={() => void Linking.openURL(passageUrl(book, chapter))} style={{ backgroundColor: colors.accent, padding: 16, borderRadius: 12 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Read WEB online</Text>
      </Pressable>
    </View>
    <TextInput value={search} onChangeText={setSearch} placeholder="Search books" placeholderTextColor={colors.muted} style={{ color: colors.text, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12 }} />
    {BOOKS.filter(b => b.toLowerCase().includes(search.toLowerCase())).map(b => <Pressable key={b} onPress={() => { setBook(b); setChapter(1); }} style={{ padding: 15, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
      <Text style={{ color: colors.text }}>{b}</Text>
    </Pressable>)}
  </Screen>;
}
