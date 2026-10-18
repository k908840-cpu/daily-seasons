import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";

const steps = [
  {
    kicker: "YOUR JOURNEY",
    title: "What brings you here?",
    subtitle: "Choose what matters most right now.",
    options: ["Find a moment of peace", "Grow closer to God", "Build a prayer habit", "Explore Scripture", "Follow the Christian seasons"],
  },
  {
    kicker: "YOUR RHYTHM",
    title: "When do you find time to pause?",
    subtitle: "There is no perfect time to pray.",
    options: ["Early morning", "During the day", "In the evening", "Whenever I need it"],
  },
  {
    kicker: "YOUR INTERESTS",
    title: "What would you like to explore?",
    subtitle: "Choose a starting point. You can explore everything later.",
    options: ["Daily reflections", "Traditional prayers", "The Rosary", "Advent and Christmas", "Lent and Easter"],
  },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, updateSettings } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const current = steps[step];
  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Store only the choices needed for future local personalization.
      await updateSettings({ onboardingComplete: true });
      router.replace("/(tabs)");
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    if (!selected) return;
    setAnswers((prev) => [...prev.slice(0, step), selected]);
    if (step === steps.length - 1) {
      setStep(steps.length);
    } else {
      setStep((prev) => prev + 1);
      setSelected(answers[step + 1] ?? null);
    }
  };

  return (
    <Screen scroll style={styles.page}>
      <View style={styles.topRow}>
        <Text style={[styles.brand, { color: colors.accent }]}>DAILY SEASONS</Text>
        <Text style={[styles.progress, { color: colors.muted }]}>
          {step < steps.length ? `${step + 1} OF ${steps.length}` : "READY"}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { backgroundColor: colors.accent, width: `${((step + 1) / (steps.length + 1)) * 100}%` }]} />
      </View>

      {current ? (
        <>
          <Text style={[styles.kicker, { color: colors.accent }]}>{current.kicker}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{current.title}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{current.subtitle}</Text>
          <View style={styles.options}>
            {current.options.map((option) => {
              const active = selected === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  onPress={() => setSelected(option)}
                  style={[styles.option, { backgroundColor: colors.card, borderColor: active ? colors.accent : colors.border }]}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
                  <Ionicons name={active ? "checkmark-circle" : "ellipse-outline"} size={23} color={active ? colors.accent : colors.muted} />
                </Pressable>
              );
            })}
          </View>
          <Pressable
            disabled={!selected}
            onPress={next}
            style={[styles.button, { backgroundColor: colors.accent, opacity: selected ? 1 : 0.45 }]}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </>
      ) : (
        <>
          <View style={[styles.symbol, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="sparkles-outline" size={38} color={colors.accent} />
          </View>
          <Text style={[styles.kicker, { color: colors.accent }]}>A NEW BEGINNING</Text>
          <Text style={[styles.title, { color: colors.text }]}>A little space for what matters.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Your Daily Seasons journey is ready. Explore daily reflections, prayer, and the Christian year at your own pace.
          </Text>
          <View style={[styles.note, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="heart-outline" size={22} color={colors.accent} />
            <Text style={[styles.noteText, { color: colors.text }]}>
              Begin with free content. Optional lifetime access is available inside the app — no subscription or payment is required to start.
            </Text>
          </View>
          <Pressable onPress={() => void finish()} disabled={busy} style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={styles.buttonText}>{busy ? "Opening..." : "Begin my journey"}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </>
      )}
      {step > 0 && step < steps.length && (
        <Pressable onPress={() => { setStep(step - 1); setSelected(answers[step - 1] ?? null); }} style={styles.back}>
          <Text style={[styles.backText, { color: colors.muted }]}>Back</Text>
        </Pressable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 24, paddingTop: 26, paddingBottom: 60 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { fontSize: 12, letterSpacing: 2.2, fontWeight: "800" },
  progress: { fontSize: 11, fontWeight: "700", letterSpacing: 1.3 },
  track: { height: 4, borderRadius: 4, overflow: "hidden", marginTop: 20, marginBottom: 52 },
  fill: { height: 4, borderRadius: 4 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 2, marginBottom: 13 },
  title: { fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 41, marginBottom: 13 },
  subtitle: { fontSize: 16, lineHeight: 25, marginBottom: 30 },
  options: { gap: 12 },
  option: { minHeight: 68, borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 19, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  optionText: { flex: 1, fontSize: 16, fontWeight: "500", lineHeight: 23 },
  button: { marginTop: 32, borderRadius: 18, minHeight: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  back: { alignSelf: "center", padding: 16, marginTop: 6 },
  backText: { fontSize: 14 },
  symbol: { width: 84, height: 84, borderRadius: 26, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 32 },
  note: { flexDirection: "row", gap: 13, padding: 18, borderRadius: 18, borderWidth: 1, alignItems: "flex-start" },
  noteText: { flex: 1, fontSize: 14, lineHeight: 22 },
});
