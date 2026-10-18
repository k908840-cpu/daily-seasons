import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";

const DECADES = [
  "Annunciation",
  "Visitation",
  "Nativity",
  "Presentation",
  "Finding in the Temple",
];

export default function RosaryScreen() {
  const { colors } = useApp();
  const [bead, setBead] = useState(0);
  const total = 59;

  return (
    <Screen scroll>
      <Title>Holy Rosary</Title>
      <Muted>
        Tap to advance beads. Mystery text is a brief guide only — expand in a
        later content pass.
      </Muted>

      <View style={styles.counter}>
        <Title>{bead}</Title>
        <Muted> of {total} beads</Muted>
      </View>

      <Pressable
        style={[styles.btn, { backgroundColor: colors.accent }]}
        onPress={() => setBead((b) => Math.min(total, b + 1))}
      >
        <Body style={styles.btnText}>Next bead</Body>
      </Pressable>
      <Pressable style={styles.reset} onPress={() => setBead(0)}>
        <Body>Reset</Body>
      </Pressable>

      <Title style={styles.sub}>Joyful mysteries (sample)</Title>
      {DECADES.map((m, i) => (
        <Body key={i}>
          {i + 1}. {m}
        </Body>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  counter: { alignItems: "center", marginVertical: 24 },
  btn: { padding: 16, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
  reset: { alignItems: "center", marginTop: 12, padding: 12 },
  sub: { marginTop: 28 },
});
