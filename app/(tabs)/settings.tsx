import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import type { TextSize } from "@/lib/storage";

export default function SettingsScreen() {
  const { settings, updateSettings, colors, premium, restore } = useApp();
  const router = useRouter();
  return (
    <Screen scroll style={styles.page}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>MAKE IT YOURS</Text>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>A quieter experience, your way.</Text>
      <Text style={[styles.heading, { color: colors.text }]}>Appearance</Text>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {(["system", "light", "dark"] as const).map((mode, i) => (
          <Pressable key={mode} onPress={() => void updateSettings({ darkMode: mode })} style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Ionicons name={mode === "system" ? "phone-portrait-outline" : mode === "light" ? "sunny-outline" : "moon-outline"} size={21} color={colors.accent} />
            <Text style={[styles.rowText, { color: colors.text }]}>{mode === "system" ? "Match device" : mode === "light" ? "Light" : "Dark"}</Text>
            {settings.darkMode === mode && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
          </Pressable>
        ))}
      </View>
      <Text style={[styles.heading, { color: colors.text }]}>Reading comfort</Text>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {(["normal", "large"] as TextSize[]).map((size, i) => (
          <Pressable key={size} onPress={() => void updateSettings({ textSize: size })} style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Ionicons name="text-outline" size={21} color={colors.accent} />
            <Text style={[styles.rowText, { color: colors.text }]}>{size === "normal" ? "Comfortable" : "Large text"}</Text>
            {settings.textSize === size && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
          </Pressable>
        ))}
      </View>
      <Text style={[styles.heading, { color: colors.text }]}>Personal prayer</Text>
      <Text style={[styles.detail, { color: colors.muted }]}>Choose your preferred prayer length and interests. Recommendations stay on your device.</Text>
      <View style={styles.times}>
        {[2, 5, 10, 15].map(n => <Pressable key={n} onPress={() => void updateSettings({ preferredDuration: n })} style={[styles.time, { backgroundColor: settings.preferredDuration === n ? colors.accent : colors.card, borderColor: colors.border }]}>
          <Text style={{ color: settings.preferredDuration === n ? "#fff" : colors.text }}>{n} min</Text>
        </Pressable>)}
      </View>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 14 }]}>
        {["Daily reflections", "Traditional prayers", "The Rosary", "Advent and Christmas", "Lent and Easter"].map((interest, i) => (
          <Pressable key={interest} onPress={() => void updateSettings({ preferredInterest: interest })} style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={[styles.rowText, { color: colors.text }]}>{interest}</Text>
            {settings.preferredInterest === interest && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
          </Pressable>
        ))}
      </View>
      <Text style={[styles.heading, { color: colors.text }]}>Daily reminder</Text>
      <Text style={[styles.detail, { color: colors.muted }]}>Choose a time for your daily reminder. Reminders require an installed app build and notification permission.</Text>
      <View style={styles.times}>
        {[6, 7, 8, 12, 20].map(hour => (
          <Pressable key={hour} onPress={() => void updateSettings({ reminderHour: hour, reminderMinute: 0 })} style={[styles.time, { backgroundColor: settings.reminderHour === hour ? colors.accent : colors.card, borderColor: settings.reminderHour === hour ? colors.accent : colors.border }]}>
            <Text style={{ color: settings.reminderHour === hour ? "#fff" : colors.text, fontWeight: "600" }}>{String(hour).padStart(2, "0")}:00</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.heading, { color: colors.text }]}>Access & information</Text>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable onPress={() => router.push("/paywall")} style={styles.row}>
          <Ionicons name="sparkles-outline" size={21} color={colors.accent} />
          <Text style={[styles.rowText, { color: colors.text }]}>{premium ? "Lifetime access unlocked" : "Explore lifetime access"}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
        <Pressable onPress={() => void restore()} style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Ionicons name="refresh-outline" size={21} color={colors.accent} />
          <Text style={[styles.rowText, { color: colors.text }]}>Restore purchase</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
        <Pressable onPress={() => router.push("/backup")} style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Ionicons name="download-outline" size={21} color={colors.accent} />
          <Text style={[styles.rowText, { color: colors.text }]}>Backup & restore my data</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
        <Pressable onPress={() => router.push("/sources")} style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Ionicons name="shield-checkmark-outline" size={21} color={colors.accent} />
          <Text style={[styles.rowText, { color: colors.text }]}>Sources & privacy</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      </View>
      <Text style={[styles.footer, { color: colors.muted }]}>Daily Seasons · A gentle companion through the Christian year.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  page: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 60 }, eyebrow: { fontSize: 11, letterSpacing: 2.2, fontWeight: "800", marginBottom: 10 },
  title: { fontSize: 32, fontWeight: "600" }, subtitle: { fontSize: 15, marginTop: 8, marginBottom: 16 },
  heading: { fontSize: 20, fontWeight: "600", marginTop: 26, marginBottom: 14 }, panel: { borderWidth: 1, borderRadius: 19, overflow: "hidden" },
  row: { flexDirection: "row", minHeight: 60, alignItems: "center", gap: 13, paddingHorizontal: 17 },
  rowText: { flex: 1, fontSize: 15, fontWeight: "500" }, detail: { fontSize: 13, lineHeight: 20, marginBottom: 14 },
  times: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, time: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 15, paddingVertical: 12 },
  footer: { fontSize: 12, textAlign: "center", marginTop: 35, lineHeight: 19 },
});
