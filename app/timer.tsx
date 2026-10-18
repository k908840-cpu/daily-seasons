import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";

const durations = [2, 5, 10, 15];
export default function TimerScreen() {
  const { colors } = useApp();
  const [duration, setDuration] = useState(5);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const deadline = useRef<number | null>(null);
  useEffect(() => {
    if (!running) return;
    deadline.current = Date.now() + remaining * 1000;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.ceil(((deadline.current ?? Date.now()) - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setRunning(false);
    }, 250);
    return () => clearInterval(interval);
  }, [running]);
  const choose = (minutes: number) => { setRunning(false); setDuration(minutes); setRemaining(minutes * 60); };
  const reset = () => choose(duration);
  return (
    <Screen scroll style={styles.page}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>BE STILL</Text>
      <Text style={[styles.title, { color: colors.text }]}>Prayer timer</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Set aside a little time for quiet reflection.</Text>
      <View style={styles.options}>{durations.map(min => <Pressable key={min} onPress={() => choose(min)} style={[styles.chip, { backgroundColor: duration === min ? colors.accent : colors.card, borderColor: duration === min ? colors.accent : colors.border }]}>
        <Text style={{ color: duration === min ? "#fff" : colors.text, fontWeight: "600" }}>{min} min</Text>
      </Pressable>)}</View>
      <View style={[styles.clock, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="leaf-outline" size={35} color={colors.gold} />
        <Text style={[styles.time, { color: colors.text }]}>{String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}</Text>
        <Text style={[styles.caption, { color: colors.muted }]}>{remaining === 0 ? "Your quiet moment is complete" : running ? "Take a gentle breath" : "Whenever you're ready"}</Text>
      </View>
      <Pressable onPress={() => setRunning(r => !r)} disabled={remaining === 0} style={[styles.primary, { backgroundColor: colors.accent, opacity: remaining === 0 ? 0.5 : 1 }]}>
        <Ionicons name={running ? "pause" : "play"} size={20} color="#fff" />
        <Text style={styles.primaryText}>{running ? "Pause timer" : "Begin quiet time"}</Text>
      </Pressable>
      <Pressable onPress={reset} style={styles.reset}><Ionicons name="refresh-outline" size={18} color={colors.accent} /><Text style={[styles.resetText, { color: colors.accent }]}>Reset timer</Text></Pressable>
      <Text style={[styles.note, { color: colors.muted }]}>A silent timer, with no streaks or pressure. Keep this screen open while praying.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  page: { padding: 22, paddingBottom: 60 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 2, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: "600" }, subtitle: { fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 28 },
  options: { flexDirection: "row", gap: 8, marginBottom: 24 }, chip: { flex: 1, alignItems: "center", paddingVertical: 12, borderWidth: 1, borderRadius: 15 },
  clock: { borderRadius: 26, borderWidth: 1, paddingVertical: 56, alignItems: "center" },
  time: { fontSize: 64, fontWeight: "600", letterSpacing: -2, marginTop: 17 },
  caption: { fontSize: 14, marginTop: 8 }, primary: { borderRadius: 17, minHeight: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 22 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" }, reset: { flexDirection: "row", gap: 8, justifyContent: "center", padding: 20 },
  resetText: { fontSize: 14, fontWeight: "600" }, note: { fontSize: 13, lineHeight: 21, textAlign: "center", marginTop: 28 },
});
