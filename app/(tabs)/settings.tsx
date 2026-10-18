import { Pressable, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";
import type { TextSize } from "@/lib/storage";

export default function SettingsScreen() {
  const { settings, updateSettings, colors, premium, restore } = useApp();

  return (
    <Screen scroll>
      <Title>Settings</Title>

      <Muted>Text size</Muted>
      {(["normal", "large"] as TextSize[]).map((t) => (
        <Pressable
          key={t}
          onPress={() => void updateSettings({ textSize: t })}
          style={[
            styles.row,
            {
              borderColor: colors.border,
              backgroundColor:
                settings.textSize === t ? colors.card : "transparent",
            },
          ]}
        >
          <Body>{t === "large" ? "Large" : "Comfortable"}</Body>
        </Pressable>
      ))}

      <Muted style={styles.section}>Appearance</Muted>
      {(["system", "light", "dark"] as const).map((m) => (
        <Pressable
          key={m}
          onPress={() => void updateSettings({ darkMode: m })}
          style={[styles.row, { borderColor: colors.border }]}
        >
          <Body>
            {m === "system" ? "Match system" : m === "light" ? "Light" : "Dark"}
            {settings.darkMode === m ? " ✓" : ""}
          </Body>
        </Pressable>
      ))}

      <Muted style={styles.section}>Reminder</Muted>
      <Body>
        Daily at {settings.reminderHour}:{String(settings.reminderMinute).padStart(2, "0")}
      </Body>
      <Muted>Change time by re-running setup in a future settings picker.</Muted>

      <Muted style={styles.section}>Purchase</Muted>
      <Body>{premium ? "Lifetime unlocked" : "Free trial: Advent days 1–7"}</Body>
      <Pressable onPress={() => void restore()} style={styles.restore}>
        <Body>Restore purchase</Body>
      </Pressable>

      <Link href="/sources" asChild>
        <Pressable style={styles.restore}>
          <Body>Sources & privacy</Body>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
  },
  section: { marginTop: 24, marginBottom: 4 },
  restore: { marginTop: 12, padding: 8 },
});
