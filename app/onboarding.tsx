import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";
import { ensureNotificationPermission } from "@/lib/notifications";
import type { AppMode, TextSize } from "@/lib/storage";

export default function OnboardingScreen() {
  const { updateSettings, colors } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [hour, setHour] = useState(7);
  const [mode, setMode] = useState<AppMode>("personal");

  const finish = async () => {
    await ensureNotificationPermission();
    await updateSettings({
      textSize,
      reminderHour: hour,
      reminderMinute: 0,
      mode,
      onboardingComplete: true,
    });
    router.replace("/(tabs)");
  };

  return (
    <Screen scroll>
      <Muted>Welcome — three taps to begin</Muted>
      <Title>Set up Daily Seasons</Title>

      {step === 0 && (
        <View>
          <Body>Choose text size</Body>
          {(["normal", "large"] as TextSize[]).map((t) => (
            <Choice
              key={t}
              label={t === "large" ? "Large" : "Comfortable"}
              selected={textSize === t}
              onPress={() => setTextSize(t)}
            />
          ))}
        </View>
      )}

      {step === 1 && (
        <View>
          <Body>Daily reminder time</Body>
          {[6, 7, 8, 12, 20].map((h) => (
            <Choice
              key={h}
              label={`${h}:00`}
              selected={hour === h}
              onPress={() => setHour(h)}
            />
          ))}
          <Muted style={styles.hint}>
            We will ask for notification permission when you continue.
          </Muted>
        </View>
      )}

      {step === 2 && (
        <View>
          <Body>Personal or family mode</Body>
          <Choice
            label="Personal"
            selected={mode === "personal"}
            onPress={() => setMode("personal")}
          />
          <Choice
            label="Family (shows optional family actions)"
            selected={mode === "family"}
            onPress={() => setMode("family")}
          />
        </View>
      )}

      <Pressable
        style={[styles.btn, { backgroundColor: colors.accent }]}
        onPress={() => (step < 2 ? setStep(step + 1) : void finish())}
      >
        <Body style={styles.btnText}>{step < 2 ? "Continue" : "Begin Advent"}</Body>
      </Pressable>
    </Screen>
  );
}

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choice,
        {
          borderColor: selected ? colors.accent : colors.border,
          backgroundColor: selected ? colors.card : "transparent",
        },
      ]}
    >
      <Body>{label}</Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  choice: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  btn: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  hint: { marginTop: 12 },
});
