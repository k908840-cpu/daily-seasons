import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";

const steps = [
  { kicker: "YOUR ROOTS", title: "Every journey begins somewhere.", subtitle: "Which Christian tradition feels like home to you?", options: ["Catholic", "Orthodox", "Anglican", "Protestant", "Other Christian", "Exploring / not sure"], icons: ["heart-outline", "sparkles-outline", "leaf-outline", "book-outline", "earth-outline", "compass-outline"] },
  { kicker: "YOUR HEART", title: "What is your heart looking for?", subtitle: "There is no wrong reason to begin.", options: ["Find a moment of peace", "Grow closer to God", "Build a prayer habit", "Explore Scripture", "Follow the Christian seasons"], icons: ["moon-outline", "heart-outline", "flame-outline", "book-outline", "sunny-outline"] },
  { kicker: "YOUR RHYTHM", title: "Find a moment that's yours.", subtitle: "We'll shape your daily experience around your rhythm.", options: ["Early morning", "During the day", "In the evening", "Whenever I need it"], icons: ["sunny-outline", "partly-sunny-outline", "moon-outline", "infinite-outline"] },
  { kicker: "YOUR MOMENT", title: "Even a little time matters.", subtitle: "How long would you like your daily pause to be?", options: ["2 minutes", "5 minutes", "10 minutes", "15 minutes"], icons: ["flash-outline", "time-outline", "hourglass-outline", "leaf-outline"] },
  { kicker: "YOUR PATH", title: "What would you love to explore?", subtitle: "We'll begin here. Everything else stays open to you.", options: ["Daily reflections", "Traditional prayers", "The Rosary", "Advent and Christmas", "Lent and Easter"], icons: ["sunny-outline", "book-outline", "ellipse-outline", "star-outline", "flower-outline"] },
] as const;

