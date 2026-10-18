import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { journeysForYear, journeyProgressKey } from "@/data/seasonalJourneys";
import { loadProgress, markDayRead } from "@/lib/storage";
import { getCurrentSeason } from "@/lib/churchCalendar";
export default function SeasonalJourneysScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const year = new Date().getFullYear();
  const journeys = useMemo(() => journeysForYear(year), [year]);
  const current = getCurrentSeason()?.id ?? "ordinary";
  const [selected, setSelected] = useState(current);
  const [read, setRead] = useState<string[]>([]);
  const journey = journeys.find(j => j.id === selected) ?? journeys[0];
  useEffect(() => { void loadProgress().then(p => setRead(p.readDays)); }, []);
  const mark = async (day: number) => { const p = await markDayRead(journeyProgressKey(journey, day)); setRead(p.readDays); };
  return <Screen scroll style={{ padding: 20, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>WALK THROUGH THE YEAR</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 9 }}>Seasonal journeys</Text>
    <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 10 }}>Choose a season for short daily reflection prompts. Your progress is saved offline.</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
      {journeys.map(j => <Pressable key={j.id} onPress={() => setSelected(j.id)} style={{ backgroundColor: selected === j.id ? colors.accent : colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 13 }}>
        <Text style={{ color: selected === j.id ? "#fff" : colors.text }}>{j.id === "holy-week" ? "Holy Week" : j.title.split(":")[0]}</Text>
      </Pressable>)}
    </View>
    <Text style={{ color: colors.text, fontSize: 23, fontWeight: "600", marginTop: 27 }}>{journey.title}</Text>
    <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 22 }}>{journey.intro}</Text>
    <Text style={{ color: colors.accent, marginTop: 15, marginBottom: 12, fontWeight: "600" }}>{Array.from({ length: journey.days }, (_, i) => journeyProgressKey(journey, i + 1)).filter(k => read.includes(k)).length} / {journey.days} days completed</Text>
    {Array.from({ length: journey.days }, (_, i) => {
      const day = i + 1;
      const done = read.includes(journeyProgressKey(journey, day));
      const prompt = journey.prompts[i % journey.prompts.length];
      const reference = journey.references[i % journey.references.length];
      return <View key={day} style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 10 }}>
        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{done ? "✓ " : ""}Day {day}</Text>
        <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 7 }}>{prompt}</Text>
        <Text style={{ color: colors.accent, marginTop: 8 }}>Suggested Scripture: {reference}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <Pressable onPress={() => router.push("/scripture")}><Text style={{ color: colors.accent, fontWeight: "600" }}>Open Bible →</Text></Pressable>
          <Pressable onPress={() => void mark(day)} disabled={done}><Text style={{ color: done ? colors.muted : colors.accent, fontWeight: "600" }}>{done ? "Completed" : "Mark complete"}</Text></Pressable>
        </View>
      </View>;
    })}
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 12 }}>These are original reusable reflection prompts, not an official lectionary or complete daily devotional texts. Journey day numbers are independent of the calendar date.</Text>
  </Screen>;
}
