import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import * as Speech from "expo-speech";
import { Screen } from "@/components/Screen";
import { Body, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";

export default function TimerScreen() {
  const { colors } = useApp();
  const [seconds, setSeconds] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    interval.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          Speech.speak("Amen.", { rate: 0.9 });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Screen>
      <View style={styles.center}>
        <Title>
          {mm}:{ss}
        </Title>
        <Body style={styles.hint}>Soft bell via speech at end (replace with audio asset later).</Body>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={() => setRunning((r) => !r)}
        >
          <Body style={styles.btnText}>{running ? "Pause" : "Start"}</Body>
        </Pressable>
        <Pressable
          onPress={() => {
            setRunning(false);
            setSeconds(5 * 60);
          }}
        >
          <Body>Reset to 5 minutes</Body>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  hint: { textAlign: "center", marginVertical: 16 },
  btn: { padding: 16, borderRadius: 12, minWidth: 160, alignItems: "center", marginBottom: 16 },
  btnText: { color: "#fff", fontWeight: "600" },
});
