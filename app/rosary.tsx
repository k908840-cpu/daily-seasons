import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { buildRosary, MYSTERIES, suggestedMystery, type MysteryKind } from "@/lib/rosaryGuide";
import { loadRosarySession, saveRosarySession } from "@/lib/storage";

export default function RosaryScreen() {
  const { colors } = useApp();
  const [kind, setKind] = useState<MysteryKind>(suggestedMystery(new Date().getDay()));
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const steps = useMemo(() => buildRosary(kind), [kind]);
  useEffect(() => { void loadRosarySession().then(s => { if (s) { setKind(s.kind); setStep(Math.max(0, Math.min(s.step, buildRosary(s.kind).length - 1))); } setReady(true); }); }, []);
  useEffect(() => { if (ready) void saveRosarySession({ kind, step }); }, [kind, step, ready]);
  const current = steps[step];
  const button = (label: string, action: () => void, selected = false) => <Pressable key={label} onPress={action} style={{ padding: 12, borderRadius: 14, backgroundColor: selected ? colors.accent : colors.card, borderColor: colors.border, borderWidth: 1 }}>
    <Text style={{ color: selected ? "#fff" : colors.text, fontWeight: "600" }}>{label}</Text>
  </Pressable>;
  return <Screen scroll style={{ padding: 22, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>GUIDED DEVOTION</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 9 }}>The Holy Rosary</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 9 }}>Follow each prayer and mystery at your own pace. Your place is saved on this device.</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 20 }}>
      {(Object.keys(MYSTERIES) as MysteryKind[]).map(k => button(k, () => { setKind(k); setStep(0); }, kind === k))}
    </View>
    <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 23, padding: 24, marginTop: 24 }}>
      <Text style={{ color: colors.gold, fontWeight: "700" }}>STEP {step + 1} OF {steps.length}</Text>
      <View style={{ backgroundColor: colors.border, height: 7, borderRadius: 5, marginVertical: 18, overflow: "hidden" }}><View style={{ width: `${(step + 1) / steps.length * 100}%`, height: 7, backgroundColor: colors.accent }} /></View>
      <Text style={{ color: colors.text, fontSize: 23, fontWeight: "600" }}>{current.title}</Text>
      {!!current.mystery && <Text style={{ color: colors.accent, marginTop: 11, fontWeight: "600" }}>{current.mystery}</Text>}
      <Text style={{ color: colors.muted, lineHeight: 23, marginTop: 12 }}>{current.instruction}</Text>
    </View>
    <Pressable disabled={step === steps.length - 1} onPress={() => setStep(s => Math.min(steps.length - 1, s + 1))} style={{ backgroundColor: colors.accent, padding: 18, borderRadius: 16, marginTop: 18, opacity: step === steps.length - 1 ? 0.6 : 1 }}>
      <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>{step === steps.length - 1 ? "Closing prayers reached" : "Next prayer →"}</Text>
    </Pressable>
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
      {button("← Previous", () => setStep(s => Math.max(0, s - 1)))}
      {button("Start over", () => setStep(0))}
    </View>
    <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginTop: 30 }}>The five mysteries</Text>
    {MYSTERIES[kind].map((m, i) => <Text key={m} style={{ color: colors.text, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>{i + 1}. {m}</Text>)}
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 23 }}>This guide identifies the traditional prayer sequence. Full prayer wording, optional variations and audio are pending verification.</Text>
  </Screen>;
}
