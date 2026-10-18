import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { v4 as uuidv4 } from "uuid";
import { useApp } from "@/context/AppContext";
import { loadPrayerList, savePrayerList, type PrayerListItem } from "@/lib/storage";

export default function ToolsScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [items, setItems] = useState<PrayerListItem[]>([]);
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");
  useEffect(() => { void loadPrayerList().then(setItems); }, []);
  const add = async () => {
    if (!name.trim()) return;
    const next = [{ id: uuidv4(), name: name.trim(), intention: intention.trim(), prayed: false }, ...items];
    setItems(next); setName(""); setIntention(""); await savePrayerList(next);
  };
  const toggle = async (id: string) => {
    const next = items.map(i => i.id === id ? { ...i, prayed: !i.prayed } : i);
    setItems(next); await savePrayerList(next);
  };
  const remove = async (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next); await savePrayerList(next);
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={[styles.eyebrow, { color: colors.accent }]}>YOUR QUIET SPACE</Text>
      <Text style={[styles.title, { color: colors.text }]}>Prayer tools</Text>
      <Text style={[styles.intro, { color: colors.muted }]}>Simple ways to pause, reflect, and pray.</Text>
      <View style={styles.grid}>
        <Pressable onPress={() => router.push("/rosary")} style={[styles.feature, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="ellipse-outline" size={30} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>The Rosary</Text>
          <Text style={[styles.featureCaption, { color: colors.muted }]}>Mysteries & bead counter</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.accent} />
        </Pressable>
        <Pressable onPress={() => router.push("/timer")} style={[styles.feature, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="time-outline" size={30} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Prayer timer</Text>
          <Text style={[styles.featureCaption, { color: colors.muted }]}>A few minutes of stillness</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.accent} />
        </Pressable>
      </View>
      <Text style={[styles.section, { color: colors.text }]}>Your prayer intentions</Text>
      <Text style={[styles.description, { color: colors.muted }]}>Private and saved on this device.</Text>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput value={name} onChangeText={setName} placeholder="Who or what are you praying for?" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        <TextInput value={intention} onChangeText={setIntention} placeholder="Add a note (optional)" placeholderTextColor={colors.muted} multiline style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        <Pressable onPress={() => void add()} accessibilityRole="button" style={[styles.add, { backgroundColor: colors.accent }]}>
          <Ionicons name="add" size={20} color="#fff" /><Text style={styles.addText}>Add intention</Text>
        </Pressable>
      </View>
      {items.length === 0 && <Text style={[styles.empty, { color: colors.muted }]}>Your intentions will appear here.</Text>}
      {items.map(item => (
        <View key={item.id} style={[styles.intention, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable onPress={() => void toggle(item.id)} style={styles.intentionMain} accessibilityRole="checkbox" accessibilityState={{ checked: item.prayed }}>
            <Ionicons name={item.prayed ? "checkmark-circle" : "ellipse-outline"} size={25} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.text, textDecorationLine: item.prayed ? "line-through" : "none" }]}>{item.name}</Text>
              {!!item.intention && <Text style={[styles.itemNote, { color: colors.muted }]}>{item.intention}</Text>}
            </View>
          </Pressable>
          <Pressable onPress={() => void remove(item.id)} accessibilityLabel={"Remove " + item.name} style={styles.remove}>
            <Ionicons name="trash-outline" size={19} color={colors.muted} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page: { padding: 22, paddingBottom: 60 }, eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 2.2, marginBottom: 9 },
  title: { fontSize: 32, fontWeight: "600", letterSpacing: -0.7 }, intro: { fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 27 },
  grid: { flexDirection: "row", gap: 12 }, feature: { flex: 1, minHeight: 187, borderRadius: 22, borderWidth: 1, padding: 17, justifyContent: "space-between" },
  featureTitle: { fontSize: 18, fontWeight: "600", marginTop: 12 }, featureCaption: { fontSize: 12, lineHeight: 18, marginTop: 4, marginBottom: 8 },
  section: { fontSize: 23, fontWeight: "600", marginTop: 35 }, description: { fontSize: 14, marginTop: 6, marginBottom: 16 },
  panel: { borderWidth: 1, borderRadius: 22, padding: 16, gap: 11 }, input: { borderWidth: 1, borderRadius: 13, minHeight: 49, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  add: { borderRadius: 14, minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  addText: { color: "#fff", fontWeight: "700", fontSize: 15 }, empty: { textAlign: "center", marginTop: 25, fontSize: 14 },
  intention: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 16, marginTop: 10 },
  intentionMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, padding: 15 }, itemTitle: { fontSize: 15, fontWeight: "600" },
  itemNote: { fontSize: 13, marginTop: 5 }, remove: { padding: 16 },
});
