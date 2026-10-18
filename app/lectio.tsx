import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
const phases = [
  { title: "Read", question: "Read a Scripture passage slowly, perhaps twice. Which word or phrase catches your attention?" },
  { title: "Meditate", question: "Stay with that phrase. What does it reveal about God, yourself, or your situation?" },
  { title: "Pray", question: "Respond to God with your own words: gratitude, questions, hope, or a request." },
  { title: "Contemplate", question: "Rest quietly in God's presence without needing to fill the silence." },
];
export default function LectioScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  return <Screen scroll style={{ padding: 22, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>PRAY WITH SCRIPTURE</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 10 }}>Lectio Divina</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 10 }}>An ancient practice of prayerful reading. Move through each phase at your own pace.</Text>
    <View style={{ flexDirection: "row", gap: 6, marginTop: 24 }}>{phases.map((p, i) => <View key={p.title} style={{ flex: 1, height: 6, borderRadius: 4, backgroundColor: i <= phase ? colors.accent : colors.border }} />)}</View>
    <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 22, padding: 24, marginTop: 22 }}>
      <Text style={{ color: colors.gold, fontWeight: "700" }}>PHASE {phase + 1} OF 4</Text>
      <Text style={{ color: colors.text, fontSize: 25, fontWeight: "600", marginTop: 12 }}>{phases[phase].title}</Text>
      <Text style={{ color: colors.muted, lineHeight: 25, fontSize: 16, marginTop: 15 }}>{phases[phase].question}</Text>
    </View>
    <Pressable onPress={() => router.push("/scripture")} style={{ padding: 15, borderWidth: 1, borderColor: colors.border, borderRadius: 14, marginTop: 18 }}><Text style={{ color: colors.accent, textAlign: "center", fontWeight: "700" }}>Open Scripture →</Text></Pressable>
    <Pressable onPress={() => setPhase(p => Math.min(3, p + 1))} style={{ padding: 17, backgroundColor: colors.accent, borderRadius: 15, marginTop: 11 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>{phase === 3 ? "Take your time in silence" : "Continue →"}</Text></Pressable>
    <Pressable onPress={() => setPhase(p => Math.max(0, p - 1))} style={{ padding: 17 }}><Text style={{ color: colors.accent, textAlign: "center" }}>Previous phase</Text></Pressable>
    <Pressable onPress={() => router.push("/vault")} style={{ padding: 14 }}><Text style={{ color: colors.accent, textAlign: "center" }}>Write a reflection in Faith Vault →</Text></Pressable>
  </Screen>;
}