const STEP_COUNT = steps.length;
const iconName = (value: string): React.ComponentProps<typeof Ionicons>["name"] => value as React.ComponentProps<typeof Ionicons>["name"];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, updateSettings } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const motion = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const selectionPulse = useRef(new Animated.Value(1)).current;
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReduceMotion(value); });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => { active = false; sub.remove(); };
  }, []);

  useEffect(() => {
    motion.stopAnimation();
    progress.stopAnimation();
    if (reduceMotion) {
      motion.setValue(1);
      progress.setValue((step + 1) / (STEP_COUNT + 1));
    } else {
      motion.setValue(0);
      Animated.parallel([
        Animated.spring(motion, { toValue: 1, friction: 9, tension: 70, useNativeDriver: true }),
        Animated.timing(progress, { toValue: (step + 1) / (STEP_COUNT + 1), duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]).start();
    }
    scroll.current?.scrollTo({ y: 0, animated: !reduceMotion });
  }, [step, reduceMotion, motion, progress]);

  const choose = (value: string) => {
    setSelected(value);
    if (reduceMotion) return;
    selectionPulse.setValue(0.97);
    Animated.spring(selectionPulse, { toValue: 1, friction: 5, tension: 180, useNativeDriver: true }).start();
  };

  const next = () => {
    if (!selected) return;
    setAnswers(prev => [...prev.slice(0, step), selected]);
    setStep(prev => prev + 1);
    setSelected(answers[step + 1] ?? null);
  };

  const back = () => {
    if (step === 0) return;
    const previous = step - 1;
    setStep(previous);
    setSelected(answers[previous] ?? null);
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await updateSettings({
        onboardingComplete: true,
        denomination: answers[0] as "Catholic" | "Orthodox" | "Anglican" | "Protestant" | "Other Christian" | "Exploring / not sure",
        spiritualGoal: answers[1],
        preferredPrayerTime: answers[2],
        preferredDuration: Number.parseInt(answers[3] ?? "5", 10) || 5,
        preferredInterest: answers[4],
      });
      router.replace("/(tabs)");
    } finally {
      setBusy(false);
    }
  };

  const current = steps[step];
  const isReady = step >= STEP_COUNT;
  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const arrival = { opacity: motion, transform: [{ translateY: motion.interpolate({ inputRange: [0, 1], outputRange: [reduceMotion ? 0 : 34, 0] }) }, { scale: motion.interpolate({ inputRange: [0, 1], outputRange: [reduceMotion ? 1 : 0.97, 1] }) }] };
  const tradition = answers[0] === "Exploring / not sure" ? "your own path" : answers[0] ?? "your own path";
  const goal = answers[1] ?? "a moment of peace";
  const interest = answers[4] ?? "daily reflection";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView ref={scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.top}>
          <View style={[styles.brandIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="sparkles" size={17} color="#fff" />
          </View>
          <Text style={[styles.brand, { color: colors.text }]}>DAILY SEASONS</Text>
          <Text style={[styles.counter, { color: colors.muted }]}>{isReady ? "YOUR BEGINNING" : String(step + 1).padStart(2, "0") + " / " + String(STEP_COUNT).padStart(2, "0")}</Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <Animated.View style={[styles.trackFill, { width: progressWidth, backgroundColor: colors.accent }]} />
        </View>

        <Animated.View style={arrival}>
          <View style={[styles.art, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.haloOuter, { borderColor: colors.border }]}>
              <View style={[styles.haloMiddle, { backgroundColor: colors.background }]}>
                <Ionicons name={isReady ? "heart" : iconName(current.icons[Math.min(step, current.icons.length - 1)])} size={54} color={colors.accent} />
              </View>
            </View>
            <View style={[styles.orbitOne, { backgroundColor: colors.accent }]} />
            <View style={[styles.orbitTwo, { borderColor: colors.accent }]} />
            <Text style={[styles.artCaption, { color: colors.muted }]}>{isReady ? "MADE FOR YOUR JOURNEY" : "A MOMENT JUST FOR YOU"}</Text>
          </View>

          {isReady ? (
            <>
              <Text style={[styles.kicker, { color: colors.accent }]}>WELCOME HOME</Text>
              <Text style={[styles.title, { color: colors.text }]}>A quieter journey, made yours.</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>You've chosen a starting point. Your path can grow and change with you.</Text>
              <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.summaryEyebrow, { color: colors.accent }]}>YOUR DAILY SEASONS</Text>
                <Text style={[styles.summaryTitle, { color: colors.text }]}>A space for {goal.toLowerCase()}.</Text>
                <Text style={[styles.summaryLine, { color: colors.muted }]}>Rooted in {tradition} · {answers[3] ?? "5 minutes"} a day</Text>
                <Text style={[styles.summaryLine, { color: colors.muted }]}>Begin with {interest.toLowerCase()}</Text>
              </View>
              <Text style={[styles.footnote, { color: colors.muted }]}>Start for free. Your choices stay on your device and can be changed anytime.</Text>
              <Pressable disabled={busy} accessibilityRole="button" onPress={() => void finish()} style={[styles.primary, { backgroundColor: colors.accent }]}>
                <Text style={styles.primaryText}>{busy ? "Opening your space..." : "Begin my journey"}</Text>
                <Ionicons name="arrow-forward" size={21} color="#fff" />
              </Pressable>
            </>
          ) : (
            <>
              <Text style={[styles.kicker, { color: colors.accent }]}>{current.kicker}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{current.title}</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>{current.subtitle}</Text>
              <View style={styles.options}>
                {current.options.map((option, i) => {
                  const active = selected === option;
                  return (
                    <Animated.View key={option} style={active ? { transform: [{ scale: selectionPulse }] } : undefined}>
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: active }}
                        onPress={() => choose(option)}
                        style={[styles.option, { backgroundColor: active ? colors.accent : colors.card, borderColor: active ? colors.accent : colors.border }]}
                      >
                        <View style={[styles.optionIcon, { backgroundColor: active ? "rgba(255,255,255,0.16)" : colors.background }]}>
                          <Ionicons name={iconName(current.icons[i])} size={23} color={active ? "#fff" : colors.accent} />
                        </View>
                        <Text style={[styles.optionText, { color: active ? "#fff" : colors.text }]}>{option}</Text>
                        <Ionicons name={active ? "checkmark-circle" : "arrow-forward-circle-outline"} size={23} color={active ? "#fff" : colors.muted} />
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
              <Pressable accessibilityRole="button" disabled={!selected} onPress={next} style={[styles.primary, { backgroundColor: colors.accent, opacity: selected ? 1 : 0.45 }]}>
                <Text style={styles.primaryText}>Continue</Text>
                <Ionicons name="arrow-forward" size={21} color="#fff" />
              </Pressable>
              <Text style={[styles.footnote, { color: colors.muted }]}>There are no wrong answers. Change your preferences anytime.</Text>
            </>
          )}
        </Animated.View>
        {step > 0 && <Pressable accessibilityRole="button" onPress={back} style={styles.back}><Ionicons name="arrow-back" size={18} color={colors.muted} /><Text style={{ color: colors.muted, fontSize: 14 }}>Go back</Text></Pressable>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  page: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 70 },
  top: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandIcon: { width: 31, height: 31, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  brand: { fontSize: 12, fontWeight: "800", letterSpacing: 1.7, flex: 1 },
  counter: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  track: { height: 5, borderRadius: 5, overflow: "hidden", marginTop: 23, marginBottom: 23 },
  trackFill: { height: 5, borderRadius: 5 },
  art: { height: 194, borderWidth: 1, borderRadius: 30, justifyContent: "center", alignItems: "center", marginBottom: 30, overflow: "hidden" },
  haloOuter: { width: 148, height: 148, borderWidth: 1, borderRadius: 74, justifyContent: "center", alignItems: "center" },
  haloMiddle: { width: 116, height: 116, borderRadius: 58, justifyContent: "center", alignItems: "center" },
  orbitOne: { position: "absolute", width: 13, height: 13, borderRadius: 7, top: 32, right: 65, opacity: 0.55 },
  orbitTwo: { position: "absolute", width: 21, height: 21, borderRadius: 11, borderWidth: 2, bottom: 37, left: 52, opacity: 0.5 },
  artCaption: { position: "absolute", bottom: 12, fontSize: 9, fontWeight: "700", letterSpacing: 2 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 2.3, marginBottom: 11 },
  title: { fontSize: 32, lineHeight: 39, letterSpacing: -0.8, fontWeight: "700", marginBottom: 11 },
  subtitle: { fontSize: 15, lineHeight: 23, marginBottom: 23 },
  options: { gap: 10 },
  option: { flexDirection: "row", alignItems: "center", minHeight: 68, padding: 12, borderWidth: 1.5, borderRadius: 20, gap: 13 },
  optionIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  optionText: { flex: 1, fontSize: 15, lineHeight: 21, fontWeight: "600" },
  primary: { marginTop: 23, minHeight: 60, borderRadius: 19, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 13 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footnote: { fontSize: 12, lineHeight: 19, textAlign: "center", marginTop: 15 },
  back: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, padding: 16, marginTop: 10 },
  summary: { borderWidth: 1, borderRadius: 22, padding: 20, gap: 10 },
  summaryEyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.8 },
  summaryTitle: { fontSize: 21, lineHeight: 29, fontWeight: "700" },
  summaryLine: { fontSize: 14, lineHeight: 22 },
});
