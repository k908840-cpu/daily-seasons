import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { loadDailyPathProgress, saveDailyPathProgress } from "@/lib/storage";

const steps = [
  { title: "Arrive in stillness", detail: "Settle your attention. Breathe naturally and take a moment of quiet." },
  { title: "Read Scripture", detail: "Open a Bible passage and read it slowly. Notice a phrase that stands out." },
  { title: "Reflect", detail: "What might this passage invite you to notice, change, or give thanks for today?" },
  { title: "Pray", detail: "Speak to God in your own words. You may name a person or intention." },
  { title: "Rest in silence", detail: "Spend the remaining time quietly. There is nothing you need to achieve." },
];
export default function DailyPathScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const date = new Date().toISOString().slice(0, 10);
  const [duration, setDuration] = useState(5);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { void loadDailyPathProgress().then(p => { if (p?.date === date) { setDuration(p.duration); setCompleted(p.completedSteps); } setLoaded(true); }); }, [date]);
  useEffect(() => { if (loaded) void saveDailyPathProgress({ date, duration, completedSteps: completed }); }, [date, duration, completed, loaded]);
  const toggle = (i: number) => setCompleted(c => c.includes(i) ? c.filter(n => n !== i) : [...c, i]);
  return <Screen scroll style={{ padding: 22, paddingBottom: 65 }}>
    <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 2, fontWeight: "700" }}>A MOMENT FOR TODAY</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 10 }}>My Daily Path</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 9 }}>Five simple steps. No streaks, pressure or perfect days required.</Text>
    <View style={{ flexDirection: "row", gap: 9, marginTop: 23 }}>
      {[2, 5, 10, 15].map(n => <Pressable key={n} onPress={() => setDuration(n)} style={{ flex: 1, backgroundColor: duration === n ? colors.accent : colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 12 }}>
        <Text style={{ color: duration === n ? "#fff" : colors.text, textAlign: "center" }}>{n} min</Text>
      </Pressable>)}
    </View>
    <Text style={{ color: colors.muted, marginTop: 19, marginBottom: 12 }}>{completed.length} of {steps.length} steps completed today</Text>
    {steps.map((s, i) => <Pressable key={s.title} onPress={() => toggle(i)} style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 18, marginBottom: 11 }}>
      <Text style={{ color: colors.text, fontSize: 17, fontWeight: "600" }}>{completed.includes(i) ? "✓ " : `${i + 1}. `}{s.title}</Text>
      <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 7 }}>{s.detail}</Text>
      {i === 1 && <Text onPress={() => router.push("/scripture")} style={{ color: colors.accent, fontWeight: "700", marginTop: 12 }}>Open Scripture →</Text>}
      {i === 4 && <Text onPress={() => router.push("/timer")} style={{ color: colors.accent, fontWeight: "700", marginTop: 12 }}>Open quiet timer →</Text>}
    </Pressable>)}
    <Pressable onPress={() => router.push("/vault")} style={{ padding: 16, backgroundColor: colors.accent, borderRadius: 15, marginTop: 10 }}>
      <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Reflect in My Faith Vault →</Text>
    </Pressable>
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 18 }}>This is a flexible self-guided routine, not a timed audio program. Step completion is saved on your device.</Text>
  </Screen>;
}
