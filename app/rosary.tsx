import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";

const mysteries = {
  Joyful: ["The Annunciation", "The Visitation", "The Nativity", "The Presentation", "The Finding in the Temple"],
  Sorrowful: ["The Agony in the Garden", "The Scourging at the Pillar", "The Crowning with Thorns", "The Carrying of the Cross", "The Crucifixion"],
  Glorious: ["The Resurrection", "The Ascension", "The Descent of the Holy Spirit", "The Assumption", "The Coronation of Mary"],
  Luminous: ["The Baptism of Jesus", "The Wedding at Cana", "The Proclamation of the Kingdom", "The Transfiguration", "The Institution of the Eucharist"],
};
type Mystery = keyof typeof mysteries;
const kinds = Object.keys(mysteries) as Mystery[];

export default function RosaryScreen() {
  const { colors } = useApp();
  const [kind, setKind] = useState<Mystery>("Joyful");
  const [bead, setBead] = useState(0);
  const decade = bead <= 3 ? -1 : Math.min(4, Math.floor((bead - 4) / 11));
  return (
    <Screen scroll style={styles.page}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>A GUIDED MOMENT</Text>
      <Text style={[styles.title, { color: colors.text }]}>The Holy Rosary</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Choose a mystery and follow along at your own pace.</Text>
      <View style={styles.kinds}>
        {kinds.map(k => <Pressable key={k} onPress={() => { setKind(k); setBead(0); }} style={[styles.chip, { backgroundColor: kind === k ? colors.accent : colors.card, borderColor: kind === k ? colors.accent : colors.border }]}>
          <Text style={{ color: kind === k ? "#fff" : colors.text, fontWeight: "600" }}>{k}</Text>
        </Pressable>)}
      </View>
      <View style={[styles.counter, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="ellipse-outline" size={42} color={colors.gold} />
        <Text style={[styles.count, { color: colors.text }]}>{bead}</Text>
        <Text style={[styles.countCaption, { color: colors.muted }]}>of 59 beads</Text>
        <View style={[styles.progress, { backgroundColor: colors.border }]}>
          <View style={{ width: `${bead / 59 * 100}%`, height: "100%", backgroundColor: colors.accent, borderRadius: 5 }} />
        </View>
        <Text style={[styles.current, { color: colors.accent }]}>{decade < 0 ? "Opening prayers" : mysteries[kind][decade]}</Text>
      </View>
      <Pressable onPress={() => setBead(b => Math.min(59, b + 1))} disabled={bead === 59} style={[styles.primary, { backgroundColor: colors.accent, opacity: bead === 59 ? 0.55 : 1 }]}>
        <Text style={styles.primaryText}>{bead === 59 ? "Rosary complete" : "Next bead"}</Text><Ionicons name="arrow-forward" color="#fff" size={20} />
      </Pressable>
      <View style={styles.actions}>
        <Pressable onPress={() => setBead(b => Math.max(0, b - 1))} style={styles.action}><Text style={[styles.actionText, { color: colors.accent }]}>Previous</Text></Pressable>
        <Pressable onPress={() => setBead(0)} style={styles.action}><Text style={[styles.actionText, { color: colors.accent }]}>Start over</Text></Pressable>
      </View>
      <Text style={[styles.heading, { color: colors.text }]}>{kind} mysteries</Text>
      {mysteries[kind].map((m, i) => <View key={m} style={[styles.mystery, { borderColor: colors.border }]}>
        <Text style={[styles.mysteryNumber, { color: colors.gold }]}>{String(i + 1).padStart(2, "0")}</Text>
        <Text style={[styles.mysteryText, { color: colors.text }]}>{m}</Text>
      </View>)}
      <Text style={[styles.disclaimer, { color: colors.muted }]}>Mystery titles are a reference guide. Full prayer texts and a detailed bead-by-bead guide are not yet included.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  page: { padding: 22, paddingBottom: 50 }, eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: "800", marginBottom: 10 },
  title: { fontSize: 32, fontWeight: "600" }, subtitle: { fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 22 },
  kinds: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 22 }, chip: { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1 },
  counter: { borderRadius: 25, borderWidth: 1, padding: 26, alignItems: "center" }, count: { fontSize: 64, fontWeight: "600", marginTop: 12 },
  countCaption: { fontSize: 14 }, progress: { height: 7, width: "100%", borderRadius: 5, overflow: "hidden", marginTop: 22 },
  current: { fontSize: 15, fontWeight: "600", marginTop: 18, textAlign: "center" },
  primary: { minHeight: 60, borderRadius: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 18 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" }, actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  action: { padding: 14 }, actionText: { fontSize: 14, fontWeight: "600" }, heading: { fontSize: 23, fontWeight: "600", marginTop: 30, marginBottom: 8 },
  mystery: { flexDirection: "row", gap: 15, borderBottomWidth: 1, paddingVertical: 16, alignItems: "center" },
  mysteryNumber: { fontSize: 15, fontWeight: "700" }, mysteryText: { fontSize: 15, flex: 1 },
  disclaimer: { fontSize: 12, lineHeight: 19, marginTop: 22 },
});
