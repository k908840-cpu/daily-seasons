import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { loadNovenaProgress, saveNovenaProgress } from "@/lib/storage";

const journeys = [
  { id: "gratitude", title: "Nine Days of Gratitude", focus: ["Life", "Family and friends", "Creation", "Daily provision", "Strength", "Forgiveness", "Hope", "Community", "The days ahead"] },
  { id: "peace", title: "Nine Days of Peace", focus: ["Stillness", "Patience", "Understanding", "Reconciliation", "Trust", "Compassion", "Courage", "Rest", "Peace for others"] },
];
export default function NovenasScreen() {
  const { colors } = useApp();
  const [selected, setSelected] = useState(journeys[0].id);
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  useEffect(() => { void loadNovenaProgress().then(setProgress); }, []);
  const journey = journeys.find(j => j.id === selected)!;
  const done = progress[selected] ?? [];
  const toggle = async (day: number) => {
    const next = { ...progress, [selected]: done.includes(day) ? done.filter(n => n !== day) : [...done, day] };
    setProgress(next);
    await saveNovenaProgress(next);
  };
  return <Screen scroll style={{ padding: 22, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 2, fontWeight: "700" }}>NINE DAYS OF PRAYER</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 10 }}>Prayer journeys</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 10 }}>Choose a nine-day intention. Reflect and pray in your own words each day.</Text>
    <View style={{ gap: 9, marginTop: 22 }}>{journeys.map(j => <Pressable key={j.id} onPress={() => setSelected(j.id)} style={{ backgroundColor: selected === j.id ? colors.accent : colors.card, padding: 15, borderRadius: 14, borderWidth: 1, borderColor: colors.border }}><Text style={{ color: selected === j.id ? "#fff" : colors.text, fontWeight: "600" }}>{j.title}</Text></Pressable>)}</View>
    <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginTop: 25, marginBottom: 12 }}>{done.length} of 9 days</Text>
    {journey.focus.map((focus, i) => <Pressable key={focus} onPress={() => void toggle(i + 1)} style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 15, padding: 17, marginBottom: 9 }}>
      <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>{done.includes(i + 1) ? "✓ " : ""}Day {i + 1} · {focus}</Text>
      <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 21 }}>Take a moment to reflect on {focus.toLowerCase()}. Offer a prayer in your own words, then mark the day complete.</Text>
    </Pressable>)}
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 17 }}>These are original self-guided nine-day reflection journeys, not traditional saint-specific novenas. Verified traditional novena texts are still planned.</Text>
  </Screen>;
}
